/**
 * Flow routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { requireDemoOrAuth } from "../middleware/demo-auth.js";

export async function flowRoutes(fastify: FastifyInstance) {
  // Get flow by ID
  fastify.get(
    "/flows/:flowId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { flowId } = request.params as { flowId: string };
      const flow = await prisma.flowGraph.findUnique({
        where: { id: flowId },
      });

      if (!flow) {
        return reply.status(404).send({
          error: {
            code: "FLOW_NOT_FOUND",
            message: "Flow graph not found",
          },
        });
      }

      return reply.send({ flow });
    }
  );

  // Update flow graph
  fastify.patch(
    "/flows/:flowId",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { flowId } = request.params as { flowId: string };
      const body = request.body as { graphJson: Record<string, unknown> };

      const flow = await prisma.flowGraph.update({
        where: { id: flowId },
        data: { graphJson: body.graphJson },
      });

      return reply.send({ flow });
    }
  );
}

