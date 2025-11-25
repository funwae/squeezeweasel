/**
 * Demo workspace seeding script
 * Creates a demo workspace, SqueezeWeasel Radar agent, and flow graph
 */

import { prisma } from "../db/client.js";
import type { FlowGraph } from "@squeezeweasel/shared-types";

const DEMO_WORKSPACE_SLUG = "demo";
const DEMO_AGENT_NAME = "SqueezeWeasel Radar";
const DEMO_AGENT_SLUG = "squeezeweasel-radar";

/**
 * Create Short-Squeeze Radar flow graph
 */
function createShortSqueezeFlowGraph(): FlowGraph {
  return {
    nodes: [
      {
        id: "trigger-1",
        type: "trigger.schedule",
        label: "Daily Schedule Trigger",
        config: {
          schedule: "0 9 * * *", // 9 AM daily
          timezone: "America/New_York",
        },
      },
      {
        id: "reddit-fetch-1",
        type: "tool.reddit",
        label: "Fetch Reddit Posts",
        config: {
          operation: "fetchPosts",
          subreddit: "shortsqueeze",
          sort: "hot",
          limit: 50,
          timeFilter: "day",
        },
      },
      {
        id: "transform-1",
        type: "transform",
        label: "Normalize Posts",
        config: {
          operation: "normalize",
        },
      },
      {
        id: "llm-sentiment-1",
        type: "llm",
        label: "Extract Tickers & Sentiment",
        config: {
          model: "gpt-4",
          systemPrompt:
            "You are a financial sentiment classifier. Extract ticker symbols mentioned in Reddit posts and score sentiment (0-10) and squeeze-vibe (0-10). Return JSON with ticker, sentiment, squeezeVibe.",
          userPromptTemplate: "Analyze these Reddit posts: {{posts}}",
        },
      },
      {
        id: "transform-aggregate-1",
        type: "transform",
        label: "Aggregate by Ticker",
        config: {
          operation: "aggregate",
          groupBy: "ticker",
          aggregations: {
            sentiment: "avg",
            squeezeVibe: "avg",
            mentions: "count",
          },
        },
      },
      {
        id: "stock-data-1",
        type: "tool.stock",
        label: "Fetch Stock Data",
        config: {
          provider: "yahoo",
          fields: ["shortInterest", "float", "utilization"],
        },
      },
      {
        id: "squeeze-score-1",
        type: "transform",
        label: "Calculate SqueezeScore",
        config: {
          operation: "squeezeScore",
          type: "squeezeScore",
        },
      },
      {
        id: "condition-1",
        type: "condition",
        label: "Filter High Scores",
        config: {
          condition: "squeezeScore >= 50",
        },
      },
      {
        id: "output-1",
        type: "output",
        label: "Save Results",
        config: {
          format: "json",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        from: "trigger-1",
        to: "reddit-fetch-1",
      },
      {
        id: "e2",
        from: "reddit-fetch-1",
        to: "transform-1",
      },
      {
        id: "e3",
        from: "transform-1",
        to: "llm-sentiment-1",
      },
      {
        id: "e4",
        from: "llm-sentiment-1",
        to: "transform-aggregate-1",
      },
      {
        id: "e5",
        from: "transform-aggregate-1",
        to: "stock-data-1",
      },
      {
        id: "e6",
        from: "stock-data-1",
        to: "squeeze-score-1",
      },
      {
        id: "e7",
        from: "squeeze-score-1",
        to: "condition-1",
      },
      {
        id: "e8",
        from: "condition-1",
        to: "output-1",
        condition: "true",
      },
    ],
  };
}

async function seedDemo() {
  console.log("🌱 Seeding demo workspace...");

  try {
    // Find or create demo workspace
    let demoWorkspace = await prisma.workspace.findFirst({
      where: {
        slug: DEMO_WORKSPACE_SLUG,
      },
    });

    if (!demoWorkspace) {
      // Create a placeholder user for demo workspace owner
      const demoUser = await prisma.user.upsert({
        where: {
          email: "demo@squeezeweasel.local",
        },
        update: {},
        create: {
          email: "demo@squeezeweasel.local",
          name: "Demo User",
          authProvider: "EMAIL",
        },
      });

      demoWorkspace = await prisma.workspace.create({
        data: {
          name: "Demo Workspace",
          slug: DEMO_WORKSPACE_SLUG,
          ownerId: demoUser.id,
          plan: "FREE",
        },
      });
      console.log("✅ Created demo workspace");
    } else {
      console.log("✅ Demo workspace already exists");
    }

    // Find or create demo agent
    let demoAgent = await prisma.agent.findFirst({
      where: {
        workspaceId: demoWorkspace.id,
        slug: DEMO_AGENT_SLUG,
      },
    });

    if (!demoAgent) {
      demoAgent = await prisma.agent.create({
        data: {
          workspaceId: demoWorkspace.id,
          name: DEMO_AGENT_NAME,
          slug: DEMO_AGENT_SLUG,
          description:
            "Scans Reddit sentiment and stock data to surface potential short-squeeze candidates daily.",
          createdById: demoWorkspace.ownerId,
        },
      });
      console.log("✅ Created demo agent");
    } else {
      console.log("✅ Demo agent already exists");
    }

    // Create flow graph
    const flowGraph = createShortSqueezeFlowGraph();
    const flowGraphRecord = await prisma.flowGraph.create({
      data: {
        workspaceId: demoWorkspace.id,
        graphJson: flowGraph as any,
      },
    });
    console.log("✅ Created flow graph");

    // Find or create agent version
    let agentVersion = await prisma.agentVersion.findFirst({
      where: {
        agentId: demoAgent.id,
        versionNumber: 1,
      },
    });

    if (!agentVersion) {
      // Create agent version
      const specMarkdown = `# ${DEMO_AGENT_NAME}

## Overview
Scans Reddit discussions from target subreddits (e.g., r/shortsqueeze) for stock mentions, extracts ticker symbols, scores sentiment and squeeze-related language, combines with short-interest data, and produces a ranked list of candidate tickers with SqueezeScores.

## Flow
1. Daily schedule trigger (9 AM ET)
2. Fetch Reddit posts from target subreddits
3. Extract tickers and score sentiment/squeeze-vibe using LLM
4. Aggregate scores by ticker
5. Fetch stock data (short interest, float, utilization)
6. Calculate SqueezeScore (0-100)
7. Filter candidates above threshold
8. Save results

## Configuration
- Subreddits: r/shortsqueeze (configurable)
- Time window: Last 24 hours
- Minimum SqueezeScore: 50
`;

      agentVersion = await prisma.agentVersion.create({
        data: {
          agentId: demoAgent.id,
          versionNumber: 1,
          specMarkdown,
          specJson: {
            name: DEMO_AGENT_NAME,
            description: "Short-squeeze radar agent",
            triggers: ["schedule"],
            connectors: ["reddit", "stock"],
          },
          flowGraphId: flowGraphRecord.id,
          status: "ACTIVE",
          createdById: demoWorkspace.ownerId,
        },
      });
      console.log("✅ Created agent version");
    } else {
      console.log("✅ Agent version already exists");
    }

    // Set as active version
    await prisma.agent.update({
      where: {
        id: demoAgent.id,
      },
      data: {
        activeVersionId: agentVersion.id,
      },
    });
    console.log("✅ Set agent version as active");

    // Check if a completed run already exists
    const existingRun = await prisma.run.findFirst({
      where: {
        agentId: demoAgent.id,
        status: "SUCCESS",
      },
    });

    if (existingRun) {
      console.log("✅ Pre-populated run already exists");
    } else {
      // Create a pre-populated completed run with sample candidates
    const sampleCandidates = [
      {
        ticker: "GME",
        squeezeScore: 85,
        band: "strong",
        explanation: "high short interest, bullish and squeeze-focused chatter, heavy mention volume",
        mentionCount: 234,
        shortInterest: 25.5,
        borrowFee: 12.5,
        sentiment: 8.5,
        squeezeVibe: 9.2,
      },
      {
        ticker: "AMC",
        squeezeScore: 78,
        band: "moderate",
        explanation: "elevated borrow fee, bullish and squeeze-focused chatter",
        mentionCount: 189,
        shortInterest: 18.3,
        borrowFee: 8.7,
        sentiment: 7.8,
        squeezeVibe: 8.1,
      },
      {
        ticker: "BBBY",
        squeezeScore: 72,
        band: "moderate",
        explanation: "high short interest, heavy mention volume",
        mentionCount: 156,
        shortInterest: 32.1,
        borrowFee: 15.2,
        sentiment: 7.2,
        squeezeVibe: 7.5,
      },
      {
        ticker: "SPRT",
        squeezeScore: 68,
        band: "moderate",
        explanation: "high short interest, elevated borrow fee",
        mentionCount: 98,
        shortInterest: 28.7,
        borrowFee: 18.5,
        sentiment: 6.8,
        squeezeVibe: 7.0,
      },
    ];

    const completedRun = await prisma.run.create({
      data: {
        agentId: demoAgent.id,
        agentVersionId: agentVersion.id,
        workspaceId: demoWorkspace.id,
        triggerType: "MANUAL",
        status: "SUCCESS",
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
        finishedAt: new Date(Date.now() - 3000000), // 50 minutes ago
      },
    });

    // Create run nodes with sample data
    const redditNode = await prisma.runNode.create({
      data: {
        runId: completedRun.id,
        nodeId: "reddit-fetch-1",
        nodeType: "tool.reddit",
        status: "SUCCESS",
        input: { subreddit: "shortsqueeze", limit: 50 },
        output: { posts: "50 posts fetched" },
        startedAt: new Date(Date.now() - 3600000),
        finishedAt: new Date(Date.now() - 3500000),
      },
    });

    const stockNode = await prisma.runNode.create({
      data: {
        runId: completedRun.id,
        nodeId: "stock-data-1",
        nodeType: "tool.stock",
        status: "SUCCESS",
        input: { tickers: ["GME", "AMC", "BBBY", "SPRT"] },
        output: { stocks: "Stock data fetched" },
        startedAt: new Date(Date.now() - 3500000),
        finishedAt: new Date(Date.now() - 3400000),
      },
    });

    const squeezeScoreNode = await prisma.runNode.create({
      data: {
        runId: completedRun.id,
        nodeId: "squeeze-score-1",
        nodeType: "transform",
        status: "SUCCESS",
        input: { candidates: "Processing candidates" },
        output: { candidates: sampleCandidates },
        startedAt: new Date(Date.now() - 3400000),
        finishedAt: new Date(Date.now() - 3300000),
      },
    });

    const outputNode = await prisma.runNode.create({
      data: {
        runId: completedRun.id,
        nodeId: "output-1",
        nodeType: "output",
        status: "SUCCESS",
        input: { candidates: sampleCandidates },
        output: {
          result: {
            candidates: sampleCandidates,
            completed: true,
            timestamp: new Date().toISOString(),
          },
        },
        startedAt: new Date(Date.now() - 3300000),
        finishedAt: new Date(Date.now() - 3000000),
      },
    });

      console.log("✅ Created pre-populated completed run");
      console.log(`Run ID: ${completedRun.id}`);
      console.log(`Candidates: ${sampleCandidates.length}`);
    }

    console.log("\n🎉 Demo seeding complete!");
    console.log(`Workspace ID: ${demoWorkspace.id}`);
    console.log(`Agent ID: ${demoAgent.id}`);
    console.log(`Agent Version ID: ${agentVersion.id}`);
    console.log(`Flow Graph ID: ${flowGraphRecord.id}`);
  } catch (error) {
    console.error("❌ Error seeding demo:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemo()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDemo };

