/**
 * Scheduler service - triggers scheduled agent runs
 */

import { prisma } from "../db/client.js";
import { runQueue, type RunJobData } from "../infra/Queue.js";
import { logger } from "../infra/Logger.js";

export class Scheduler {
  private interval: NodeJS.Timeout | null = null;

  start(): void {
    // Check for scheduled runs every minute
    this.interval = setInterval(() => {
      this.checkScheduledRuns().catch((err) => {
        logger.error("Error checking scheduled runs", err);
      });
    }, 60000); // Every minute

    logger.info("Scheduler started");
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.info("Scheduler stopped");
  }

  private async checkScheduledRuns(): Promise<void> {
    // Find all active agents with schedule triggers
    const agents = await prisma.agent.findMany({
      where: {
        activeVersionId: { not: null },
      },
      include: {
        activeVersion: {
          include: {
            flowGraph: true,
          },
        },
      },
    });

    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    for (const agent of agents) {
      if (!agent.activeVersion || !agent.activeVersion.flowGraph) {
        continue;
      }

      const graphJson = agent.activeVersion.flowGraph.graphJson as any;
      const nodes = graphJson?.nodes || [];

      // Find schedule trigger nodes
      const scheduleTriggers = nodes.filter(
        (node: any) => node.type === "trigger.schedule"
      );

      for (const trigger of scheduleTriggers) {
        const schedule = trigger.config?.schedule;
        if (!schedule) {
          continue;
        }

        // Check if schedule matches current time
        if (this.shouldTrigger(schedule, currentHour, currentMinute, currentDay)) {
          // Check if we already ran this schedule today
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const existingRun = await prisma.run.findFirst({
            where: {
              agentId: agent.id,
              agentVersionId: agent.activeVersion.id,
              triggerType: "schedule",
              createdAt: { gte: today },
            },
          });

          if (existingRun) {
            continue; // Already ran today
          }

          // Create and enqueue run
          await this.createScheduledRun(agent, agent.activeVersion);
        }
      }
    }
  }

  private shouldTrigger(
    schedule: string | Record<string, unknown>,
    hour: number,
    minute: number,
    day: number
  ): boolean {
    // Simple schedule matching
    // Supports: "daily", "hourly", cron expressions, or { hour, minute, days }
    if (typeof schedule === "string") {
      if (schedule === "daily") {
        // Default to 9 AM
        return hour === 9 && minute === 0;
      }
      if (schedule === "hourly") {
        return minute === 0;
      }
      // TODO: Add proper cron parsing
      return false;
    }

    if (typeof schedule === "object") {
      const s = schedule as { hour?: number; minute?: number; days?: number[] };
      const hourMatch = s.hour === undefined || s.hour === hour;
      const minuteMatch = s.minute === undefined || s.minute === minute;
      const dayMatch = s.days === undefined || s.days.includes(day);

      return hourMatch && minuteMatch && dayMatch;
    }

    return false;
  }

  private async createScheduledRun(agent: any, version: any): Promise<void> {
    const run = await prisma.run.create({
      data: {
        agentId: agent.id,
        agentVersionId: version.id,
        workspaceId: agent.workspaceId,
        triggerType: "schedule",
        status: "pending",
      },
    });

    const jobData: RunJobData = {
      runId: run.id,
      agentId: agent.id,
      agentVersionId: version.id,
      workspaceId: agent.workspaceId,
      flowGraphId: version.flowGraphId,
      triggerType: "schedule",
    };

    await runQueue.add("execute-run", jobData);
    logger.info(`Scheduled run created for agent ${agent.id}`, { runId: run.id });
  }
}

