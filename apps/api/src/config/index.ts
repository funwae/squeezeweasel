/**
 * Application configuration
 */

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL || "",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  llm: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  app: {
    webBaseUrl: process.env.WEB_BASE_URL || "http://localhost:3000",
    apiBaseUrl: process.env.API_BASE_URL || "http://localhost:4000",
  },
  demo: {
    enabled: process.env.DEMO_MODE === "true",
    workspaceId: process.env.DEMO_WORKSPACE_ID,
    agentId: process.env.DEMO_AGENT_ID,
  },
} as const;

