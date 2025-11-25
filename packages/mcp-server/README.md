# SqueezeWeasel MCP Server

This package exposes SqueezeWeasel as a Model Context Protocol (MCP) server, allowing AI assistants and IDEs to interact with SqueezeWeasel agents, runs, and templates.

## Usage

Run the MCP server:

```bash
pnpm --filter @squeezeweasel/mcp-server dev
```

Or use it as a stdio transport in your MCP client configuration.

## Available Tools

- `squeezeweasel.list_agents` - List all agents in a workspace
- `squeezeweasel.get_agent` - Get detailed agent information
- `squeezeweasel.run_agent` - Trigger an agent run
- `squeezeweasel.get_runs` - List runs for an agent
- `squeezeweasel.get_run_trace` - Get detailed run execution trace
- `squeezeweasel.list_templates` - List available templates
- `squeezeweasel.install_template` - Install a template as a new agent

## Configuration

Set environment variables:
- `MCP_WORKSPACE_ID` - Default workspace ID
- `MCP_USER_ID` - Default user ID
- `DATABASE_URL` - PostgreSQL connection string

