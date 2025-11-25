/**
 * NL → Flow generation routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { requireDemoOrAuth } from "../middleware/demo-auth.js";
import { LLMGateway } from "../infra/LLMGateway.js";

// Dynamic import for generateFlowFromNL to handle cases where package might not be available
async function getGenerateFlowFromNL() {
  try {
    const agentSpec = await import("@squeezeweasel/agent-spec");
    return agentSpec.generateFlowFromNL;
  } catch (err) {
    console.warn("agent-spec package not available, NL→Flow generation disabled");
    return null;
  }
}


export async function generateRoutes(fastify: FastifyInstance) {
  const llmGateway = new LLMGateway();

  // Generate flow from natural language
  fastify.post(
    "/workspaces/:wsId/agents/generate-from-description",
    { preHandler: [requireDemoOrAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { wsId } = request.params as { wsId: string };
      const body = request.body as { description: string };

      if (!body.description || body.description.trim().length < 10) {
        return reply.status(400).send({
          error: {
            code: "INVALID_INPUT",
            message: "Description must be at least 10 characters",
          },
        });
      }

      // LLM call wrapper
      const llmCall = async (prompt: string): Promise<string> => {
        try {
          const response = await llmGateway.call({
            model: "gpt-4",
            systemPrompt: prompt.split("\n\n")[0], // First part is system prompt
            userPrompt: prompt.split("\n\n").slice(1).join("\n\n"), // Rest is user prompt
            temperature: 0.3, // Lower temperature for more deterministic flow generation
          });
          return response;
        } catch (error) {
          console.error("LLM call failed:", error);
          throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      };

      const generateFlowFromNL = await getGenerateFlowFromNL();

      if (!generateFlowFromNL) {
        return reply.status(503).send({
          error: {
            code: "FEATURE_UNAVAILABLE",
            message: "NL→Flow generation is not available",
          },
        });
      }

      try {
        const result = await generateFlowFromNL(
          {
            description: body.description,
            workspaceId: wsId,
          },
          llmCall
        );

        return reply.send(result);
      } catch (error) {
        console.error("Flow generation failed:", error);
        return reply.status(500).send({
          error: {
            code: "GENERATION_FAILED",
            message: error instanceof Error ? error.message : "Failed to generate flow",
          },
        });
      }
    }
  );
}

