# Data Model Specification

## ER Overview (Textual)

Entities:

- User

- Workspace

- WorkspaceMember

- Agent

- AgentVersion

- FlowGraph

- Node

- Edge

- Run

- RunNode

- Secret

- ConnectorConfig

- Template

---

## Tables (First Pass)

### users

- `id` (UUID, PK)

- `email` (unique)

- `name`

- `auth_provider` (enum)

- `created_at`

- `updated_at`

### workspaces

- `id` (UUID, PK)

- `name`

- `owner_id` (FK -> users.id)

- `plan` (enum: free, pro, enterprise)

- `created_at`

- `updated_at`

### workspace_members

- `id` (UUID, PK)

- `workspace_id` (FK -> workspaces.id)

- `user_id` (FK -> users.id)

- `role` (enum: owner, admin, builder, operator, viewer)

- `created_at`

### agents

- `id` (UUID, PK)

- `workspace_id` (FK)

- `name`

- `slug`

- `description`

- `created_by` (FK -> users.id)

- `created_at`

- `updated_at`

- `active_version_id` (FK -> agent_versions.id, nullable)

### agent_versions

- `id` (UUID, PK)

- `agent_id` (FK -> agents.id)

- `version_number` (int)

- `spec_markdown` (text)

- `spec_json` (jsonb)

- `flow_graph_id` (FK -> flow_graphs.id)

- `status` (enum: draft, active, archived)

- `created_by`

- `created_at`

### flow_graphs

- `id` (UUID, PK)

- `workspace_id`

- `graph_json` (jsonb)  // nodes + edges

- `created_at`

- `updated_at`

(Optionally also normalized `nodes` and `edges` tables if needed for querying; initial implementation may keep them embedded.)

### runs

- `id` (UUID, PK)

- `agent_id`

- `agent_version_id`

- `workspace_id`

- `trigger_type` (enum: manual, schedule, webhook, other)

- `trigger_payload` (jsonb)

- `status` (enum: pending, running, success, failed, cancelled)

- `started_at`

- `finished_at`

- `error_message` (text, nullable)

### run_nodes

- `id` (UUID, PK)

- `run_id` (FK -> runs.id)

- `node_id` (string)

- `node_type`

- `status` (enum)

- `input` (jsonb)

- `output` (jsonb)

- `error_message` (text)

- `started_at`

- `finished_at`

### secrets

- `id` (UUID, PK)

- `workspace_id`

- `name`

- `encrypted_value` (bytea / text)

- `created_by`

- `created_at`

### connector_configs

- `id` (UUID, PK)

- `workspace_id`

- `connector_type` (e.g. gmail, slack, http, fintel_api)

- `config_json` (jsonb, non-secret metadata)

- `secret_id` (FK -> secrets.id)

- `created_at`

### templates

- `id` (UUID, PK)

- `name`

- `slug`

- `description`

- `category` (e.g. trading, sales, marketing)

- `author`

- `agent_version_id` (FK)

- `public` (bool)

- `created_at`

---

## Data Retention & Privacy

- Runs and logs are potentially sensitive.

- Policy knobs:

  - Max retention window (e.g. 30–90 days) for run logs on standard plans.

  - Optional "redaction" per node type (e.g., mask email addresses).

