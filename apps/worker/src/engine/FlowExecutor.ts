/**
 * Flow executor - interprets and executes flow graphs
 */

import type { FlowGraph, BaseNode, FlowEdge } from "@squeezeweasel/shared-types";
import { ContextStore, type RunContext } from "./ContextStore.js";
import { RunLogger } from "./RunLogger.js";
import { nodeRegistry } from "../nodes/index.js";
import { prisma } from "../db/client.js";
import { sanitizeErrorMessage } from "../utils/sanitize-logs.js";
import { config } from "../config/index.js";

export class FlowExecutor {
  private contextStore: ContextStore;
  private runLogger: RunLogger;

  constructor() {
    this.contextStore = new ContextStore();
    this.runLogger = new RunLogger();
  }

  async executeRun(
    runId: string,
    workspaceId: string,
    flowGraph: FlowGraph
  ): Promise<void> {
    // Create context
    const context = this.contextStore.createContext(runId, workspaceId);

    // Update run status
    await prisma.run.update({
      where: { id: runId },
      data: {
        status: "running",
        startedAt: new Date(),
      },
    });

    try {
      // Find entry nodes (nodes with no incoming edges)
      const entryNodes = this.findEntryNodes(flowGraph);

      // Execute from entry nodes
      for (const entryNode of entryNodes) {
        await this.executeNode(flowGraph, entryNode, context);
      }

      // Update run status to success
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "success",
          finishedAt: new Date(),
        },
      });
    } catch (error: any) {
      // Create user-friendly error message
      const errorMessage = this.formatErrorMessage(error, flowGraph);

      // Update run status to failed
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "failed",
          errorMessage: sanitizeErrorMessage(errorMessage),
          finishedAt: new Date(),
        },
      });

      throw error;
    } finally {
      // Clean up context
      this.contextStore.clearContext(runId);
    }
  }

  private findEntryNodes(flowGraph: FlowGraph): BaseNode[] {
    const nodesWithIncoming = new Set(
      flowGraph.edges.map((edge) => edge.to)
    );

    return flowGraph.nodes.filter(
      (node) => !nodesWithIncoming.has(node.id)
    );
  }

  private async executeNode(
    flowGraph: FlowGraph,
    node: BaseNode,
    context: RunContext
  ): Promise<Record<string, unknown>> {
    // Check if already executed
    const existingOutput = this.contextStore.getNodeOutput(context.runId, node.id);
    if (existingOutput) {
      return existingOutput;
    }

    // Get node handler
    const handler = nodeRegistry.get(node.type);
    if (!handler) {
      throw new Error(`No handler found for node type: ${node.type}`);
    }

    // Get input from previous nodes
    const input = this.buildNodeInput(flowGraph, node, context);

    // Log node start
    const runNodeId = await this.runLogger.logNodeStart(
      context.runId,
      node.id,
      node.type,
      input
    );

    try {
      // Execute node
      const output = await handler.execute(node, input, context);

      // Store output
      this.contextStore.setNodeOutput(context.runId, node.id, output);

      // Log success
      await this.runLogger.logNodeSuccess(runNodeId, output);

      // Execute next nodes
      const nextNodes = this.getNextNodes(flowGraph, node);
      for (const nextNode of nextNodes) {
        await this.executeNode(flowGraph, nextNode, context);
      }

      return output;
    } catch (error: any) {
      // Create user-friendly error message
      const errorMessage = this.formatNodeErrorMessage(node, error);

      // Log failure
      await this.runLogger.logNodeFailure(runNodeId, sanitizeErrorMessage(errorMessage));
      throw error;
    }
  }

  private buildNodeInput(
    flowGraph: FlowGraph,
    node: BaseNode,
    context: RunContext
  ): Record<string, unknown> {
    const input: Record<string, unknown> = {};

    // Get outputs from previous nodes
    const incomingEdges = flowGraph.edges.filter((edge) => edge.to === node.id);
    for (const edge of incomingEdges) {
      const prevOutput = this.contextStore.getNodeOutput(context.runId, edge.from);
      if (prevOutput) {
        // Merge previous output into input
        Object.assign(input, prevOutput);
      }
    }

    // Add node config
    if (node.config) {
      Object.assign(input, node.config);
    }

    return input;
  }

  private getNextNodes(flowGraph: FlowGraph, node: BaseNode): BaseNode[] {
    const outgoingEdges = flowGraph.edges.filter((edge) => edge.from === node.id);
    const nextNodeIds = outgoingEdges.map((edge) => edge.to);
    return flowGraph.nodes.filter((n) => nextNodeIds.includes(n.id));
  }

  /**
   * Format error message for the entire run
   */
  private formatErrorMessage(error: Error, flowGraph: FlowGraph): string {
    const message = error.message || "Unknown error occurred";

    // Check for common error patterns
    if (message.includes("API") || message.includes("fetch")) {
      if (config.demo.enabled) {
        return `External API call failed: ${message}. Demo data is still available.`;
      }
      return `External API call failed: ${message}`;
    }

    if (message.includes("timeout")) {
      return `Operation timed out: ${message}`;
    }

    if (message.includes("authentication") || message.includes("unauthorized")) {
      return `Authentication failed: ${message}. Please check your API credentials.`;
    }

    return `Run failed: ${message}`;
  }

  /**
   * Format error message for a specific node
   */
  private formatNodeErrorMessage(node: BaseNode, error: Error): string {
    const nodeLabel = node.label || node.id;
    const message = error.message || "Unknown error";

    // Check for common error patterns
    if (message.includes("required")) {
      return `${nodeLabel}: Missing required configuration. ${message}`;
    }

    if (message.includes("API") || message.includes("fetch")) {
      if (config.demo.enabled && (node.type === "tool.reddit" || node.type === "tool.stock")) {
        return `${nodeLabel}: API call failed (${message}). Using sample data for demo.`;
      }
      return `${nodeLabel}: API call failed. ${message}`;
    }

    if (message.includes("timeout")) {
      return `${nodeLabel}: Operation timed out. ${message}`;
    }

    return `${nodeLabel}: ${message}`;
  }
}

