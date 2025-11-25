/**
 * Demo mode utilities
 */

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Get demo agent ID from environment or localStorage
 */
export async function getDemoAgentId(): Promise<string | null> {
  if (!DEMO_MODE) {
    return null;
  }

  // Try environment variable first
  const envAgentId = process.env.NEXT_PUBLIC_DEMO_AGENT_ID;
  if (envAgentId) {
    return envAgentId;
  }

  // Try localStorage (set after first load)
  if (typeof window !== "undefined") {
    const storedAgentId = localStorage.getItem("demoAgentId");
    if (storedAgentId) {
      return storedAgentId;
    }

    // If not found, try to fetch it from API
    // Note: In demo mode, the API will automatically use the demo workspace
    try {
      const { apiClient } = await import("./api-client");
      // Use demo endpoint
      const response = await apiClient.getDemoAgent();
      if (response.agent) {
        const agentId = response.agent.id;
        localStorage.setItem("demoAgentId", agentId);
        return agentId;
      }
    } catch (error) {
      console.error("Failed to fetch demo agent:", error);
      // Return null to trigger redirect
    }
  }

  return null;
}

/**
 * Get demo workspace ID
 */
export function getDemoWorkspaceId(): string {
  return process.env.NEXT_PUBLIC_DEMO_WORKSPACE_ID || "demo";
}

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}

