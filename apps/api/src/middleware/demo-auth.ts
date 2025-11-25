/**
 * Demo mode authentication bypass middleware
 */

import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "../config/index.js";
import { prisma } from "../db/client.js";

export interface DemoContext {
  workspaceId: string;
  userId: string;
  email: string;
}

/**
 * Get demo workspace context when in demo mode
 */
export async function getDemoWorkspaceContext(): Promise<DemoContext | null> {
  if (!config.demo.enabled) {
    return null;
  }

  // Find or create demo workspace
  let demoWorkspace = await prisma.workspace.findFirst({
    where: {
      slug: "demo",
    },
  });

  if (!demoWorkspace) {
    // Create demo workspace if it doesn't exist
    demoWorkspace = await prisma.workspace.create({
      data: {
        name: "Demo Workspace",
        slug: "demo",
        ownerId: "00000000-0000-0000-0000-000000000000", // Placeholder UUID
        plan: "FREE",
      },
    });
  }

  // Return demo context
  return {
    workspaceId: demoWorkspace.id,
    userId: demoWorkspace.ownerId,
    email: "demo@squeezeweasel.local",
  };
}

/**
 * Middleware that bypasses auth in demo mode, otherwise requires JWT
 */
export async function requireDemoOrAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (config.demo.enabled) {
    // Demo mode: bypass auth and set demo context
    const demoContext = await getDemoWorkspaceContext();
    if (demoContext) {
      request.user = {
        userId: demoContext.userId,
        email: demoContext.email,
      };
      return;
    }
  }

  // Non-demo mode: require JWT authentication
  try {
    await request.jwtVerify();
    request.user = request.user as { userId: string; email: string };
  } catch (err) {
    reply.status(401).send({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
  }
}

/**
 * Get workspace ID from request, using demo workspace if in demo mode
 */
export async function getWorkspaceIdFromRequest(
  request: FastifyRequest,
  workspaceIdParam?: string
): Promise<string> {
  if (config.demo.enabled) {
    const demoContext = await getDemoWorkspaceContext();
    if (demoContext) {
      // In demo mode, always return demo workspace ID regardless of param
      return demoContext.workspaceId;
    }
  }

  if (!workspaceIdParam) {
    throw new Error("Workspace ID is required");
  }

  // If param is "demo" slug, look it up
  if (workspaceIdParam === "demo") {
    const demoContext = await getDemoWorkspaceContext();
    if (demoContext) {
      return demoContext.workspaceId;
    }
  }

  return workspaceIdParam;
}

