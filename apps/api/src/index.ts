/**
 * Fastify API server entry point
 */

import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import { config } from "./config/index.js";
import { logger } from "./infra/Logger.js";

// Import routes
import { authRoutes } from "./routes/auth.js";
import { agentRoutes } from "./routes/agents.js";
import { agentVersionRoutes } from "./routes/agent-versions.js";
import { flowRoutes } from "./routes/flows.js";
import { runRoutes } from "./routes/runs.js";
import { templateRoutes } from "./routes/templates.js";
import { connectorRoutes } from "./routes/connectors.js";
import { secretRoutes } from "./routes/secrets.js";
import { webhookRoutes } from "./routes/webhooks.js";
import { generateRoutes } from "./routes/generate.js";
import { demoRoutes } from "./routes/demo.js";
import { Scheduler } from "./scheduler/Scheduler.js";

const fastify = Fastify({
  logger: config.nodeEnv === "development",
});

// Register plugins
await fastify.register(helmet);
await fastify.register(cors, {
  origin: (origin, callback) => {
    // Allow localhost on any port for demo mode
    if (config.demo.enabled && origin && origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else if (origin === config.app.webBaseUrl) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
});

await fastify.register(jwt, {
  secret: config.auth.jwtSecret,
});

// Extend Fastify types
declare module "fastify" {
  interface FastifyRequest {
    user?: { userId: string; email: string };
  }
}

// Add authenticate decorator
fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.user = request.user as { userId: string; email: string };
  } catch (err) {
    reply.send(err);
  }
});

// Register routes
await fastify.register(authRoutes, { prefix: "/api/auth" });
await fastify.register(agentRoutes, { prefix: "/api" });
await fastify.register(agentVersionRoutes, { prefix: "/api" });
await fastify.register(flowRoutes, { prefix: "/api" });
await fastify.register(runRoutes, { prefix: "/api" });
await fastify.register(templateRoutes, { prefix: "/api" });
await fastify.register(connectorRoutes, { prefix: "/api" });
await fastify.register(secretRoutes, { prefix: "/api" });
await fastify.register(webhookRoutes, { prefix: "/api" });
await fastify.register(generateRoutes, { prefix: "/api" });
await fastify.register(demoRoutes);

// Health check
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

fastify.get("/healthz", async () => {
  return { ok: true, demoMode: !!process.env.DEMO_MODE };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: "0.0.0.0" });
    logger.info(`API server listening on port ${config.port}`);

    // Start scheduler
    const scheduler = new Scheduler();
    scheduler.start();

    // Graceful shutdown
    process.on("SIGTERM", () => {
      scheduler.stop();
      fastify.close();
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

