import { z } from "zod";
import type { FlowGraph, BaseNode, FlowEdge } from "@squeezeweasel/shared-types";

/**
 * Zod schemas for flow graph validation
 */

export const NodeTypeSchema = z.enum([
  "trigger.schedule",
  "trigger.webhook",
  "llm",
  "transform",
  "condition",
  "loop",
  "tool.http",
  "tool.email",
  "tool.sms",
  "tool.db",
  "tool.webhook",
  "output",
]);

export const BaseNodeSchema: z.ZodType<BaseNode> = z.object({
  id: z.string(),
  type: NodeTypeSchema,
  label: z.string().optional(),
  config: z.record(z.unknown()).optional(),
});

export const FlowEdgeSchema: z.ZodType<FlowEdge> = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  condition: z.string().optional(),
});

export const FlowGraphSchema: z.ZodType<FlowGraph> = z.object({
  nodes: z.array(BaseNodeSchema),
  edges: z.array(FlowEdgeSchema),
});

/**
 * Agent spec JSON structure
 */
export const AgentSpecSchema = z.object({
  overview: z.string(),
  triggers: z.array(z.string()),
  externalServices: z.array(z.string()),
  dataFlow: z.string(),
  risks: z.array(z.string()).optional(),
  assumptions: z.array(z.string()).optional(),
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

/**
 * NL generation request
 */
export const GenerateFlowRequestSchema = z.object({
  description: z.string().min(10),
  workspaceId: z.string().uuid(),
});

export type GenerateFlowRequest = z.infer<typeof GenerateFlowRequestSchema>;

/**
 * NL generation response
 */
export const GenerateFlowResponseSchema = z.object({
  flowGraph: FlowGraphSchema,
  spec: AgentSpecSchema,
  requiredConnectors: z.array(z.string()),
});

export type GenerateFlowResponse = z.infer<typeof GenerateFlowResponseSchema>;

