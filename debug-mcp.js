#!/usr/bin/env node

/**
 * MCP 调试脚本
 * 用于测试 MCP 服务器的各种功能
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 启动 MCP 服务器
const server = spawn("node", [path.join(__dirname, "dist/index.js")], {
  stdio: ["pipe", "pipe", "pipe"],
});

let requestId = 1;

// 发送 MCP 请求的辅助函数
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: "2.0",
    id: requestId++,
    method: method,
    params: params,
  };

  console.log(`\n📤 发送请求: ${method}`);
  console.log(JSON.stringify(request, null, 2));

  server.stdin.write(JSON.stringify(request) + "\n");
}

// 监听服务器响应
server.stdout.on("data", (data) => {
  const response = data.toString().trim();
  if (response) {
    console.log("\n📥 收到响应:");
    try {
      const parsed = JSON.parse(response);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(response);
    }
  }
});

// 监听服务器错误
server.stderr.on("data", (data) => {
  console.log("\n❌ 服务器错误:");
  console.log(data.toString());
});

// 监听服务器退出
server.on("close", (code) => {
  console.log(`\n🔚 服务器退出，代码: ${code}`);
  process.exit(code);
});

// 等待服务器启动
setTimeout(() => {
  console.log("🚀 开始 MCP 调试测试...\n");

  // 测试 1: 列出工具
  sendRequest("tools/list");

  setTimeout(() => {
    // 测试 2: 列出模板
    sendRequest("tools/call", {
      name: "list_templates",
      arguments: {},
    });
  }, 1000);

  setTimeout(() => {
    // 测试 3: 下载模板
    sendRequest("tools/call", {
      name: "download_template",
      arguments: {
        template: "react-vite",
      },
    });
  }, 2000);

  setTimeout(() => {
    // 测试 4: 创建项目（使用本地模板）
    sendRequest("tools/call", {
      name: "create_frontend",
      arguments: {
        template: "react-vite",
        projectName: "debug-test-project",
        useRemote: false,
        placeholders: {
          projectName: "Debug Test Project",
          description: "A project created for debugging",
        },
      },
    });
  }, 3000);

  setTimeout(() => {
    // 测试 5: 创建项目（使用远程模板）
    sendRequest("tools/call", {
      name: "create_frontend",
      arguments: {
        template: "react-vite",
        projectName: "debug-remote-project",
        useRemote: true,
        placeholders: {
          projectName: "Debug Remote Project",
          description: "A project created from remote template",
        },
      },
    });
  }, 4000);

  // 10秒后关闭服务器
  setTimeout(() => {
    console.log("\n⏰ 测试完成，关闭服务器...");
    server.kill();
  }, 10000);
}, 1000);

// 处理进程退出
process.on("SIGINT", () => {
  console.log("\n🛑 收到中断信号，关闭服务器...");
  server.kill();
  process.exit(0);
});
