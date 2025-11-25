/**
 * Agent version routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { requireDemoOrAuth } from "../middleware/demo-auth.js";

export async function agentVersionRoutes(fastify: FastifyInstance) {
  // Create agent version
  fastify.post(
    "/agents/:agentId/versions",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const body = request.body as {
        specMarkdown?: string;
        specJson?: Record<string, unknown>;
        flowGraphId: string;
      };
      const user = request.user as { userId: string };

      // Get latest version number
      const latestVersion = await prisma.agentVersion.findFirst({
        where: { agentId },
        orderBy: { versionNumber: "desc" },
      });

      const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

      const version = await prisma.agentVersion.create({
        data: {
          agentId,
          versionNumber,
          specMarkdown: body.specMarkdown,
          specJson: body.specJson,
          flowGraphId: body.flowGraphId,
          status: "draft",
          createdById: user.userId,
        },
      });

      return reply.status(201).send({ version });
    }
  );

  // List agent versions
  fastify.get(
    "/agents/:agentId/versions",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const versions = await prisma.agentVersion.findMany({
        where: { agentId },
        orderBy: { versionNumber: "desc" },
      });

      return reply.send({ versions });
    }
  );

  // Get agent version by ID
  fastify.get(
    "/agent-versions/:versionId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { versionId } = request.params as { versionId: string };
      const version = await prisma.agentVersion.findUnique({
        where: { id: versionId },
        include: { flowGraph: true },
      });

      if (!version) {
        return reply.status(404).send({
          error: {
            code: "VERSION_NOT_FOUND",
            message: "Agent version not found",
          },
        });
      }

      return reply.send({ version });
    }
  );

  // Activate agent version
  fastify.post(
    "/agents/:agentId/versions/:versionId/activate",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId, versionId } = request.params as { agentId: string; versionId: string };

      // Update agent to point to this version
      await prisma.agent.update({
        where: { id: agentId },
        data: { activeVersionId: versionId },
      });

      // Update version status
      await prisma.agentVersion.update({
        where: { id: versionId },
        data: { status: "active" },
      });

      return reply.send({ message: "Version activated" });
    }
  );
}

