/**
 * Template routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { TemplateService } from "../services/TemplateService.js";
import { requireDemoOrAuth } from "../middleware/demo-auth.js";

const templateService = new TemplateService();

export async function templateRoutes(fastify: FastifyInstance) {
  // List public templates
  fastify.get("/templates", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { publicOnly?: string };
    const publicOnly = query.publicOnly !== "false";

    const templates = await templateService.listTemplates(publicOnly);
    return reply.send({ templates });
  });

  // Get template by ID
  fastify.get(
    "/templates/:templateId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { templateId } = request.params as { templateId: string };
      const template = await templateService.getTemplateById(templateId);

      if (!template) {
        return reply.status(404).send({
          error: {
            code: "TEMPLATE_NOT_FOUND",
            message: "Template not found",
          },
        });
      }

      return reply.send({ template });
    }
  );

  // Install template
  fastify.post(
    "/workspaces/:wsId/templates/:templateId/install",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId, templateId } = request.params as { wsId: string; templateId: string };
      const body = request.body as { name: string };
      const user = request.user as { userId: string };

      const result = await templateService.installTemplate(
        templateId,
        wsId,
        body.name,
        user.userId
      );

      return reply.status(201).send(result);
    }
  );
}

