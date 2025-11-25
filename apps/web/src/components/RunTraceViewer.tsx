"use client";

import { useState } from "react";
import type { RunNodeStatus } from "@squeezeweasel/shared-types";
import { DemoModeBanner } from "./DemoModeBanner";

interface RunNode {
  id: string;
  nodeId: string;
  nodeType: string;
  status: RunNodeStatus;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

interface RunTrace {
  runId: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
  nodes: RunNode[];
}

interface RunTraceViewerProps {
  trace: RunTrace;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "success":
      return "text-sw-accent-green border-sw-accent-green";
    case "failed":
      return "text-sw-accent-red border-sw-accent-red";
    case "running":
      return "text-sw-accent-yellow border-sw-accent-yellow";
    case "pending":
      return "text-sw-text-secondary border-sw-border-subtle";
    case "skipped":
      return "text-sw-text-secondary border-sw-border-subtle opacity-50";
    default:
      return "text-sw-text-secondary border-sw-border-subtle";
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case "success":
      return "✓";
    case "failed":
      return "✗";
    case "running":
      return "⟳";
    case "pending":
      return "○";
    case "skipped":
      return "⊘";
    default:
      return "○";
  }
}

function formatDuration(startedAt?: string, finishedAt?: string): string {
  if (!startedAt) return "—";
  const start = new Date(startedAt);
  const end = finishedAt ? new Date(finishedAt) : new Date();
  const ms = end.getTime() - start.getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export default function RunTraceViewer({ trace }: RunTraceViewerProps) {
  const [selectedNode, setSelectedNode] = useState<RunNode | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="p-6 pb-0">
        <DemoModeBanner />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Timeline View */}
        <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-sw-text-primary">Execution Trace</h2>
            <div className={`px-3 py-1 rounded-full border ${getStatusColor(trace.status)}`}>
              <span className="text-sm font-medium">{trace.status.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-sm text-sw-text-secondary">
            {trace.startedAt && (
              <span>
                Started: {new Date(trace.startedAt).toLocaleString()}
              </span>
            )}
            {trace.finishedAt && (
              <span className="ml-4">
                Duration: {formatDuration(trace.startedAt, trace.finishedAt)}
              </span>
            )}
          </div>
          {trace.errorMessage && (
            <div className="mt-4 p-3 bg-sw-accent-red/10 border border-sw-accent-red/30 rounded-lg">
              <p className="text-sm text-sw-accent-red font-medium">Error:</p>
              <p className="text-sm text-sw-text-secondary mt-1">{trace.errorMessage}</p>
            </div>
          )}
        </div>

        {/* Node Timeline */}
        <div className="space-y-3">
          {trace.nodes.map((node, index) => (
            <div
              key={node.id}
              className={`p-4 bg-sw-bg-elevated border rounded-lg cursor-pointer transition-colors ${
                selectedNode?.id === node.id
                  ? "border-sw-accent-green"
                  : "border-sw-border-subtle hover:border-sw-border"
              }`}
              onClick={() => setSelectedNode(node)}
            >
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                      node.status
                    )}`}
                  >
                    <span className="text-xs font-bold">{getStatusIcon(node.status)}</span>
                  </div>
                  {index < trace.nodes.length - 1 && (
                    <div className="w-0.5 h-12 bg-sw-border-subtle mt-1" />
                  )}
                </div>

                {/* Node info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-sw-text-primary">
                        {node.nodeId}
                      </span>
                      <span className="text-xs text-sw-text-secondary px-2 py-0.5 bg-sw-bg rounded border border-sw-border-subtle">
                        {node.nodeType}
                      </span>
                    </div>
                    <span className="text-xs text-sw-text-secondary">
                      {formatDuration(node.startedAt, node.finishedAt)}
                    </span>
                  </div>
                  {node.startedAt && (
                    <div className="text-xs text-sw-text-secondary">
                      {new Date(node.startedAt).toLocaleTimeString()}
                      {node.finishedAt && (
                        <span className="ml-2">
                          → {new Date(node.finishedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  )}
                  {node.errorMessage && (
                    <div className="mt-2 text-xs text-sw-accent-red">
                      {node.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {trace.nodes.length === 0 && (
          <div className="text-center py-12 text-sw-text-secondary">
            <p>No node executions recorded yet.</p>
          </div>
        )}
      </div>

      {/* Node Detail Panel */}
      {selectedNode && (
        <div className="w-96 border-l border-sw-border-subtle bg-sw-bg-elevated overflow-y-auto">
          <div className="p-4 border-b border-sw-border-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-sw-text-primary">Node Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-sw-text-secondary hover:text-sw-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="mt-2">
              <span className="text-xs text-sw-text-secondary px-2 py-1 bg-sw-bg rounded border border-sw-border-subtle">
                {selectedNode.nodeType}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-sw-text-primary mb-2">Status</h4>
              <div className={`px-3 py-1 rounded-full border inline-block ${getStatusColor(selectedNode.status)}`}>
                <span className="text-sm">{selectedNode.status}</span>
              </div>
            </div>

            {selectedNode.startedAt && (
              <div>
                <h4 className="text-sm font-medium text-sw-text-primary mb-2">Timing</h4>
                <div className="text-sm text-sw-text-secondary space-y-1">
                  <div>Started: {new Date(selectedNode.startedAt).toLocaleString()}</div>
                  {selectedNode.finishedAt && (
                    <div>Finished: {new Date(selectedNode.finishedAt).toLocaleString()}</div>
                  )}
                  <div>Duration: {formatDuration(selectedNode.startedAt, selectedNode.finishedAt)}</div>
                </div>
              </div>
            )}

            {selectedNode.input && (
              <div>
                <h4 className="text-sm font-medium text-sw-text-primary mb-2">Input</h4>
                <pre className="p-3 bg-sw-bg border border-sw-border-subtle rounded-lg text-xs text-sw-text-secondary overflow-x-auto">
                  {JSON.stringify(selectedNode.input, null, 2)}
                </pre>
              </div>
            )}

            {selectedNode.output && (
              <div>
                <h4 className="text-sm font-medium text-sw-text-primary mb-2">Output</h4>
                <pre className="p-3 bg-sw-bg border border-sw-border-subtle rounded-lg text-xs text-sw-text-secondary overflow-x-auto">
                  {JSON.stringify(selectedNode.output, null, 2)}
                </pre>
              </div>
            )}

            {selectedNode.errorMessage && (
              <div>
                <h4 className="text-sm font-medium text-sw-accent-red mb-2">Error</h4>
                <div className="p-3 bg-sw-accent-red/10 border border-sw-accent-red/30 rounded-lg">
                  <p className="text-sm text-sw-text-secondary">{selectedNode.errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

