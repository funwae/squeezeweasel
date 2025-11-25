/**
 * Run routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RunService } from "../services/RunService.js";
import { requireDemoOrAuth } from "../middleware/demo-auth.js";
import { prisma } from "../db/client.js";

const runService = new RunService();

export async function runRoutes(fastify: FastifyInstance) {
  // Trigger manual run
  fastify.post(
    "/agents/:agentId/run",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const body = request.body as { triggerPayload?: Record<string, unknown> };

      // Get agent and active version
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        include: { activeVersion: true },
      });

      if (!agent) {
        return reply.status(404).send({
          error: {
            code: "AGENT_NOT_FOUND",
            message: "Agent not found. Please check the agent ID.",
          },
        });
      }

      if (!agent.activeVersion) {
        return reply.status(400).send({
          error: {
            code: "NO_ACTIVE_VERSION",
            message: "Agent has no active version. Please activate a version before running.",
          },
        });
      }

      const run = await runService.createRun({
        agentId: agent.id,
        agentVersionId: agent.activeVersion.id,
        workspaceId: agent.workspaceId,
        triggerType: "manual",
        triggerPayload: body.triggerPayload,
      });

      return reply.status(201).send({ run });
    }
  );

  // List runs for agent
  fastify.get(
    "/agents/:agentId/runs",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const query = request.query as { limit?: string };
      const limit = query.limit ? parseInt(query.limit, 10) : 50;

      const runs = await runService.listRuns(agentId, limit);
      return reply.send({ runs });
    }
  );

  // Get run by ID
  fastify.get(
    "/runs/:runId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { runId } = request.params as { runId: string };
      const run = await runService.getRunById(runId);

      if (!run) {
        return reply.status(404).send({
          error: {
            code: "RUN_NOT_FOUND",
            message: "Run not found",
          },
        });
      }

      return reply.send({ run });
    }
  );

  // Get run nodes (node-level logs)
  fastify.get(
    "/runs/:runId/nodes",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { runId } = request.params as { runId: string };
      const nodes = await runService.getRunNodes(runId);
      return reply.send({ nodes });
    }
  );
}

