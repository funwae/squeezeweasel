/**
 * Worker configuration
 */

export const config = {
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
  llm: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  demo: {
    enabled: process.env.DEMO_MODE === "true",
  },
} as const;

