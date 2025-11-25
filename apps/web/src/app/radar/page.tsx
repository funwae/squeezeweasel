"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoAgentId, isDemoMode } from "@/lib/demo-utils";

/**
 * Radar overview page - redirects to demo agent overview
 */
export default function RadarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const demoMode = isDemoMode();

  const redirectToDemoAgent = async () => {
    setLoading(true);
    setError(null);
    try {
      const agentId = await getDemoAgentId();
      if (agentId) {
        router.replace(`/agents/${agentId}/overview`);
      } else {
        // In demo mode, show error instead of redirecting (to avoid loop)
        if (demoMode) {
          setError("Demo agent not found. Please ensure the API is running and database is seeded.");
          setLoading(false);
        } else {
          router.replace("/");
        }
      }
    } catch (err) {
      console.error("Failed to load demo agent:", err);
      if (demoMode) {
        setError("Failed to connect to API. Please ensure the API server is running on port 4000.");
        setLoading(false);
      } else {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    redirectToDemoAgent();
  }, [router, demoMode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-sw-text-primary mb-2">Demo Not Ready</h2>
          <p className="text-sm text-sw-text-secondary mb-4">{error}</p>
          <button
            onClick={redirectToDemoAgent}
            className="px-4 py-2 bg-sw-accent-green text-sw-bg rounded-lg font-medium hover:bg-sw-accent-green-soft"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sw-text-secondary">Loading radar...</div>
    </div>
  );
}

