/**
 * MCP handlers for run operations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import type { MCPServerContext } from "../context.js";

export async function getRuns(
  args: { agentId?: string; limit?: number },
  context: MCPServerContext
): Promise<any> {
  const where: any = {};
  if (args.agentId) {
    where.agentId = args.agentId;
  }

  const runs = await prisma.run.findMany({
    where,
    take: args.limit || 50,
    orderBy: { createdAt: "desc" },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return runs.map((run) => ({
    id: run.id,
    agentId: run.agentId,
    agentName: run.agent.name,
    status: run.status,
    triggerType: run.triggerType,
    startedAt: run.startedAt?.toISOString(),
    finishedAt: run.finishedAt?.toISOString(),
    errorMessage: run.errorMessage,
    createdAt: run.createdAt.toISOString(),
  }));
}

export async function getRunTrace(
  args: { runId: string },
  context: MCPServerContext
): Promise<any> {
  const run = await prisma.run.findUnique({
    where: { id: args.runId },
    include: {
      nodes: {
        orderBy: { startedAt: "asc" },
      },
    },
  });

  if (!run) {
    throw new Error(`Run not found: ${args.runId}`);
  }

  return {
    runId: run.id,
    status: run.status,
    startedAt: run.startedAt?.toISOString(),
    finishedAt: run.finishedAt?.toISOString(),
    errorMessage: run.errorMessage,
    nodes: run.nodes.map((node) => ({
      nodeId: node.nodeId,
      nodeType: node.nodeType,
      status: node.status,
      startedAt: node.startedAt?.toISOString(),
      finishedAt: node.finishedAt?.toISOString(),
      errorMessage: node.errorMessage,
      // Truncate input/output for security
      input: truncateSensitive(node.input as Record<string, unknown>),
      output: truncateSensitive(node.output as Record<string, unknown>),
    })),
  };
}

function truncateSensitive(data: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!data) {
    return null;
  }

  const truncated: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const strValue = String(value);
    if (strValue.length > 500) {
      truncated[key] = strValue.substring(0, 500) + "... [truncated]";
    } else {
      truncated[key] = value;
    }
  }

  return truncated;
}

