/**
 * Generate flow graph from natural language description
 *
 * Uses LLM to convert natural language to flow JSON.
 */

import type { FlowGraph, GenerateFlowRequest, GenerateFlowResponse } from "./schemas";
import type { AgentSpec } from "./schemas";
import { FlowGraphSchema, AgentSpecSchema } from "./schemas";

export async function generateFlowFromNL(
  request: GenerateFlowRequest,
  llmCall: (prompt: string) => Promise<string>
): Promise<GenerateFlowResponse> {
  const systemPrompt = `You are an expert at designing automation workflows. Your task is to convert natural language descriptions into structured flow graphs.

A flow graph consists of:
- **Nodes**: Processing units that perform actions
- **Edges**: Connections between nodes that define data flow

Available node types:
- **Triggers**: trigger.schedule (cron/daily/weekly), trigger.webhook (HTTP webhook)
- **AI**: llm (LLM calls for classification, extraction, generation)
- **Data**: transform (data transformation, field mapping)
- **Logic**: condition (branching), loop (iteration)
- **Tools**: tool.http (HTTP requests), tool.email (send email), tool.sms (send SMS), tool.db (database queries), tool.webhook (call webhook)
- **Output**: output (final result)

Each node has:
- id: unique identifier (e.g., "trigger-1", "llm-1")
- type: one of the node types above
- label: human-readable name
- config: type-specific configuration (e.g., schedule time, LLM prompt, HTTP URL)

Edges connect nodes:
- from: source node id
- to: target node id
- condition: optional condition label for conditional branches

You must respond with ONLY valid JSON in this exact format:
{
  "flowGraph": {
    "nodes": [
      {
        "id": "trigger-1",
        "type": "trigger.schedule",
        "label": "Daily Schedule",
        "config": { "scheduleType": "daily", "time": "09:00" }
      },
      {
        "id": "llm-1",
        "type": "llm",
        "label": "Analyze Data",
        "config": {
          "provider": "openai",
          "model": "gpt-4",
          "systemPrompt": "...",
          "userPrompt": "Analyze: {{input}}"
        }
      },
      {
        "id": "output-1",
        "type": "output",
        "label": "Result"
      }
    ],
    "edges": [
      { "id": "edge-1", "from": "trigger-1", "to": "llm-1" },
      { "id": "edge-2", "from": "llm-1", "to": "output-1" }
    ]
  },
  "spec": {
    "overview": "Human-readable description of what this agent does",
    "triggers": ["List of trigger descriptions"],
    "externalServices": ["List of external services needed"],
    "dataFlow": "Description of data flow (e.g., 'Trigger → LLM → Output')",
    "risks": ["List of potential risks or limitations"],
    "assumptions": ["List of assumptions made"]
  },
  "requiredConnectors": ["List of connector types needed, e.g., 'email', 'sms', 'http'"]
}

Be thorough and create a complete, working flow. Include all necessary nodes and connections.`;

  const userPrompt = `Generate a flow graph for this agent description:

"${request.description}"

Respond with ONLY the JSON object, no markdown, no code blocks, no explanations.`;

  try {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    const llmResponse = await llmCall(fullPrompt);

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = llmResponse.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n/, "").replace(/\n```$/, "");
    }
    if (jsonStr.startsWith("{")) {
      // Good, it's JSON
    } else {
      // Try to extract JSON object
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        jsonStr = match[0];
      }
    }

    const parsed = JSON.parse(jsonStr);

    // Validate the response structure
    if (!parsed.flowGraph || !parsed.spec) {
      throw new Error("Invalid LLM response: missing flowGraph or spec");
    }

    // Validate flow graph schema
    const flowGraph = FlowGraphSchema.parse(parsed.flowGraph);
    const spec = AgentSpecSchema.parse(parsed.spec);
    const requiredConnectors = Array.isArray(parsed.requiredConnectors)
      ? parsed.requiredConnectors
      : [];

    // Ensure all edges reference valid nodes
    const nodeIds = new Set(flowGraph.nodes.map((n) => n.id));
    for (const edge of flowGraph.edges) {
      if (!nodeIds.has(edge.from)) {
        throw new Error(`Edge references unknown node: ${edge.from}`);
      }
      if (!nodeIds.has(edge.to)) {
        throw new Error(`Edge references unknown node: ${edge.to}`);
      }
    }

    // Ensure there's at least one trigger and one output
    const hasTrigger = flowGraph.nodes.some((n) => n.type.startsWith("trigger."));
    const hasOutput = flowGraph.nodes.some((n) => n.type === "output");

    if (!hasTrigger) {
      // Add a default schedule trigger
      flowGraph.nodes.unshift({
        id: "trigger-1",
        type: "trigger.schedule",
        label: "Schedule Trigger",
        config: {
          scheduleType: "daily",
          time: "09:00",
        },
      });
      // Connect to first non-trigger node
      const firstNode = flowGraph.nodes.find((n) => !n.type.startsWith("trigger."));
      if (firstNode) {
        flowGraph.edges.unshift({
          id: "edge-trigger",
          from: "trigger-1",
          to: firstNode.id,
        });
      }
    }

    if (!hasOutput) {
      // Add a default output node
      const outputId = "output-1";
      flowGraph.nodes.push({
        id: outputId,
        type: "output",
        label: "Output",
      });
      // Connect last non-output node to output
      const lastNode = flowGraph.nodes
        .filter((n) => n.type !== "output")
        .slice(-1)[0];
      if (lastNode) {
        flowGraph.edges.push({
          id: "edge-output",
          from: lastNode.id,
          to: outputId,
        });
      }
    }

    return {
      flowGraph,
      spec,
      requiredConnectors,
    };
  } catch (error) {
    // If LLM generation fails, return a minimal fallback flow
    console.error("LLM generation failed:", error);

    const fallbackFlow: FlowGraph = {
      nodes: [
        {
          id: "trigger-1",
          type: "trigger.schedule",
          label: "Schedule Trigger",
          config: {
            scheduleType: "daily",
            time: "09:00",
          },
        },
        {
          id: "llm-1",
          type: "llm",
          label: "Process Description",
          config: {
            provider: "openai",
            model: "gpt-4",
            systemPrompt: "You are a helpful assistant that processes automation requests.",
            userPrompt: request.description,
          },
        },
        {
          id: "output-1",
          type: "output",
          label: "Output",
        },
      ],
      edges: [
        { id: "edge-1", from: "trigger-1", to: "llm-1" },
        { id: "edge-2", from: "llm-1", to: "output-1" },
      ],
    };

    const fallbackSpec: AgentSpec = {
      overview: `Agent generated from: ${request.description}. This is a basic flow - please refine it in the builder.`,
      triggers: ["Schedule: daily at 09:00"],
      externalServices: [],
      dataFlow: "Trigger → LLM → Output",
      risks: ["This is a fallback flow. Please review and customize."],
      assumptions: ["LLM processing is sufficient for this task."],
    };

    return {
      flowGraph: fallbackFlow,
      spec: fallbackSpec,
      requiredConnectors: [],
    };
  }
}

