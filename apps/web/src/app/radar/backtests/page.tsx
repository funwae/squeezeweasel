"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoAgentId } from "@/lib/demo-utils";

/**
 * Radar backtests page - redirects to demo agent backtests
 */
export default function RadarBacktestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirectToDemoAgent() {
      const agentId = await getDemoAgentId();
      if (agentId) {
        router.replace(`/agents/${agentId}/backtests`);
      } else {
        router.replace("/radar");
      }
    }

    redirectToDemoAgent();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sw-text-secondary">Loading backtests...</div>
    </div>
  );
}

