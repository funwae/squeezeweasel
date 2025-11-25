/**
 * MCP Node - executes tools from external MCP servers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";
import { MCPClientManager } from "../connectors/mcp/MCPClientManager.js";

const mcpManager = new MCPClientManager();

function resolveTemplate(
  template: Record<string, unknown>,
  data: Record<string, unknown>
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(template)) {
    if (typeof value === "string") {
      // Replace {{variable}} patterns
      let resolvedValue = value;
      for (const [varKey, varValue] of Object.entries(data)) {
        resolvedValue = resolvedValue.replace(
          new RegExp(`\\{\\{${varKey}\\}\\}`, "g"),
          String(varValue)
        );
      }
      resolved[key] = resolvedValue;
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = resolveTemplate(value as Record<string, unknown>, data);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

export const mcpNode = {
  async execute(
    node: BaseNode,
    input: Record<string, unknown>,
    context: RunContext
  ): Promise<Record<string, unknown>> {
    const serverId = (node.config?.serverId as string) || "";
    const toolName = (node.config?.toolName as string) || "";
    const argumentsTemplate = (node.config?.argumentsTemplate as Record<string, unknown>) || {};

    if (!serverId || !toolName) {
      throw new Error("MCP node requires serverId and toolName");
    }

    // Resolve template variables in arguments
    const resolvedArgs = resolveTemplate(argumentsTemplate, input);

    // Call MCP tool
    const result = await mcpManager.callTool(serverId, toolName, resolvedArgs);

    return {
      result,
      serverId,
      toolName,
    };
  },
};

