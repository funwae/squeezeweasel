/**
 * Transform node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";

/**
 * Calculate SqueezeScore (0-100) from sentiment, squeeze-vibe, short interest, and utilization
 * Matches spec: deterministic, real computation
 */
function calculateSqueezeScore(
  input: Record<string, unknown>,
  config?: Record<string, unknown>
): Record<string, unknown> {
  // Extract inputs with defaults
  const ticker = (input.ticker as string) || "";
  const mentionCount = typeof input.mentions === "number" ? input.mentions :
                       typeof input.mentionCount === "number" ? input.mentionCount : 0;
  const sentiment = typeof input.sentiment === "number" ? input.sentiment : 0;
  const squeezeVibe = typeof input.squeezeVibe === "number" ? input.squeezeVibe : 0;
  const shortInterestPct = typeof input.shortInterest === "number" ? input.shortInterest : 0;
  const borrowFeePct = typeof input.borrowFee === "number" ? input.borrowFee :
                       typeof input.utilization === "number" ? input.utilization : 0;

  // Normalize inputs according to spec
  const normShort = Math.min(shortInterestPct, 60) / 60; // cap at 60%
  const normBorrow = Math.min(borrowFeePct, 50) / 50;   // cap at 50%
  const normSent = sentiment / 10; // sentiment is 0-10
  const normTone = squeezeVibe / 10; // squeezeVibe is 0-10
  const normMentions = Math.min(mentionCount, 50) / 50; // cap at 50 mentions

  // Calculate raw score with weights (matching spec)
  const raw =
    0.30 * normShort +
    0.20 * normBorrow +
    0.20 * normSent +
    0.20 * normTone +
    0.10 * normMentions;

  const score = Math.round(raw * 100);

  // Determine band
  let band: "weak" | "moderate" | "strong";
  if (score >= 75) band = "strong";
  else if (score >= 50) band = "moderate";
  else band = "weak";

  // Generate explanation
  const explanation = generateSqueezeScoreExplanation(
    score,
    normShort,
    normBorrow,
    normSent,
    normTone,
    normMentions
  );

  return {
    ticker,
    squeezeScore: score,
    band,
    explanation,
    components: {
      sentiment: normSent * 10,
      squeezeVibe: normTone * 10,
      shortInterest: shortInterestPct,
      borrowFee: borrowFeePct,
      mentionCount,
      normalizedShortInterest: normShort,
      normalizedBorrowFee: normBorrow,
      normalizedSentiment: normSent,
      normalizedTone: normTone,
      normalizedMentions: normMentions,
    },
  };
}

/**
 * Generate human-readable explanation for SqueezeScore
 */
function generateSqueezeScoreExplanation(
  score: number,
  normShort: number,
  normBorrow: number,
  normSent: number,
  normTone: number,
  normMentions: number
): string {
  const explanationParts: string[] = [];

  if (normShort > 0.7) explanationParts.push("high short interest");
  if (normBorrow > 0.6) explanationParts.push("elevated borrow fee");
  if (normSent > 0.6 || normTone > 0.6)
    explanationParts.push("bullish and squeeze-focused chatter");
  if (normMentions > 0.5) explanationParts.push("heavy mention volume");

  const explanation =
    explanationParts.length > 0
      ? explanationParts.join(", ")
      : "signal driven mostly by baseline metrics";

  return explanation;
}

export const transformNodes = {
  transform: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const transformType = (node.config?.type as string) || "pass-through";
      const mapping = (node.config?.mapping as Record<string, string>) || {};

      switch (transformType) {
        case "pass-through":
          return input;

        case "map-fields":
          // Map fields according to mapping config
          const output: Record<string, unknown> = {};
          for (const [outputKey, inputKey] of Object.entries(mapping)) {
            output[outputKey] = input[inputKey];
          }
          return output;

        case "jsonpath":
          // Simple JSONPath-like selection
          const path = (node.config?.path as string) || "";
          if (path.startsWith("$.")) {
            const keys = path.slice(2).split(".");
            let value: unknown = input;
            for (const key of keys) {
              if (value && typeof value === "object" && key in value) {
                value = (value as Record<string, unknown>)[key];
              } else {
                return {};
              }
            }
            return { value };
          }
          return input;

        case "squeezeScore":
          // Calculate SqueezeScore deterministically
          return calculateSqueezeScore(input, node.config);

        default:
          return input;
      }
    },
  },
};

