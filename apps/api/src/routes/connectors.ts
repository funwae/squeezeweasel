/**
 * Connector routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { requireDemoOrAuth, getWorkspaceIdFromRequest } from "../middleware/demo-auth.js";

export async function connectorRoutes(fastify: FastifyInstance) {
  // List connectors for workspace
  fastify.get(
    "/workspaces/:wsId/connectors",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const actualWorkspaceId = await getWorkspaceIdFromRequest(request, wsId);
      const connectors = await prisma.connectorConfig.findMany({
        where: { workspaceId: actualWorkspaceId },
        orderBy: { createdAt: "desc" },
      });

      return reply.send({ connectors });
    }
  );

  // Create connector
  fastify.post(
    "/workspaces/:wsId/connectors",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const actualWorkspaceId = await getWorkspaceIdFromRequest(request, wsId);
      const body = request.body as {
        connectorType: string;
        configJson: Record<string, unknown>;
        secretId?: string;
      };

      const connector = await prisma.connectorConfig.create({
        data: {
          workspaceId: actualWorkspaceId,
          connectorType: body.connectorType,
          configJson: body.configJson,
          secretId: body.secretId,
        },
      });

      return reply.status(201).send({ connector });
    }
  );
}

