/**
 * Run service
 */

import { prisma } from "../db/client.js";
import { runQueue } from "../infra/Queue.js";
import type { Run, RunNode, TriggerType } from "@squeezeweasel/shared-types";

export interface CreateRunData {
  agentId: string;
  agentVersionId: string;
  workspaceId: string;
  triggerType: TriggerType;
  triggerPayload?: Record<string, unknown>;
}

export class RunService {
  async createRun(data: CreateRunData): Promise<Run> {
    // Get flow graph from agent version
    const agentVersion = await prisma.agentVersion.findUnique({
      where: { id: data.agentVersionId },
      include: { flowGraph: true },
    });

    if (!agentVersion) {
      throw new Error("Agent version not found");
    }

    const run = await prisma.run.create({
      data: {
        agentId: data.agentId,
        agentVersionId: data.agentVersionId,
        workspaceId: data.workspaceId,
        triggerType: data.triggerType,
        triggerPayload: data.triggerPayload || {},
        status: "pending",
      },
    });

    // Enqueue job for worker
    await runQueue.add("execute-run", {
      runId: run.id,
      agentId: data.agentId,
      agentVersionId: data.agentVersionId,
      workspaceId: data.workspaceId,
      flowGraphId: agentVersion.flowGraphId,
      triggerType: data.triggerType,
      triggerPayload: data.triggerPayload,
    });

    return {
      id: run.id,
      agentId: run.agentId,
      agentVersionId: run.agentVersionId,
      workspaceId: run.workspaceId,
      triggerType: run.triggerType,
      triggerPayload: (run.triggerPayload as Record<string, unknown>) || undefined,
      status: run.status,
      startedAt: run.startedAt || undefined,
      finishedAt: run.finishedAt || undefined,
      errorMessage: run.errorMessage || undefined,
    };
  }

  async getRunById(runId: string): Promise<Run | null> {
    const run = await prisma.run.findUnique({
      where: { id: runId },
    });

    if (!run) {
      return null;
    }

    return {
      id: run.id,
      agentId: run.agentId,
      agentVersionId: run.agentVersionId,
      workspaceId: run.workspaceId,
      triggerType: run.triggerType,
      triggerPayload: (run.triggerPayload as Record<string, unknown>) || undefined,
      status: run.status,
      startedAt: run.startedAt || undefined,
      finishedAt: run.finishedAt || undefined,
      errorMessage: run.errorMessage || undefined,
    };
  }

  async listRuns(agentId: string, limit = 50): Promise<Run[]> {
    const runs = await prisma.run.findMany({
      where: { agentId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return runs.map((run) => ({
      id: run.id,
      agentId: run.agentId,
      agentVersionId: run.agentVersionId,
      workspaceId: run.workspaceId,
      triggerType: run.triggerType,
      triggerPayload: (run.triggerPayload as Record<string, unknown>) || undefined,
      status: run.status,
      startedAt: run.startedAt || undefined,
      finishedAt: run.finishedAt || undefined,
      errorMessage: run.errorMessage || undefined,
    }));
  }

  async getRunNodes(runId: string): Promise<RunNode[]> {
    const nodes = await prisma.runNode.findMany({
      where: { runId },
      orderBy: { startedAt: "asc" },
    });

    return nodes.map((node) => ({
      id: node.id,
      runId: node.runId,
      nodeId: node.nodeId,
      nodeType: node.nodeType as any,
      status: node.status,
      input: (node.input as Record<string, unknown>) || undefined,
      output: (node.output as Record<string, unknown>) || undefined,
      errorMessage: node.errorMessage || undefined,
      startedAt: node.startedAt || undefined,
      finishedAt: node.finishedAt || undefined,
    }));
  }
}

