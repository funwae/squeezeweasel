/**
 * MCP Client Manager - manages connections to external MCP servers
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MCPClientManager {
  private clients = new Map<string, Client>();

  async getClient(serverId: string): Promise<Client | null> {
    // Check cache
    if (this.clients.has(serverId)) {
      return this.clients.get(serverId)!;
    }

    // Load from database
    const server = await prisma.workspaceMCPServer.findUnique({
      where: { id: serverId },
    });

    if (!server || !server.enabled) {
      return null;
    }

    // Create client based on transport type
    let client: Client;
    if (server.transport === "stdio") {
      // For stdio, we'd need to spawn a process
      // This is a simplified version
      throw new Error("stdio transport not yet implemented");
    } else if (server.transport === "sse" || server.transport === "http") {
      // HTTP/SSE transport
      const transport = new StdioClientTransport({
        command: "node",
        args: ["-e", "console.log('HTTP transport not yet implemented')"],
      });
      client = new Client(
        {
          name: "squeezeweasel-worker",
          version: "0.1.0",
        },
        {
          capabilities: {},
        }
      );
      await client.connect(transport);
    } else {
      throw new Error(`Unsupported transport: ${server.transport}`);
    }

    this.clients.set(serverId, client);
    return client;
  }

  async callTool(
    serverId: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<any> {
    const client = await this.getClient(serverId);
    if (!client) {
      throw new Error(`MCP server not found or disabled: ${serverId}`);
    }

    // Check if tool is allowed
    const server = await prisma.workspaceMCPServer.findUnique({
      where: { id: serverId },
    });

    if (server) {
      const scopes = server.scopes as string[];
      if (scopes && !scopes.includes(toolName)) {
        throw new Error(`Tool not allowed: ${toolName}`);
      }
    }

    const response = await client.callTool({
      name: toolName,
      arguments: args,
    });

    return response;
  }

  async disconnect(serverId: string): Promise<void> {
    const client = this.clients.get(serverId);
    if (client) {
      await client.close();
      this.clients.delete(serverId);
    }
  }

  async disconnectAll(): Promise<void> {
    for (const [serverId, client] of this.clients.entries()) {
      await client.close();
    }
    this.clients.clear();
  }
}

