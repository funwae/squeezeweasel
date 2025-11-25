"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  useEffect(() => {
    router.replace(`/agents/${agentId}/overview`);
  }, [agentId, router]);

  return null;
}

