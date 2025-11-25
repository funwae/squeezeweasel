/**
 * Secret routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { encryptSecret } from "../infra/Secrets.js";
import { requireDemoOrAuth, getWorkspaceIdFromRequest } from "../middleware/demo-auth.js";

export async function secretRoutes(fastify: FastifyInstance) {
  // Create secret
  fastify.post(
    "/workspaces/:wsId/secrets",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const actualWorkspaceId = await getWorkspaceIdFromRequest(request, wsId);
      const body = request.body as { name: string; value: string };
      const user = request.user as { userId: string };

      const encryptedValue = encryptSecret(body.value);

      const secret = await prisma.secret.create({
        data: {
          workspaceId: actualWorkspaceId,
          name: body.name,
          encryptedValue,
          createdById: user.userId,
        },
      });

      // Return secret without encrypted value
      return reply.status(201).send({
        secret: {
          id: secret.id,
          workspaceId: secret.workspaceId,
          name: secret.name,
          createdAt: secret.createdAt,
        },
      });
    }
  );
}

