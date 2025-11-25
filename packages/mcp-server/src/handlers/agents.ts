/**
 * MCP handlers for agent operations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import type { MCPServerContext } from "../context.js";

export async function listAgents(
  args: { workspaceId?: string },
  context: MCPServerContext
): Promise<any> {
  const workspaceId = args.workspaceId || context.workspaceId;
  if (!workspaceId) {
    throw new Error("workspaceId required");
  }

  const agents = await prisma.agent.findMany({
    where: { workspaceId },
    include: {
      activeVersion: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    description: agent.description,
    status: agent.activeVersion?.status || "draft",
    createdAt: agent.createdAt.toISOString(),
  }));
}

export async function getAgent(
  args: { agentId: string },
  context: MCPServerContext
): Promise<any> {
  const agent = await prisma.agent.findUnique({
    where: { id: args.agentId },
    include: {
      activeVersion: {
        include: {
          flowGraph: true,
        },
      },
    },
  });

  if (!agent) {
    throw new Error(`Agent not found: ${args.agentId}`);
  }

  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    description: agent.description,
    workspaceId: agent.workspaceId,
    activeVersion: agent.activeVersion
      ? {
          id: agent.activeVersion.id,
          versionNumber: agent.activeVersion.versionNumber,
          status: agent.activeVersion.status,
          specMarkdown: agent.activeVersion.specMarkdown,
          flowGraph: agent.activeVersion.flowGraph
            ? {
                id: agent.activeVersion.flowGraph.id,
                graphJson: agent.activeVersion.flowGraph.graphJson,
              }
            : null,
        }
      : null,
    createdAt: agent.createdAt.toISOString(),
    updatedAt: agent.updatedAt.toISOString(),
  };
}

export async function runAgent(
  args: {
    agentId: string;
    payload?: Record<string, unknown>;
    triggerType?: "manual" | "webhook" | "mcp";
  },
  context: MCPServerContext
): Promise<any> {
  const agent = await prisma.agent.findUnique({
    where: { id: args.agentId },
    include: { activeVersion: true },
  });

  if (!agent || !agent.activeVersion) {
    throw new Error(`Agent or active version not found: ${args.agentId}`);
  }

  // Create run via API call or direct DB access
  // For now, create run directly
  const flowGraph = await prisma.flowGraph.findUnique({
    where: { id: agent.activeVersion.flowGraphId },
  });

  if (!flowGraph) {
    throw new Error("Flow graph not found");
  }

  const run = await prisma.run.create({
    data: {
      agentId: agent.id,
      agentVersionId: agent.activeVersion.id,
      workspaceId: agent.workspaceId,
      triggerType: (args.triggerType || "mcp") as any,
      triggerPayload: args.payload || {},
      status: "pending",
    },
  });

  // Enqueue job (would need to import queue, but for now just return)
  // In production, this would enqueue via the API or shared queue

  const run = await runService.createRun({
    agentId: agent.id,
    agentVersionId: agent.activeVersion.id,
    workspaceId: agent.workspaceId,
    triggerType: (args.triggerType || "mcp") as any,
    triggerPayload: args.payload,
  });

  return {
    runId: run.id,
    status: run.status,
    agentId: agent.id,
    createdAt: run.createdAt.toISOString(),
  };
}

