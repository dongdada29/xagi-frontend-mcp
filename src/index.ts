/**
 * Main MCP Server entry point (stdio mode)
 * MCP服务器主入口点（stdio模式）
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCPServer } from "./core/MCPServer.js";

// Start the server
async function main() {
  try {
    const mcpServer = new MCPServer();
    const server = mcpServer.getServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
    console.error("XAGI Frontend MCP server started");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});