/**
 * Demo flow for testing the execution engine
 *
 * Simple flow: Trigger -> LLM -> Output
 */

import type { FlowGraph } from "@squeezeweasel/shared-types";

export const demoFlow: FlowGraph = {
  nodes: [
    {
      id: "trigger-1",
      type: "trigger.schedule",
      label: "Schedule Trigger",
      config: {
        schedule: "daily",
        time: "09:00",
      },
    },
    {
      id: "llm-1",
      type: "llm",
      label: "Summarize",
      config: {
        model: "gpt-4",
        systemPrompt: "You are a helpful assistant that summarizes information concisely.",
        userPrompt: "Summarize the following in one sentence: {{input}}",
        temperature: 0.7,
      },
    },
    {
      id: "output-1",
      type: "output",
      label: "Output",
      config: {},
    },
  ],
  edges: [
    {
      id: "edge-1",
      from: "trigger-1",
      to: "llm-1",
    },
    {
      id: "edge-2",
      from: "llm-1",
      to: "output-1",
    },
  ],
};

/**
 * Demo flow execution test
 *
 * This can be used to test the execution engine without a full database setup
 */
export async function testDemoFlow() {
  const { FlowExecutor } = await import("./engine/FlowExecutor.js");
  const executor = new FlowExecutor();

  // Mock run ID and workspace
  const runId = "demo-run-1";
  const workspaceId = "demo-workspace-1";

  try {
    await executor.executeRun(runId, workspaceId, demoFlow);
    console.log("Demo flow executed successfully");
  } catch (error) {
    console.error("Demo flow execution failed:", error);
    throw error;
  }
}

