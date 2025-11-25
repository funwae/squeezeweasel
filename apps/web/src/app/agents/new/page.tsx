"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getToken, setToken } from "@/lib/auth-client";
import { isDemoMode } from "@/lib/demo-utils";
import { DemoModeBanner } from "@/components/DemoModeBanner";

export default function NewAgentPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [flowGraph, setFlowGraph] = useState<any>(null);
  const demoMode = isDemoMode();

  useEffect(() => {
    // In demo mode, redirect to demo agent
    if (demoMode) {
      // Don't redirect immediately, show banner instead
    }
  }, [demoMode, router]);

  const handleGenerate = async () => {
    setGenerating(true);
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    // TODO: Get workspace ID from context/auth
    const workspaceId = "default-workspace-id";

    try {
      const result = await apiClient.generateFlow(workspaceId, description);
      setFlowGraph(result.flowGraph);
    } catch (err) {
      console.error("Failed to generate flow:", err);
      alert("Failed to generate flow. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-sw-text-primary">Create New Agent</h1>

      {demoMode && (
        <div className="mb-6">
          <DemoModeBanner />
          <div className="mt-4 p-4 bg-sw-accent-amber/10 border border-sw-accent-amber/30 rounded-lg">
            <h3 className="text-sm font-semibold text-sw-accent-amber mb-2">
              Labs / Preview Feature
            </h3>
            <p className="text-sm text-sw-text-secondary">
              Natural Language → Flow generation is in progress. In demo mode, this feature can
              generate variations of the SqueezeWeasel Radar flow, not arbitrary agents.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-sw-text-secondary">
            Describe what you want this agent to do:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-sw-bg border border-sw-border-subtle rounded-lg text-sw-text-primary placeholder-sw-text-muted focus:border-sw-accent-green focus:outline-none"
            rows={6}
            placeholder="e.g., Scan Reddit and Fintel for daily short-squeeze candidates and send me the top 5 by SMS."
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!description.trim() || generating || demoMode}
          className="px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover disabled:bg-sw-border-subtle disabled:text-sw-text-muted disabled:cursor-not-allowed"
        >
          {generating ? "Generating..." : demoMode ? "Limited in Demo Mode" : "Generate Flow"}
        </button>

        {demoMode && (
          <p className="text-xs text-sw-text-muted">
            NL → Flow generation is limited in demo mode. Use the Flow Builder to view and edit
            the SqueezeWeasel Radar flow.
          </p>
        )}
        {flowGraph && (
          <div className="mt-6 rounded-xl border border-sw-border-subtle bg-sw-bg-elevated p-6">
            <h2 className="text-xl font-semibold mb-2 text-sw-text-primary">
              Generated Flow
            </h2>
            <pre className="bg-sw-bg p-4 rounded-lg overflow-auto text-xs text-sw-text-secondary border border-sw-border-subtle">
              {JSON.stringify(flowGraph, null, 2)}
            </pre>
            <button
              onClick={() => {
                // TODO: Create agent with this flow
                router.push("/agents");
              }}
              className="mt-4 px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover"
            >
              Create Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

