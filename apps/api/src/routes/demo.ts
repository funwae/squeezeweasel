/**
 * Demo mode routes - for unauthenticated demo access
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { config } from "../config/index.js";
import { prisma } from "../db/client.js";
import { runQueue } from "../infra/Queue.js";
import { getDemoWorkspaceContext } from "../middleware/demo-auth.js";

export async function demoRoutes(fastify: FastifyInstance) {
  // Get demo agent
  fastify.get("/demo/agent", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!config.demo.enabled) {
      return reply.status(404).send({ error: "Demo mode not enabled" });
    }

    const demoContext = await getDemoWorkspaceContext();
    if (!demoContext) {
      return reply.status(500).send({ error: "Failed to get demo workspace" });
    }

    const agent = await prisma.agent.findFirst({
      where: {
        workspaceId: demoContext.workspaceId,
        slug: "squeezeweasel-radar",
      },
      include: {
        activeVersion: {
          include: {
            flowGraph: true,
          },
        },
      },
    });

    if (!agent) {
      return reply.status(404).send({ error: "Demo agent not found. Run seed-demo first." });
    }

    return reply.send({ agent });
  });

  // Get latest run for demo agent
  fastify.get("/demo/runs/latest", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!config.demo.enabled) {
      return reply.status(404).send({ error: "Demo mode not enabled" });
    }

    const demoContext = await getDemoWorkspaceContext();
    if (!demoContext) {
      return reply.status(500).send({ error: "Failed to get demo workspace" });
    }

    const agent = await prisma.agent.findFirst({
      where: {
        workspaceId: demoContext.workspaceId,
        slug: "squeezeweasel-radar",
      },
    });

    if (!agent) {
      return reply.status(404).send({ error: "Demo agent not found" });
    }

    const run = await prisma.run.findFirst({
      where: {
        agentId: agent.id,
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        nodes: {
          orderBy: {
            startedAt: "asc",
          },
        },
      },
    });

    if (!run) {
      return reply.status(404).send({ error: "No runs found" });
    }

    return reply.send({ run });
  });

  // Trigger a demo run
  fastify.post("/demo/run", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!config.demo.enabled) {
      return reply.status(404).send({ error: "Demo mode not enabled" });
    }

    const demoContext = await getDemoWorkspaceContext();
    if (!demoContext) {
      return reply.status(500).send({ error: "Failed to get demo workspace" });
    }

    const agent = await prisma.agent.findFirst({
      where: {
        workspaceId: demoContext.workspaceId,
        slug: "squeezeweasel-radar",
      },
      include: {
        activeVersion: {
          include: {
            flowGraph: true,
          },
        },
      },
    });

    if (!agent || !agent.activeVersion || !agent.activeVersion.flowGraph) {
      return reply.status(404).send({ error: "Demo agent or flow graph not found" });
    }

    // Create run
    const run = await prisma.run.create({
      data: {
        agentId: agent.id,
        agentVersionId: agent.activeVersion.id,
        workspaceId: demoContext.workspaceId,
        triggerType: "manual",
        status: "PENDING",
      },
    });

    // Enqueue job
    await runQueue.add("execute-run", {
      runId: run.id,
      agentId: agent.id,
      agentVersionId: agent.activeVersion.id,
      workspaceId: demoContext.workspaceId,
      flowGraphId: agent.activeVersion.flowGraph.id,
      triggerType: "manual",
    });

    return reply.status(201).send({ run });
  });
}

