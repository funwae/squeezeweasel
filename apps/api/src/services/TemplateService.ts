/**
 * Template service
 */

import { prisma } from "../db/client.js";
import type { Template } from "@squeezeweasel/shared-types";

export class TemplateService {
  async listTemplates(publicOnly = true): Promise<Template[]> {
    const templates = await prisma.template.findMany({
      where: publicOnly ? { public: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description || undefined,
      category: t.category || undefined,
      author: t.author || undefined,
      agentVersionId: t.agentVersionId,
      public: t.public,
      createdAt: t.createdAt,
    }));
  }

  async getTemplateById(templateId: string): Promise<Template | null> {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return null;
    }

    return {
      id: template.id,
      name: template.name,
      slug: template.slug,
      description: template.description || undefined,
      category: template.category || undefined,
      author: template.author || undefined,
      agentVersionId: template.agentVersionId,
      public: template.public,
      createdAt: template.createdAt,
    };
  }

  async installTemplate(
    templateId: string,
    workspaceId: string,
    name: string,
    createdById: string
  ): Promise<{ agentId: string }> {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { agentVersion: { include: { flowGraph: true } } },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    // Create new agent from template
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.agent.findUnique({ where: { workspaceId_slug: { workspaceId, slug: uniqueSlug } } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create flow graph copy
    const flowGraph = await prisma.flowGraph.create({
      data: {
        workspaceId,
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
        createdById,
      },
    });

    // Create agent
    const agent = await prisma.agent.create({
      data: {
        workspaceId,
        name,
        slug: uniqueSlug,
        description: template.description || undefined,
        createdById,
        activeVersionId: agentVersion.id,
      },
    });

    // Update agent version with agent ID
    await prisma.agentVersion.update({
      where: { id: agentVersion.id },
      data: { agentId: agent.id },
    });

    return { agentId: agent.id };
  }
}

