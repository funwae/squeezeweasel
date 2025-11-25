"use client";

import { useParams } from "next/navigation";
import { AgentLayout } from "@/components/AgentLayout";

export default function AgentLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const agentId = params.agentId as string;

  return <AgentLayout agentId={agentId}>{children}</AgentLayout>;
}

