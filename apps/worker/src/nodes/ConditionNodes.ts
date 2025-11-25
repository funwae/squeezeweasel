/**
 * Condition node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";

export const conditionNodes = {
  condition: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const field = (node.config?.field as string) || "";
      const operator = (node.config?.operator as string) || "==";
      const value = node.config?.value;

      const fieldValue = input[field];

      let result = false;

      switch (operator) {
        case "==":
          result = fieldValue === value;
          break;
        case "!=":
          result = fieldValue !== value;
          break;
        case ">":
          result = Number(fieldValue) > Number(value);
          break;
        case "<":
          result = Number(fieldValue) < Number(value);
          break;
        case ">=":
          result = Number(fieldValue) >= Number(value);
          break;
        case "<=":
          result = Number(fieldValue) <= Number(value);
          break;
        case "contains":
          result = String(fieldValue).includes(String(value));
          break;
        case "regex":
          const regex = new RegExp(String(value));
          result = regex.test(String(fieldValue));
          break;
        default:
          result = Boolean(fieldValue);
      }

      return {
        result,
        condition: `${field} ${operator} ${value}`,
      };
    },
  },
};

