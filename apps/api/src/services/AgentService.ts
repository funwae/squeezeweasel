/**
 * Agent service
 */

import { prisma } from "../db/client.js";
import type { Agent } from "@squeezeweasel/shared-types";

export interface CreateAgentData {
  workspaceId: string;
  name: string;
  description?: string;
  createdById: string;
}

export interface UpdateAgentData {
  name?: string;
  description?: string;
}

export class AgentService {
  async createAgent(data: CreateAgentData): Promise<Agent> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.agent.findUnique({ where: { workspaceId_slug: { workspaceId: data.workspaceId, slug: uniqueSlug } } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const agent = await prisma.agent.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        slug: uniqueSlug,
        description: data.description,
        createdById: data.createdById,
      },
    });

    return {
      id: agent.id,
      workspaceId: agent.workspaceId,
      name: agent.name,
      slug: agent.slug,
      description: agent.description || undefined,
      createdById: agent.createdById,
      activeVersionId: agent.activeVersionId || undefined,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  async getAgentById(agentId: string): Promise<Agent | null> {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return null;
    }

    return {
      id: agent.id,
      workspaceId: agent.workspaceId,
      name: agent.name,
      slug: agent.slug,
      description: agent.description || undefined,
      createdById: agent.createdById,
      activeVersionId: agent.activeVersionId || undefined,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  async listAgents(workspaceId: string): Promise<Agent[]> {
    const agents = await prisma.agent.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return agents.map((agent) => ({
      id: agent.id,
      workspaceId: agent.workspaceId,
      name: agent.name,
      slug: agent.slug,
      description: agent.description || undefined,
      createdById: agent.createdById,
      activeVersionId: agent.activeVersionId || undefined,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }));
  }

  async updateAgent(agentId: string, data: UpdateAgentData): Promise<Agent | null> {
    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      id: agent.id,
      workspaceId: agent.workspaceId,
      name: agent.name,
      slug: agent.slug,
      description: agent.description || undefined,
      createdById: agent.createdById,
      activeVersionId: agent.activeVersionId || undefined,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    };
  }

  async deleteAgent(agentId: string): Promise<void> {
    await prisma.agent.delete({
      where: { id: agentId },
    });
  }
}

