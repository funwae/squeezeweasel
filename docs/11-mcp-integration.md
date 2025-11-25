# MCP Integration Specification

## Goal

Make SqueezeWeasel a **first-class citizen in the Model Context Protocol (MCP) ecosystem**:

1. **Expose SqueezeWeasel as an MCP server**, so IDEs/assistants can:
   - List agents, templates, and runs
   - Trigger runs
   - Inspect specs, flows, and logs

2. **Consume existing MCP servers as connectors**:
   - Databases, GitHub, Slack, email, CRMs, etc.
   - Treat them as prebuilt "super-nodes" in flows

3. **Keep security and isolation sane**:
   - Principle of least privilege
   - Per-workspace MCP configs

---

## MCP Server – SqueezeWeasel

### Package Layout

Create a new package:

- `packages/mcp-server/`
  - `src/server.ts`
  - `src/handlers/agents.ts`
  - `src/handlers/runs.ts`
  - `src/handlers/templates.ts`
  - `src/context.ts`
  - `src/index.ts`

Purpose: Run as an MCP server using `@modelcontextprotocol/sdk` in Node.

### Tools (MCP)

Expose the following MCP tools:

1. `squeezeweasel.list_agents`
   - **Input**: `workspaceId?: string`
   - **Output**: array of agents (`id`, `name`, `description`, `status`)

2. `squeezeweasel.get_agent`
   - **Input**: `agentId: string`
   - **Output**: full agent metadata, active version, spec, and high-level flow JSON

3. `squeezeweasel.run_agent`
   - **Input**:
     - `agentId: string`
     - `payload?: object`
     - `triggerType?: "manual" | "webhook" | "mcp"`
   - **Output**:
     - `runId: string`
     - `status: "pending" | "running" | "success" | "failed"`
     - optional summary of result (if synchronous mode is requested)

4. `squeezeweasel.get_runs`
   - **Input**:
     - `agentId?: string`
     - `limit?: number`
   - **Output**: array of runs (id, status, timestamps, summary)

5. `squeezeweasel.get_run_trace`
   - **Input**: `runId: string`
   - **Output**: node-level trace:
     - `nodes[]` with `nodeId`, `type`, `status`, timestamps, truncated input/output

6. `squeezeweasel.install_template`
   - **Input**:
     - `workspaceId: string`
     - `templateSlug: string`
     - `config: object` (template-specific)
   - **Output**:
     - `agentId: string`
     - basic success metadata

7. `squeezeweasel.list_templates`
   - **Input**: optional filters (category, difficulty)
   - **Output**: array of templates (slug, name, description, category)

### Resources (Optional v2)

Read-only resources for:

- `squeezeweasel/specs/{agentId}`
- `squeezeweasel/flows/{agentId}`
- `squeezeweasel/templates/{templateSlug}`

These can be exposed as MCP "resources" pointing to JSON / markdown renderings.

---

## MCP Clients – Using External MCP Servers as Nodes

### Abstraction

In `apps/worker`:

- Add `connectors/mcp/`:
  - `MCPClientManager.ts`
  - `MCPNode.ts`

`MCPNode`:

- Node config:
  - `serverId` (identifier for the MCP server)
  - `toolName` (e.g., `postgres.query`, `github.search_issues`)
  - `argumentsJson` (template-able JSON using context variables)
- Execution:
  - Looks up a configured MCP server (see below)
  - Calls the specified tool
  - Returns the tool's JSON/text result to the flow context

### Workspace-Level MCP Configuration

Add `workspace_mcp_servers` table:

- `id` (UUID)
- `workspace_id` (FK)
- `name` (display name)
- `server_url` / connection metadata
- `scopes` (jsonb) – list of tools/resources allowed
- `created_at`

In UI:

- Settings → "MCP Servers"
  - Add new server by pasting MCP connection details
  - Allow admins to specify which tools are enabled

### Security Considerations

- Tools whitelisting:
  - Only allow specific tools per server, per workspace
- Input scrubbing:
  - Option in node config to redact PII before sending to MCP tool
- Logging:
  - Clearly mark MCP calls and optionally redact arguments/outputs in logs

---

## Usage Patterns

### 1. MCP-First Flow Construction

When user describes an agent in NL:

- LLM is instructed to **prefer using MCP nodes** for:
  - Databases
  - Email
  - Slack
  - GitHub
  - etc.
- Flow JSON uses a generic `MCPNode` with:
  - `serverId`
  - `toolName`
  - `argumentsTemplate`

### 2. IDE / Assistant Integration

- Users running MCP-capable assistants (Claude, ChatGPT, etc.) can:
  - Call `squeezeweasel.list_agents` to see available automations
  - Trigger `squeezeweasel.run_agent` with natural language payloads
  - Use `squeezeweasel.get_run_trace` to debug a broken flow
- This turns SqueezeWeasel into an **AI-controllable automation backend**, not just a web app.

---

## MVP Scope

For v1 MCP integration:

1. Implement MCP server with:
   - `list_agents`, `get_agent`, `run_agent`, `get_run_trace`

2. Implement `MCPNode` with:
   - 1 configured MCP server at workspace level
   - A small subset of allowed tools (e.g. Postgres, HTTP)

3. Add a simple MCP settings UI.

Later phases:

- Template install via MCP
- Multi-server management
- MCP-based marketplace integrations.

