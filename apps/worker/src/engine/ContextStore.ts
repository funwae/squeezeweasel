/**
 * Context store - manages run context and state
 */

export interface RunContext {
  runId: string;
  workspaceId: string;
  nodeOutputs: Map<string, Record<string, unknown>>;
  globalVars: Record<string, unknown>;
}

export class ContextStore {
  private contexts = new Map<string, RunContext>();

  createContext(runId: string, workspaceId: string): RunContext {
    const context: RunContext = {
      runId,
      workspaceId,
      nodeOutputs: new Map(),
      globalVars: {},
    };

    this.contexts.set(runId, context);
    return context;
  }

  getContext(runId: string): RunContext | undefined {
    return this.contexts.get(runId);
  }

  setNodeOutput(runId: string, nodeId: string, output: Record<string, unknown>): void {
    const context = this.contexts.get(runId);
    if (context) {
      context.nodeOutputs.set(nodeId, output);
    }
  }

  getNodeOutput(runId: string, nodeId: string): Record<string, unknown> | undefined {
    const context = this.contexts.get(runId);
    return context?.nodeOutputs.get(nodeId);
  }

  setGlobalVar(runId: string, key: string, value: unknown): void {
    const context = this.contexts.get(runId);
    if (context) {
      context.globalVars[key] = value;
    }
  }

  getGlobalVar(runId: string, key: string): unknown {
    const context = this.contexts.get(runId);
    return context?.globalVars[key];
  }

  clearContext(runId: string): void {
    this.contexts.delete(runId);
  }
}

