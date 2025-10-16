#!/usr/bin/env node

/**
 * HTTP Server Mode for XAGI Frontend MCP
 * HTTP服务器模式 - 为向后兼容保留，建议使用新的分层架构
 * HTTP Server Mode for XAGI Frontend MCP - Kept for backward compatibility, recommend using new layered architecture
 */

import { MCPServer } from "./dist/core/MCPServer.js";
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import { HTTP_CONFIG } from "./dist/config/index.js";

// Start the HTTP server
async function main() {
  try {
    const mcpServer = new MCPServer();
    const server = mcpServer.getServer();
    const transport = new HttpServerTransport({
      host: HTTP_CONFIG.HOST,
      port: HTTP_CONFIG.PORT,
    });

    await server.connect(transport);

    console.log(`🚀 XAGI Frontend MCP HTTP server started`);
    console.log(`📡 Server running at http://${HTTP_CONFIG.HOST}:${HTTP_CONFIG.PORT}`);
    console.log(`🛠️  Available tools: xagi_create_frontend, xagi_create_react_app, xagi_download_template, xagi_list_templates, xagi_cache_info, xagi_cache_clear, xagi_cache_warm`);

    // Graceful shutdown handling
    process.on('SIGINT', () => {
      console.log('\n🛑 Gracefully shutting down...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start HTTP server:', error);
    process.exit(1);
  }
}

main();
