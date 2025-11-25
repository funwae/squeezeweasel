/**
 * MCP Server context - manages workspace and user context
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface MCPServerContext {
  workspaceId?: string;
  userId?: string;
}

export class ContextManager {
  async getWorkspaceFromContext(context: MCPServerContext): Promise<string | null> {
    if (context.workspaceId) {
      return context.workspaceId;
    }

    // If userId provided, get default workspace
    if (context.userId) {
      const workspace = await prisma.workspace.findFirst({
        where: { ownerId: context.userId },
      });
      return workspace?.id || null;
    }

    return null;
  }

  async validateWorkspaceAccess(
    workspaceId: string,
    userId?: string
  ): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    return !!member || false;
  }
}

