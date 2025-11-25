/**
 * Run logger - logs node execution results
 */

import { prisma } from "../db/client.js";
import type { RunNodeStatus } from "@squeezeweasel/shared-types";
import { sanitizeForLogging, sanitizeErrorMessage } from "../utils/sanitize-logs.js";

export class RunLogger {
  async logNodeStart(
    runId: string,
    nodeId: string,
    nodeType: string,
    input?: Record<string, unknown>
  ): Promise<string> {
    // Sanitize input to prevent secret leakage
    const sanitizedInput = input ? (sanitizeForLogging(input) as Record<string, unknown>) : {};

    const runNode = await prisma.runNode.create({
      data: {
        runId,
        nodeId,
        nodeType,
        status: "running",
        input: sanitizedInput,
        startedAt: new Date(),
      },
    });

    return runNode.id;
  }

  async logNodeSuccess(
    runNodeId: string,
    output: Record<string, unknown>
  ): Promise<void> {
    // Sanitize output to prevent secret leakage
    const sanitizedOutput = sanitizeForLogging(output) as Record<string, unknown>;

    await prisma.runNode.update({
      where: { id: runNodeId },
      data: {
        status: "success",
        output: sanitizedOutput,
        finishedAt: new Date(),
      },
    });
  }

  async logNodeFailure(
    runNodeId: string,
    errorMessage: string
  ): Promise<void> {
    // Sanitize error message to prevent secret leakage
    const sanitizedError = sanitizeErrorMessage(errorMessage);

    await prisma.runNode.update({
      where: { id: runNodeId },
      data: {
        status: "failed",
        errorMessage: sanitizedError,
        finishedAt: new Date(),
      },
    });
  }

  async logNodeSkip(runNodeId: string): Promise<void> {
    await prisma.runNode.update({
      where: { id: runNodeId },
      data: {
        status: "skipped",
        finishedAt: new Date(),
      },
    });
  }
}

