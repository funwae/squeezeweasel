"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RunTraceViewer from "@/components/RunTraceViewer";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";
import type { RunNodeStatus } from "@squeezeweasel/shared-types";

interface Run {
  id: string;
  status: string;
  triggerType: string;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
}

interface RunTrace {
  runId: string;
  status: string;
  startedAt?: string;
  finishedAt?: string;
  errorMessage?: string;
  nodes: Array<{
    id: string;
    nodeId: string;
    nodeType: string;
    status: RunNodeStatus;
    startedAt?: string;
    finishedAt?: string;
    errorMessage?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
  }>;
}

export default function RunsPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [trace, setTrace] = useState<RunTrace | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTrace, setLoadingTrace] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }
    loadRuns();
  }, [agentId]);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.listRuns(agentId, 50);
      setRuns(response.runs);
    } catch (error) {
      console.error("Failed to load runs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrace = async (runId: string) => {
    try {
      setLoadingTrace(true);
      setSelectedRunId(runId);
      const trace = await apiClient.getRunTrace(runId);
      setTrace(trace);
    } catch (error) {
      console.error("Failed to load trace:", error);
    } finally {
      setLoadingTrace(false);
    }
  };

  const handleRunClick = (runId: string) => {
    loadTrace(runId);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-sw-text-secondary">Loading runs...</div>
      </div>
    );
  }

  return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Runs List */}
        <div className="w-80 border-r border-sw-border-subtle bg-sw-bg-elevated overflow-y-auto">
          <div className="p-4 border-b border-sw-border-subtle">
            <h1 className="text-xl font-semibold text-sw-text-primary">Run History</h1>
            <p className="text-sm text-sw-text-secondary mt-1">
              View execution traces
            </p>
          </div>
          <div className="p-2">
            {runs.length === 0 ? (
              <div className="p-8 text-center text-sw-text-secondary">
                <p className="text-sm">No runs yet</p>
                <p className="text-xs mt-2">Trigger a run to see execution traces</p>
              </div>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    onClick={() => handleRunClick(run.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRunId === run.id
                        ? "border-sw-accent-green bg-sw-bg"
                        : "border-sw-border-subtle bg-sw-bg-elevated hover:border-sw-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-sw-text-primary">
                        {run.triggerType}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          run.status === "success"
                            ? "bg-sw-accent-green/20 text-sw-accent-green"
                            : run.status === "failed"
                            ? "bg-sw-accent-red/20 text-sw-accent-red"
                            : "bg-sw-text-secondary/20 text-sw-text-secondary"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>
                    {run.startedAt && (
                      <div className="text-xs text-sw-text-secondary">
                        {new Date(run.startedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trace Viewer */}
        <div className="flex-1">
          {selectedRunId && trace ? (
            <RunTraceViewer trace={trace} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-sw-text-secondary">
                  Select a run to view its execution trace
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

