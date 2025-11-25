/**
 * Trigger node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";

export const triggerNodes = {
  schedule: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      // Schedule trigger just passes through
      return {
        triggered: true,
        schedule: node.config?.schedule || "manual",
        timestamp: new Date().toISOString(),
      };
    },
  },

  webhook: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      // Webhook trigger passes through webhook payload
      return {
        triggered: true,
        payload: input.payload || {},
        timestamp: new Date().toISOString(),
      };
    },
  },
};

