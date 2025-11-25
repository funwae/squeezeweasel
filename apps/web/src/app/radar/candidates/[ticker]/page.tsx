"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDemoAgentId } from "@/lib/demo-utils";

/**
 * Radar candidate detail page - redirects to demo agent candidate detail
 */
export default function RadarCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirectToDemoAgent() {
      const agentId = await getDemoAgentId();
      if (agentId) {
        router.replace(`/agents/${agentId}/candidates/${ticker}`);
      } else {
        router.replace("/radar");
      }
    }

    redirectToDemoAgent();
  }, [router, ticker]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sw-text-secondary">Loading candidate details...</div>
    </div>
  );
}

