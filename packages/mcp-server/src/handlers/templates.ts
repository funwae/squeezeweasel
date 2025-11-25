/**
 * MCP handlers for template operations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import type { MCPServerContext } from "../context.js";

export async function listTemplates(
  args: { category?: string; difficulty?: string },
  context: MCPServerContext
): Promise<any> {
  const where: any = { public: true };
  if (args.category) {
    where.category = args.category;
  }

  const templates = await prisma.template.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return templates.map((template) => ({
    id: template.id,
    slug: template.slug,
    name: template.name,
    description: template.description,
    category: template.category,
    author: template.author,
    createdAt: template.createdAt.toISOString(),
  }));
}

export async function installTemplate(
  args: {
    workspaceId: string;
    templateSlug: string;
    config?: Record<string, unknown>;
  },
  context: MCPServerContext
): Promise<any> {
  const template = await prisma.template.findUnique({
    where: { slug: args.templateSlug },
    include: {
      agentVersion: {
        include: {
          flowGraph: true,
        },
      },
    },
  });

  if (!template) {
    throw new Error(`Template not found: ${args.templateSlug}`);
  }

  // Generate agent name from template
  const agentName = `${template.name} - ${new Date().toLocaleDateString()}`;

  // Create flow graph copy
  const flowGraph = await prisma.flowGraph.create({
    data: {
      workspaceId: args.workspaceId,
      graphJson: template.agentVersion.flowGraph.graphJson,
    },
  });

  // Create agent version
  const agentVersion = await prisma.agentVersion.create({
    data: {
      agentId: "", // Will be set after agent creation
      versionNumber: 1,
      specMarkdown: template.agentVersion.specMarkdown,
      specJson: template.agentVersion.specJson,
      flowGraphId: flowGraph.id,
      status: "draft",
      createdById: context.userId || "system",
    },
  });

  // Create agent
  const slug = agentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const agent = await prisma.agent.create({
    data: {
      workspaceId: args.workspaceId,
      name: agentName,
      slug,
      description: template.description || undefined,
      createdById: context.userId || "system",
      activeVersionId: agentVersion.id,
    },
  });

  // Update agent version with agent ID
  await prisma.agentVersion.update({
    where: { id: agentVersion.id },
    data: { agentId: agent.id },
  });

  const result = { agentId: agent.id };

  return {
    agentId: result.agentId,
    templateSlug: template.slug,
    templateName: template.name,
    installedAt: new Date().toISOString(),
  };
}

