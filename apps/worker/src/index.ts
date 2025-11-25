/**
 * Worker service entry point
 */

import { Worker } from "bullmq";
import Redis from "ioredis";
import { config } from "./config/index.js";
import { FlowExecutor } from "./engine/FlowExecutor.js";
import { prisma } from "./db/client.js";
export interface RunJobData {
  runId: string;
  agentId: string;
  agentVersionId: string;
  workspaceId: string;
  flowGraphId: string;
  triggerType: string;
  triggerPayload?: Record<string, unknown>;
}

const connection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

const flowExecutor = new FlowExecutor();

const worker = new Worker<RunJobData>(
  "agent-runs",
  async (job) => {
    const { runId, flowGraphId } = job.data;

    // Get flow graph from database
    const flowGraph = await prisma.flowGraph.findUnique({
      where: { id: flowGraphId },
    });

    if (!flowGraph) {
      throw new Error(`Flow graph not found: ${flowGraphId}`);
    }

    // Execute flow
    await flowExecutor.executeRun(
      runId,
      job.data.workspaceId,
      flowGraph.graphJson as any
    );
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log("Worker started, waiting for jobs...");

// Graceful shutdown
process.on("SIGTERM", async () => {
  await worker.close();
  await connection.quit();
  process.exit(0);
});

