/**
 * Queue abstraction using BullMQ
 */

import { Queue } from "bullmq";
import { config } from "../config/index.js";
import Redis from "ioredis";

const connection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

export const runQueue = new Queue("agent-runs", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export interface RunJobData {
  runId: string;
  agentId: string;
  agentVersionId: string;
  workspaceId: string;
  flowGraphId: string;
  triggerType: string;
  triggerPayload?: Record<string, unknown>;
}
