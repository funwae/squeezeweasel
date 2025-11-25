/**
 * MCP Server implementation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as agentHandlers from "./handlers/agents.js";
import * as runHandlers from "./handlers/runs.js";
import * as templateHandlers from "./handlers/templates.js";
import type { MCPServerContext } from "./context.js";

export class MCPServer {
  private server: Server;
  private context: MCPServerContext = {};

  constructor() {
    this.server = new Server(
      {
        name: "squeezeweasel",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "squeezeweasel.list_agents",
            description: "List all agents in a workspace",
            inputSchema: {
              type: "object",
              properties: {
                workspaceId: {
                  type: "string",
                  description: "Workspace ID (optional, uses context if not provided)",
                },
              },
            },
          },
          {
            name: "squeezeweasel.get_agent",
            description: "Get detailed information about a specific agent",
            inputSchema: {
              type: "object",
              properties: {
                agentId: {
                  type: "string",
                  description: "Agent ID",
                },
              },
              required: ["agentId"],
            },
          },
          {
            name: "squeezeweasel.run_agent",
            description: "Trigger a run of an agent",
            inputSchema: {
              type: "object",
              properties: {
                agentId: {
                  type: "string",
                  description: "Agent ID to run",
                },
                payload: {
                  type: "object",
                  description: "Optional payload for the run",
                },
                triggerType: {
                  type: "string",
                  enum: ["manual", "webhook", "mcp"],
                  description: "Type of trigger",
                },
              },
              required: ["agentId"],
            },
          },
          {
            name: "squeezeweasel.get_runs",
            description: "Get list of runs for an agent or workspace",
            inputSchema: {
              type: "object",
              properties: {
                agentId: {
                  type: "string",
                  description: "Optional agent ID to filter runs",
                },
                limit: {
                  type: "number",
                  description: "Maximum number of runs to return",
                },
              },
            },
          },
          {
            name: "squeezeweasel.get_run_trace",
            description: "Get detailed trace of a run execution",
            inputSchema: {
              type: "object",
              properties: {
                runId: {
                  type: "string",
                  description: "Run ID",
                },
              },
              required: ["runId"],
            },
          },
          {
            name: "squeezeweasel.list_templates",
            description: "List available templates",
            inputSchema: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description: "Filter by category",
                },
                difficulty: {
                  type: "string",
                  description: "Filter by difficulty",
                },
              },
            },
          },
          {
            name: "squeezeweasel.install_template",
            description: "Install a template as a new agent",
            inputSchema: {
              type: "object",
              properties: {
                workspaceId: {
                  type: "string",
                  description: "Workspace ID",
                },
                templateSlug: {
                  type: "string",
                  description: "Template slug",
                },
                config: {
                  type: "object",
                  description: "Template-specific configuration",
                },
              },
              required: ["workspaceId", "templateSlug"],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "squeezeweasel.list_agents":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await agentHandlers.listAgents(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.get_agent":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await agentHandlers.getAgent(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.run_agent":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await agentHandlers.runAgent(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.get_runs":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await runHandlers.getRuns(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.get_run_trace":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await runHandlers.getRunTrace(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.list_templates":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await templateHandlers.listTemplates(args as any, this.context)),
                },
              ],
            };

          case "squeezeweasel.install_template":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(await templateHandlers.installTemplate(args as any, this.context)),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error.message || "Unknown error",
              }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  setContext(context: MCPServerContext): void {
    this.context = context;
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SqueezeWeasel MCP Server started");
  }
}

