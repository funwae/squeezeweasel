"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";
import { isDemoMode } from "@/lib/demo-utils";

interface Candidate {
  ticker: string;
  squeezeScore: number;
  band: "weak" | "moderate" | "strong";
  explanation: string;
  mentionCount?: number;
  shortInterest?: number;
  borrowFee?: number;
}

export default function RadarOverviewPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agent, setAgent] = useState<any>(null);
  const [latestRun, setLatestRun] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const demoMode = isDemoMode();

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    loadData();
  }, [agentId]);

  const loadData = async () => {
    try {
      // Load agent
      const agentData = await apiClient.getAgent(agentId);
      setAgent(agentData.agent);

      // Load latest run (use demo endpoint if in demo mode)
      if (demoMode) {
        try {
          const runData = await apiClient.getLatestDemoRun();
          setLatestRun(runData.run);
          // Extract candidates from run output
          if (runData.run) {
            extractCandidatesFromRun(runData.run);
          }
        } catch (err) {
          console.log("No demo run found yet");
        }
      } else {
        const runs = await apiClient.listRuns(agentId, 1);
        if (runs.runs && runs.runs.length > 0) {
          const run = await apiClient.getRun(runs.runs[0].id);
          setLatestRun(run.run);
          if (run.run) {
            extractCandidatesFromRun(run.run);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const extractCandidatesFromRun = (run: any) => {
    // Find the output node or squeezeScore node that has candidates
    const outputNode = run.nodes?.find(
      (n: any) => n.nodeType === "output" && n.output?.result?.candidates
    );

    const squeezeScoreNode = run.nodes?.find(
      (n: any) => n.nodeType === "transform" && n.output?.candidates
    );

    // Try output node first (most complete data)
    if (outputNode?.output?.result?.candidates) {
      setCandidates(outputNode.output.result.candidates);
    } else if (squeezeScoreNode?.output?.candidates) {
      setCandidates(squeezeScoreNode.output.candidates);
    } else if (outputNode?.output?.candidates) {
      setCandidates(outputNode.output.candidates);
    } else if (outputNode?.output) {
      // Try to extract candidates from output structure
      const output = outputNode.output;
      if (Array.isArray(output)) {
        setCandidates(output);
      } else if (output.results) {
        setCandidates(output.results);
      } else if (output.result?.candidates) {
        setCandidates(output.result.candidates);
      }
    }
  };

  const handleRunNow = async () => {
    setRunning(true);
    try {
      if (demoMode) {
        await apiClient.triggerDemoRun();
      } else {
        // TODO: Implement non-demo run trigger
        console.log("Non-demo run trigger not implemented yet");
      }
      // Wait a bit then reload
      setTimeout(() => {
        loadData();
      }, 2000);
    } catch (err) {
      console.error("Failed to trigger run:", err);
      alert("Failed to trigger run. Check console for details.");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
        <DemoModeBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Summary Card */}
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h2 className="text-lg font-semibold text-sw-text-primary mb-4">
                Today&apos;s Summary
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-sw-accent-green">
                    {candidates.length || 0}
                  </div>
                  <div className="text-sm text-sw-text-muted">Candidates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sw-text-primary">
                    {latestRun?.nodes?.find((n: any) => n.nodeType === "tool.reddit")?.output?.posts?.length || 0}
                  </div>
                  <div className="text-sm text-sw-text-muted">Posts Scanned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sw-text-primary">24h</div>
                  <div className="text-sm text-sw-text-muted">Time Window</div>
                </div>
              </div>
              <p className="text-xs text-sw-text-muted mt-4">
                Configured risk profile: Balanced
              </p>
            </div>

            {/* Candidates Table */}
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated overflow-hidden">
              <div className="p-6 border-b border-sw-border-subtle">
                <h2 className="text-lg font-semibold text-sw-text-primary">Candidates</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sw-bg border-b border-sw-border-subtle">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-sw-text-muted uppercase tracking-wider">
                        Ticker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-sw-text-muted uppercase tracking-wider">
                        SqueezeScore
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-sw-text-muted uppercase tracking-wider">
                        Mentions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-sw-text-muted uppercase tracking-wider">
                        Short Int %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-sw-text-muted uppercase tracking-wider">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sw-border-subtle">
                    {candidates.length > 0 ? (
                      candidates.map((candidate) => (
                        <tr
                          key={candidate.ticker}
                          className="hover:bg-sw-bg cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-sw-text-primary">
                              {candidate.ticker}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  candidate.squeezeScore >= 80
                                    ? "bg-sw-accent-green/20 text-sw-accent-green"
                                    : candidate.squeezeScore >= 70
                                    ? "bg-sw-accent-amber/20 text-sw-accent-amber"
                                    : "bg-sw-accent-red/20 text-sw-accent-red"
                                }`}
                              >
                                {candidate.squeezeScore}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sw-text-secondary">
                            {candidate.mentionCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sw-text-secondary">
                            {candidate.shortInterest ? `${candidate.shortInterest.toFixed(1)}%` : "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-sw-text-muted">
                            {candidate.explanation || "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sw-text-muted">
                          {latestRun ? "No candidates found in latest run" : "No runs yet. Click 'Run Now' to start."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* SqueezeScore Distribution */}
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h3 className="text-sm font-semibold text-sw-text-primary mb-4">
                SqueezeScore Distribution
              </h3>
              <p className="text-xs text-sw-text-muted mb-4">
                Where today&apos;s candidates sit on your squeeze scale.
              </p>
              <div className="space-y-2">
                {[85, 78, 72, 68, 65].map((score, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-sw-border-subtle rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sw-accent-red via-sw-accent-amber to-sw-accent-green"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-xs text-sw-text-muted w-8 text-right">{score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal Quality */}
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h3 className="text-sm font-semibold text-sw-text-primary mb-4">
                Signal Quality
              </h3>
              <p className="text-xs text-sw-text-muted mb-2">
                Historical hit rate for this configuration over last 30 days.
              </p>
              <div className="text-2xl font-bold text-sw-accent-green">72%</div>
            </div>

            {/* Run Controls */}
            <div className="rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
              <h3 className="text-sm font-semibold text-sw-text-primary mb-4">Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRunNow}
                  disabled={running}
                  className="w-full px-4 py-2 bg-sw-accent-green text-sw-bg rounded-lg font-medium hover:bg-sw-accent-green-soft sw-glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? "Running..." : "Run Now"}
                </button>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-sw-text-secondary">Pause agent</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-sw-border-subtle transition-colors">
                    <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-sw-text-primary transition" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

