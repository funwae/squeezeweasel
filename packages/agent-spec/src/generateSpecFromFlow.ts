/**
 * Generate human-readable spec from flow graph
 *
 * This is a stub implementation. Full implementation will use LLM
 * to convert flow JSON to human-readable markdown.
 */

import type { FlowGraph, AgentSpec } from "./schemas";

export async function generateSpecFromFlow(
  flowGraph: FlowGraph,
  llmCall: (prompt: string) => Promise<string>
): Promise<AgentSpec> {
  // TODO: Implement full LLM-based spec generation
  // For now, return a basic spec based on flow structure

  const nodeTypes = new Set(flowGraph.nodes.map((n) => n.type));
  const triggers: string[] = [];
  const services: string[] = [];

  if (nodeTypes.has("trigger.schedule")) {
    triggers.push("Scheduled execution");
  }
  if (nodeTypes.has("trigger.webhook")) {
    triggers.push("Webhook trigger");
  }
  if (nodeTypes.has("tool.http")) {
    services.push("HTTP API");
  }
  if (nodeTypes.has("tool.email")) {
    services.push("Email service");
  }
  if (nodeTypes.has("tool.sms")) {
    services.push("SMS service");
  }
  if (nodeTypes.has("tool.db")) {
    services.push("Database");
  }

  const spec: AgentSpec = {
    overview: `Agent with ${flowGraph.nodes.length} nodes and ${flowGraph.edges.length} connections.`,
    triggers: triggers.length > 0 ? triggers : ["Manual trigger"],
    externalServices: services,
    dataFlow: `Flow processes data through ${flowGraph.nodes.length} steps.`,
    risks: [],
    assumptions: [],
  };

  return spec;
}

