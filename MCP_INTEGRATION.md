# MCP Integration Guide

SqueezeWeasel is now a first-class MCP (Model Context Protocol) citizen, making it compatible with modern AI assistants and IDEs.

## What is MCP?

Model Context Protocol is an open standard for connecting AI assistants to external tools and data sources. By exposing SqueezeWeasel as an MCP server, you can:

- Control SqueezeWeasel from Claude, ChatGPT, or other MCP-compatible assistants
- Use external MCP servers (Postgres, GitHub, Slack, etc.) as connectors in your flows
- Build agent workflows that leverage the entire MCP ecosystem

## Using SqueezeWeasel as an MCP Server

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment:
   ```bash
   export DATABASE_URL="postgresql://..."
   export MCP_WORKSPACE_ID="your-workspace-id"
   export MCP_USER_ID="your-user-id"
   ```

3. Run the MCP server:
   ```bash
   pnpm --filter @squeezeweasel/mcp-server dev
   ```

### Available Tools

The MCP server exposes these tools:

- `squeezeweasel.list_agents` - List all agents
- `squeezeweasel.get_agent` - Get agent details
- `squeezeweasel.run_agent` - Trigger an agent run
- `squeezeweasel.get_runs` - List runs
- `squeezeweasel.get_run_trace` - Get detailed run trace
- `squeezeweasel.list_templates` - List templates
- `squeezeweasel.install_template` - Install a template

## Using External MCP Servers in Flows

### Adding an MCP Server

1. Go to Workspace Settings → MCP Servers
2. Add a new server:
   - Name: Display name
   - Server URL/Connection: MCP server connection details
   - Transport: stdio, sse, or http
   - Allowed Tools: Whitelist of tools this server can use

### Using MCP Nodes

In the flow builder, add an "MCP Tool" node:

- **Server ID**: Select the configured MCP server
- **Tool Name**: The MCP tool to call (e.g., `postgres.query`, `github.search_issues`)
- **Arguments**: JSON template with `{{variable}}` placeholders

Example:
```json
{
  "query": "SELECT * FROM users WHERE id = {{userId}}",
  "limit": 10
}
```

## Security

- **Tool Whitelisting**: Only tools explicitly allowed in server config can be called
- **Input Scrubbing**: Sensitive data can be redacted before sending to MCP tools
- **Workspace Isolation**: Each workspace has its own MCP server configurations

## Examples

### Example 1: Query Postgres via MCP

1. Add Postgres MCP server to workspace
2. Create flow with MCP node:
   - Server: Postgres MCP
   - Tool: `postgres.query`
   - Arguments: `{"query": "SELECT * FROM trades WHERE date = '{{today}}'"}`
3. Use results in subsequent nodes

### Example 2: Control SqueezeWeasel from Claude

In Claude Desktop, add SqueezeWeasel MCP server:

```json
{
  "mcpServers": {
    "squeezeweasel": {
      "command": "node",
      "args": ["path/to/mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "...",
        "MCP_WORKSPACE_ID": "..."
      }
    }
  }
}
```

Then ask Claude:
- "List my SqueezeWeasel agents"
- "Run the Short-Squeeze Radar agent"
- "Show me the trace for the last run"

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Directory](https://mcpevals.io)

