/**
 * MCP Server entry point
 */

import { MCPServer } from "./server.js";

const server = new MCPServer();

// Set context from environment variables (if provided)
const context = {
  workspaceId: process.env.MCP_WORKSPACE_ID,
  userId: process.env.MCP_USER_ID,
};

server.setContext(context);

server.start().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});

