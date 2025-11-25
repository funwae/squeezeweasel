/**
 * Agent routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AgentService } from "../services/AgentService.js";
import { requireDemoOrAuth, getWorkspaceIdFromRequest } from "../middleware/demo-auth.js";

const agentService = new AgentService();

export async function agentRoutes(fastify: FastifyInstance) {
  // List agents in workspace
  fastify.get(
    "/workspaces/:wsId/agents",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const actualWorkspaceId = await getWorkspaceIdFromRequest(request, wsId);
      const agents = await agentService.listAgents(actualWorkspaceId);
      return reply.send({ agents });
    }
  );

  // Create agent
  fastify.post(
    "/workspaces/:wsId/agents",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const actualWorkspaceId = await getWorkspaceIdFromRequest(request, wsId);
      const body = request.body as { name: string; description?: string };
      const user = request.user as { userId: string };

      const agent = await agentService.createAgent({
        workspaceId: actualWorkspaceId,
        name: body.name,
        description: body.description,
        createdById: user.userId,
      });

      return reply.status(201).send({ agent });
    }
  );

  // Get agent by ID
  fastify.get(
    "/agents/:agentId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const agent = await agentService.getAgentById(agentId);

      if (!agent) {
        return reply.status(404).send({
          error: {
            code: "AGENT_NOT_FOUND",
            message: "Agent not found",
          },
        });
      }

      return reply.send({ agent });
    }
  );

  // Update agent
  fastify.patch(
    "/agents/:agentId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      const body = request.body as { name?: string; description?: string };

      const agent = await agentService.updateAgent(agentId, {
        name: body.name,
        description: body.description,
      });

      if (!agent) {
        return reply.status(404).send({
          error: {
            code: "AGENT_NOT_FOUND",
            message: "Agent not found",
          },
        });
      }

      return reply.send({ agent });
    }
  );

  // Delete agent
  fastify.delete(
    "/agents/:agentId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { agentId } = request.params as { agentId: string };
      await agentService.deleteAgent(agentId);
      return reply.status(204).send();
    }
  );
}

