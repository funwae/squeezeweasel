/**
 * Webhook routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { runQueue } from "../infra/Queue.js";

export async function webhookRoutes(fastify: FastifyInstance) {
  // Webhook trigger endpoint
  fastify.post(
    "/webhooks/:workspaceSlug/:agentSlug",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { workspaceSlug, agentSlug } = request.params as {
        workspaceSlug: string;
        agentSlug: string;
      };

      // Verify webhook token (if configured)
      const token = request.headers["x-webhook-token"] as string | undefined;
      // TODO: Implement token verification

      // Find agent by slug
      const workspace = await prisma.workspace.findUnique({
        where: { slug: workspaceSlug },
      });

      if (!workspace) {
        return reply.status(404).send({
          error: {
            code: "WORKSPACE_NOT_FOUND",
            message: "Workspace not found",
          },
        });
      }

      const agent = await prisma.agent.findUnique({
        where: {
          workspaceId_slug: {
            workspaceId: workspace.id,
            slug: agentSlug,
          },
        },
        include: { activeVersion: true },
      });

      if (!agent || !agent.activeVersion) {
        return reply.status(404).send({
          error: {
            code: "AGENT_NOT_FOUND",
            message: "Agent or active version not found",
          },
        });
      }

      // Get flow graph
      const flowGraph = await prisma.flowGraph.findUnique({
        where: { id: agent.activeVersion.flowGraphId },
      });

      if (!flowGraph) {
        return reply.status(404).send({
          error: {
            code: "FLOW_NOT_FOUND",
            message: "Flow graph not found",
          },
        });
      }

      // Create run
      const run = await prisma.run.create({
        data: {
          agentId: agent.id,
          agentVersionId: agent.activeVersion.id,
          workspaceId: workspace.id,
          triggerType: "webhook",
          triggerPayload: {
            headers: request.headers,
            body: request.body,
            query: request.query,
          },
          status: "pending",
        },
      });

      // Enqueue job
      await runQueue.add("execute-run", {
        runId: run.id,
        agentId: agent.id,
        agentVersionId: agent.activeVersion.id,
        workspaceId: workspace.id,
        flowGraphId: flowGraph.id,
        triggerType: "webhook",
        triggerPayload: {
          headers: request.headers,
          body: request.body,
          query: request.query,
        },
      });

      return reply.status(202).send({
        runId: run.id,
        status: "accepted",
      });
    }
  );
}

