"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoAgentId } from "@/lib/demo-utils";

/**
 * Radar settings page - redirects to demo agent settings
 */
export default function RadarSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirectToDemoAgent() {
      const agentId = await getDemoAgentId();
      if (agentId) {
        router.replace(`/agents/${agentId}/settings`);
      } else {
        router.replace("/radar");
      }
    }

    redirectToDemoAgent();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sw-text-secondary">Loading settings...</div>
    </div>
  );
}

