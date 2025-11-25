/**
 * Core agent and flow graph types
 */

export type NodeId = string;
export type EdgeId = string;
export type WorkspaceId = string;
export type AgentId = string;
export type AgentVersionId = string;
export type FlowGraphId = string;
export type RunId = string;
export type UserId = string;

/**
 * Node types in the flow graph
 */
export type NodeType =
  | "trigger.schedule"
  | "trigger.webhook"
  | "llm"
  | "transform"
  | "condition"
  | "loop"
  | "tool.http"
  | "tool.email"
  | "tool.sms"
  | "tool.db"
  | "tool.webhook"
  | "tool.reddit"
  | "tool.stock"
  | "output";

/**
 * Base node structure
 */
export interface BaseNode {
  id: NodeId;
  type: NodeType;
  label?: string;
  config?: Record<string, unknown>;
}

/**
 * Flow graph edge
 */
export interface FlowEdge {
  id: EdgeId;
  from: NodeId;
  to: NodeId;
  condition?: string; // optional condition label (e.g., "true", "false", "case:value")
}

/**
 * Flow graph structure
 */
export interface FlowGraph {
  nodes: BaseNode[];
  edges: FlowEdge[];
}

/**
 * Agent metadata
 */
export interface Agent {
  id: AgentId;
  workspaceId: WorkspaceId;
  name: string;
  slug: string;
  description?: string;
  createdById: UserId;
  activeVersionId?: AgentVersionId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agent version
 */
export interface AgentVersion {
  id: AgentVersionId;
  agentId: AgentId;
  versionNumber: number;
  specMarkdown?: string;
  specJson?: Record<string, unknown>;
  flowGraphId: FlowGraphId;
  status: "draft" | "active" | "archived";
  createdById: UserId;
  createdAt: Date;
}

/**
 * Run execution
 */
export type RunStatus = "pending" | "running" | "success" | "failed" | "cancelled";
export type TriggerType = "manual" | "schedule" | "webhook" | "other";

export interface Run {
  id: RunId;
  agentId: AgentId;
  agentVersionId: AgentVersionId;
  workspaceId: WorkspaceId;
  triggerType: TriggerType;
  triggerPayload?: Record<string, unknown>;
  status: RunStatus;
  startedAt?: Date;
  finishedAt?: Date;
  errorMessage?: string;
}

/**
 * Run node execution
 */
export type RunNodeStatus = "pending" | "running" | "success" | "failed" | "skipped";

export interface RunNode {
  id: string;
  runId: RunId;
  nodeId: NodeId;
  nodeType: NodeType;
  status: RunNodeStatus;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: Date;
  finishedAt?: Date;
}

/**
 * Workspace
 */
export interface Workspace {
  id: WorkspaceId;
  name: string;
  slug: string;
  ownerId: UserId;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User
 */
export interface User {
  id: UserId;
  email: string;
  name?: string;
  authProvider: "email" | "google" | "microsoft";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template
 */
export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  author?: string;
  agentVersionId: AgentVersionId;
  public: boolean;
  createdAt: Date;
}

/**
 * Connector config
 */
export interface ConnectorConfig {
  id: string;
  workspaceId: WorkspaceId;
  connectorType: string;
  configJson: Record<string, unknown>;
  secretId?: string;
  createdAt: Date;
}

/**
 * Secret
 */
export interface Secret {
  id: string;
  workspaceId: WorkspaceId;
  name: string;
  createdAt: Date;
}

