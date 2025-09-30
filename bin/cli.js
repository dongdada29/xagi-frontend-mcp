#!/usr/bin/env node

/**
 * XAGI Frontend MCP CLI
 * 提供命令行界面和帮助信息
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 显示帮助信息
function showHelp() {
  console.log(`
🚀 XAGI Frontend MCP - 为 AI Agent 提供前端工程初始化能力

专业的 Model Context Protocol (MCP) 服务器，专为 AI Agent 设计，用于快速初始化现代化前端工程项目。

用法:
  xagi-frontend-mcp [选项]

选项:
  -h, --help     显示帮助信息
  -v, --version  显示版本号
  --dev          开发模式（详细日志）
  --http         启动HTTP服务器模式

示例:
  # 启动 MCP 服务器 (stdio模式)
  xagi-frontend-mcp

  # 开发模式
  xagi-frontend-mcp --dev

  # 启动HTTP服务器
  xagi-frontend-mcp --http

  # 在 Claude Desktop 中配置
  {
    "mcpServers": {
      "xagi-frontend-mcp": {
        "command": "npx",
        "args": ["xagi-frontend-mcp"]
      }
    }
  }

AI Agent 优化特性:
  🤖 专为 AI 对话场景设计，提供自然的工程初始化体验
  🚀 默认使用 React + Next.js + Tailwind + Radix UI 现代化栈
  🎯 零依赖创建，无需安装外部 CLI 工具
  📦 支持多种模板：react-next、react-vite、vue3-vite
  🌐 智能远程模板下载和缓存管理
  🔄 自动占位符替换和依赖安装
  📁 智能项目命名（自动使用当前目录名）
  💾 95%+ 性能提升的智能缓存系统
  🏗️ 清晰的分层架构设计

更多信息: https://github.com/dongdada29/xagi-frontend-mcp
`);
}

// 显示版本信息
async function showVersion() {
  const fs = await import("fs");
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
  );
  console.log(`xagi-frontend-mcp v${packageJson.version}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  // 处理命令行参数
  if (args.includes("-h") || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  if (args.includes("-v") || args.includes("--version")) {
    showVersion().then(() => process.exit(0));
    return;
  }

  // 检查模式
  const isDev = args.includes("--dev");
  const isHttp = args.includes("--http");

  // 启动服务器
  let serverPath, serverArgs, serverEnv;

  if (isHttp) {
    // HTTP服务器模式
    serverPath = path.join(__dirname, "../http-server.js");
    serverArgs = [];
    serverEnv = {
      ...process.env,
      NODE_ENV: isDev ? "development" : "production",
    };
  } else {
    // stdio模式 (默认)
    serverPath = path.join(__dirname, "../src/index.js");
    serverArgs = [];
    serverEnv = {
      ...process.env,
      NODE_ENV: isDev ? "development" : "production",
    };
  }

  const server = spawn("node", [serverPath, ...serverArgs], {
    stdio: "inherit",
    env: serverEnv,
  });

  // 处理进程退出
  server.on("close", (code) => {
    process.exit(code);
  });

  server.on("error", (error) => {
    if (isHttp) {
      console.error("❌ 启动 HTTP 服务器失败:", error.message);
    } else {
      console.error("❌ 启动 MCP 服务器失败:", error.message);
    }
    process.exit(1);
  });

  // 处理中断信号
  process.on("SIGINT", () => {
    if (isHttp) {
      console.log("\n🛑 正在关闭 HTTP 服务器...");
    } else {
      console.log("\n🛑 正在关闭 MCP 服务器...");
    }
    server.kill();
    process.exit(0);
  });
}

main();
