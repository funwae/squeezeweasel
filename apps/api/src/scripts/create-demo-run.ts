/**
 * Script to create a demo run for testing
 *
 * This creates a simple agent, version, and flow graph, then triggers a run
 */

import { prisma } from "../db/client.js";
import { runQueue } from "../infra/Queue.js";
import { demoFlow } from "../../worker/src/demo-flow.js";

async function createDemoRun() {
  // Create a demo workspace (or use existing)
  let workspace = await prisma.workspace.findFirst({
    where: { slug: "demo" },
  });

  if (!workspace) {
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No user found. Please create a user first.");
    }

    workspace = await prisma.workspace.create({
      data: {
        name: "Demo Workspace",
        slug: "demo",
        ownerId: user.id,
      },
    });
  }

  // Create flow graph
  const flowGraph = await prisma.flowGraph.create({
    data: {
      workspaceId: workspace.id,
      graphJson: demoFlow,
    },
  });

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      workspaceId: workspace.id,
      name: "Demo Agent",
      slug: "demo-agent",
      description: "A simple demo agent for testing",
      createdById: workspace.ownerId,
    },
  });

  // Create agent version
  const agentVersion = await prisma.agentVersion.create({
    data: {
      agentId: agent.id,
      versionNumber: 1,
      specMarkdown: "Demo agent: Trigger -> LLM Summarize -> Output",
      specJson: {
        overview: "Simple demo flow",
        triggers: ["Schedule: daily at 09:00"],
        externalServices: [],
      },
      flowGraphId: flowGraph.id,
      status: "active",
      createdById: workspace.ownerId,
    },
  });

  // Set as active version
  await prisma.agent.update({
    where: { id: agent.id },
    data: { activeVersionId: agentVersion.id },
  });

  // Create run
  const run = await prisma.run.create({
    data: {
      agentId: agent.id,
      agentVersionId: agentVersion.id,
      workspaceId: workspace.id,
      triggerType: "manual",
      status: "pending",
    },
  });

  // Enqueue job
  await runQueue.add("execute-run", {
    runId: run.id,
    agentId: agent.id,
    agentVersionId: agentVersion.id,
    workspaceId: workspace.id,
    flowGraphId: flowGraph.id,
    triggerType: "manual",
  });

  console.log("Demo run created:", {
    runId: run.id,
    agentId: agent.id,
    agentName: agent.name,
  });

  return run;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDemoRun()
    .then(() => {
      console.log("✅ Demo run created successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Failed to create demo run:", error);
      process.exit(1);
    });
}

export { createDemoRun };

