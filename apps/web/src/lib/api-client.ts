/**
 * Typed API client for backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for requests with a body
    const hasBody = options.body !== undefined && options.body !== null;
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ user: any; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>("/api/auth/me");
  }

  // Agents
  async listAgents(workspaceId: string) {
    return this.request<{ agents: any[] }>(`/api/workspaces/${workspaceId}/agents`);
  }

  async getAgent(agentId: string) {
    return this.request<{ agent: any }>(`/api/agents/${agentId}`);
  }

  async createAgent(workspaceId: string, data: { name: string; description?: string }) {
    return this.request<{ agent: any }>(`/api/workspaces/${workspaceId}/agents`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAgent(agentId: string, data: { name?: string; description?: string }) {
    return this.request<{ agent: any }>(`/api/agents/${agentId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(agentId: string) {
    return this.request(`/api/agents/${agentId}`, {
      method: "DELETE",
    });
  }

  // Runs
  async triggerRun(agentId: string, payload?: Record<string, unknown>) {
    return this.request<{ run: any }>(`/api/agents/${agentId}/run`, {
      method: "POST",
      body: JSON.stringify({ triggerPayload: payload }),
    });
  }

  async listRuns(agentId: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : "";
    return this.request<{ runs: any[] }>(`/api/agents/${agentId}/runs${params}`);
  }

  async getRun(runId: string) {
    return this.request<{ run: any }>(`/api/runs/${runId}`);
  }

  async getRunNodes(runId: string) {
    return this.request<{ nodes: any[] }>(`/api/runs/${runId}/nodes`);
  }

  async getRunTrace(runId: string) {
    const [run, nodes] = await Promise.all([
      this.getRun(runId),
      this.getRunNodes(runId),
    ]);
    return {
      runId: run.run.id,
      status: run.run.status,
      startedAt: run.run.startedAt,
      finishedAt: run.run.finishedAt,
      errorMessage: run.run.errorMessage,
      nodes: nodes.nodes,
    };
  }

  // Templates
  async listTemplates() {
    return this.request<{ templates: any[] }>("/api/templates");
  }

  async getTemplate(templateId: string) {
    return this.request<{ template: any }>(`/api/templates/${templateId}`);
  }

  async installTemplate(workspaceId: string, templateId: string, name: string) {
    return this.request<{ agentId: string }>(
      `/api/workspaces/${workspaceId}/templates/${templateId}/install`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
      }
    );
  }

  // Generate flow from NL
  async generateFlow(workspaceId: string, description: string) {
    return this.request<{
      flowGraph: any;
      spec: any;
      requiredConnectors: string[];
    }>(`/api/workspaces/${workspaceId}/agents/generate-from-description`, {
      method: "POST",
      body: JSON.stringify({ description }),
    });
  }

  // Demo mode endpoints
  async getDemoAgent() {
    return this.request<{ agent: any }>("/demo/agent");
  }

  async getLatestDemoRun() {
    return this.request<{ run: any }>("/demo/runs/latest");
  }

  async triggerDemoRun() {
    return this.request<{ run: any }>("/demo/run", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }
}

export const apiClient = new ApiClient();

