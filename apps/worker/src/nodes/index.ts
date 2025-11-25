/**
 * Node registry - maps node types to handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";
import { triggerNodes } from "./TriggerNodes.js";
import { llmNodes } from "./LLMNodes.js";
import { transformNodes } from "./TransformNodes.js";
import { conditionNodes } from "./ConditionNodes.js";
import { toolNodes } from "./ToolNodes.js";
import { outputNodes } from "./OutputNodes.js";
import { mcpNode } from "./MCPNode.js";

export interface NodeHandler {
  execute(
    node: BaseNode,
    input: Record<string, unknown>,
    context: RunContext
  ): Promise<Record<string, unknown>>;
}

class NodeRegistry {
  private handlers = new Map<string, NodeHandler>();

  register(type: string, handler: NodeHandler): void {
    this.handlers.set(type, handler);
  }

  get(type: string): NodeHandler | undefined {
    return this.handlers.get(type);
  }
}

export const nodeRegistry = new NodeRegistry();

// Register all node handlers
nodeRegistry.register("trigger.schedule", triggerNodes.schedule);
nodeRegistry.register("trigger.webhook", triggerNodes.webhook);
nodeRegistry.register("llm", llmNodes.llm);
nodeRegistry.register("transform", transformNodes.transform);
nodeRegistry.register("condition", conditionNodes.condition);
nodeRegistry.register("tool.http", toolNodes.http);
nodeRegistry.register("tool.email", toolNodes.email);
nodeRegistry.register("tool.sms", toolNodes.sms);
nodeRegistry.register("tool.db", toolNodes.db);
nodeRegistry.register("tool.webhook", toolNodes.webhook);
nodeRegistry.register("tool.reddit", toolNodes.reddit);
nodeRegistry.register("tool.stock", toolNodes.stock);
nodeRegistry.register("tool.mcp", mcpNode);
nodeRegistry.register("output", outputNodes.output);

