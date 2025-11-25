/**
 * LLM node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";
import { LLMGateway } from "../llm/LLMGateway.js";

const llmGateway = new LLMGateway();

function resolveTemplate(template: string, data: Record<string, unknown>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
  }
  return result;
}

export const llmNodes = {
  llm: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const systemPrompt = (node.config?.systemPrompt as string) || "";
      const userPrompt = (node.config?.userPrompt as string) || "";
      const model = (node.config?.model as string) || "gpt-4";
      const temperature = (node.config?.temperature as number) || 0.7;

      // Replace template variables in prompts
      const resolvedSystemPrompt = resolveTemplate(systemPrompt, input);
      const resolvedUserPrompt = resolveTemplate(userPrompt, input);

      const response = await llmGateway.call({
        model,
        systemPrompt: resolvedSystemPrompt,
        userPrompt: resolvedUserPrompt,
        temperature,
      });

      return {
        response,
        model,
      };
    },

  },
};

