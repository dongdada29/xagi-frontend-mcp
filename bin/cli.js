#!/usr/bin/env node

/**
 * XAGI Frontend MCP CLI
 * 提供命令行界面和帮助信息
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 显示帮助信息
function showHelp() {
  console.log(`
🚀 XAGI Frontend MCP Server

一个强大的 Model Context Protocol (MCP) 服务器，用于快速创建前端项目。

用法:
  xagi-frontend-mcp [选项]

选项:
  -h, --help     显示帮助信息
  -v, --version  显示版本号
  --dev          开发模式（详细日志）

示例:
  # 启动 MCP 服务器
  xagi-frontend-mcp

  # 开发模式
  xagi-frontend-mcp --dev

  # 在 Claude Desktop 中配置
  {
    "mcpServers": {
      "xagi-frontend-mcp": {
        "command": "npx",
        "args": ["xagi-frontend-mcp"]
      }
    }
  }

功能:
  📋 列出可用模板
  🎯 创建前端项目（React + Vite, Vue3 + Vite）
  🌐 从远程仓库下载模板
  🔄 自动替换占位符
  📦 自动安装依赖

更多信息: https://github.com/dongdada29/xagi-frontend-mcp
`);
}

// 显示版本信息
async function showVersion() {
  const fs = await import('fs');
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
  );
  console.log(`xagi-frontend-mcp v${packageJson.version}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  // 处理命令行参数
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }
  
  if (args.includes('-v') || args.includes('--version')) {
    showVersion().then(() => process.exit(0));
    return;
  }
  
  // 检查是否是开发模式
  const isDev = args.includes('--dev');
  
  // 启动 MCP 服务器
  const serverPath = path.join(__dirname, '../dist/index.js');
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production'
    }
  });
  
  // 处理进程退出
  server.on('close', (code) => {
    process.exit(code);
  });
  
  server.on('error', (error) => {
    console.error('❌ 启动 MCP 服务器失败:', error.message);
    process.exit(1);
  });
  
  // 处理中断信号
  process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭 MCP 服务器...');
    server.kill();
    process.exit(0);
  });
}

main();
