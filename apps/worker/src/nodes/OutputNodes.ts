/**
 * Output node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";

export const outputNodes = {
  output: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      // Output node just returns the input as final result
      return {
        result: input,
        completed: true,
        timestamp: new Date().toISOString(),
      };
    },
  },
};

