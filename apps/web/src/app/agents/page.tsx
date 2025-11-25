"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth-client";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      apiClient.setToken(token);
    }

    // TODO: Get workspace ID from context/auth
    const workspaceId = "default-workspace-id";

    apiClient
      .listAgents(workspaceId)
      .then((data) => {
        setAgents(data.agents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load agents:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-sw-text-secondary">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-sw-text-primary">Agents</h1>
      <div className="space-y-4">
        {agents.length === 0 ? (
          <p className="text-sw-text-secondary">
            No agents found. Create your first agent to get started.
          </p>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="border border-sw-border-subtle bg-sw-bg-elevated p-4 rounded-xl hover:border-sw-accent-green-soft transition-colors"
            >
              <h2 className="text-xl font-semibold text-sw-text-primary">{agent.name}</h2>
              {agent.description && (
                <p className="text-sw-text-secondary mt-1">{agent.description}</p>
              )}
              <div className="mt-3">
                <a
                  href={`/agents/${agent.id}/overview`}
                  className="text-sw-accent-green hover:text-sw-accent-green-soft transition-colors"
                >
                  View Dashboard →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-8">
        <a
          href="/agents/new"
          className="px-6 py-3 bg-sw-accent-green text-sw-bg rounded-lg font-semibold hover:bg-sw-accent-green-soft sw-glow-hover inline-block"
        >
          Create New Agent
        </a>
      </div>
    </div>
  );
}

