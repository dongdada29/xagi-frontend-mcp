#!/usr/bin/env node

/**
 * HTTP Server Mode for XAGI Frontend MCP
 * 提供HTTP API接口，支持端口配置
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import https from "node:https";
import * as tar from "tar";
import { SimpleTemplateCache } from "./cache/SimpleTemplateCache.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "..", "templates");
const templateCache = new SimpleTemplateCache();

// 从环境变量获取端口，设置默认值
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// 创建MCP服务器实例
const server = new Server(
  { name: "xagi-frontend-mcp-http", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// 工具定义
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_frontend",
      description: "Generate a frontend project without external CLI",
      inputSchema: {
        type: "object",
        properties: {
          template: {
            type: "string",
            enum: ["react-vite", "vue3-vite"],
            description: "Template to use for the project",
          },
          projectName: {
            type: "string",
            description: "Name of the project directory to create",
          },
          placeholders: {
            type: "object",
            additionalProperties: true,
            description: "Key-value pairs to replace in template files (format: ${{key}})",
          },
          useRemote: {
            type: "boolean",
            description: "Whether to download template from remote repository (default: false)",
          },
        },
        required: ["template", "projectName"],
      },
    },
    {
      name: "download_template",
      description: "Download a template from remote repository",
      inputSchema: {
        type: "object",
        properties: {
          template: {
            type: "string",
            description: "Template name to download",
          },
          templateUrl: {
            type: "string",
            description: "Custom template repository URL (optional)",
          },
        },
        required: ["template"],
      },
    },
    {
      name: "list_templates",
      description: "List available templates",
      inputSchema: {
        type: "object",
        properties: {
          templateUrl: {
            type: "string",
            description: "Template repository URL (optional)",
          },
        },
      },
    },
    {
      name: "cache_info",
      description: "Display cache statistics and information",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "cache_clear",
      description: "Clear all cached templates",
      inputSchema: {
        type: "object",
        properties: {
          confirm: {
            type: "boolean",
            description: "Confirmation to clear cache",
          },
        },
        required: ["confirm"],
      },
    },
    {
      name: "cache_warm",
      description: "Pre-download and cache templates",
      inputSchema: {
        type: "object",
        properties: {
          templates: {
            type: "array",
            items: { type: "string" },
            description: "List of templates to cache",
          },
          templateUrl: {
            type: "string",
            description: "Template repository URL (optional)",
          },
        },
        required: ["templates"],
      },
    },
  ],
}));

// 工具处理
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  if (name === "create_frontend") {
    const { template, projectName, placeholders = {}, useRemote = false } = args;

    // Validate inputs
    if (!template) {
      throw new Error("template is required");
    }

    // 如果没有指定项目名，使用当前目录名作为项目名
    if (!projectName) {
      projectName = path.basename(process.cwd());
    }

    const dest = path.resolve(projectName);
    if (fs.existsSync(dest) && dest !== process.cwd()) {
      throw new Error(`Directory ${projectName} already exists`);
    }

    // 如果目标是当前目录，检查是否为空
    if (dest === process.cwd()) {
      const files = fs.readdirSync(dest);
      if (files.length > 0) {
        throw new Error("Current directory is not empty. Please specify a project name or use an empty directory.");
      }
    }

    try {
      let src;

      if (useRemote) {
        // 从远程仓库下载模板（使用缓存）
        const templateUrl = `https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz`;
        const cachedTemplateDir = await templateCache.getTemplate(template, templateUrl);
        src = cachedTemplateDir;
      } else {
        // 使用本地模板
        src = path.join(TEMPLATE_DIR, template);
        if (!fs.existsSync(src)) {
          throw new Error(`Template ${template} not found in ${TEMPLATE_DIR}`);
        }
      }

      // 1. Copy template files
      fs.cpSync(src, dest, {
        recursive: true,
        filter: (srcPath) => !srcPath.includes("node_modules"),
      });

      // 2. Replace placeholders
      replaceRecursively(dest, placeholders);

      // 3. Install dependencies
      await npmInstall(dest);

      return {
        content: [
          {
            type: "text",
            text: `✅ ${projectName} created successfully.\n🚀  Next steps:\n   cd ${projectName}\n   npm run dev`,
          },
        ],
      };
    } catch (error) {
      // Clean up on failure
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      throw error;
    }
  } else if (name === "download_template") {
    const { template, templateUrl } = args;

    if (!template) {
      throw new Error("template is required");
    }

    try {
      const tempDir = path.join(__dirname, "..", "temp-templates");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const defaultUrl = "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz";
      const cachedTemplateDir = await templateCache.getTemplate(template, templateUrl || defaultUrl);

      // Copy from cache to temp directory (maintaining backward compatibility)
      const targetDir = path.join(tempDir, template);
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      fs.cpSync(cachedTemplateDir, targetDir, { recursive: true });

      return {
        content: [
          {
            type: "text",
            text: `✅ Template ${template} downloaded successfully to temp-templates directory`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to download template: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else if (name === "list_templates") {
    const templates = [
      {
        name: "react-vite",
        description: "基于 React 18 + Vite 的现代化前端项目模板",
        features: ["React 18", "Vite", "TypeScript", "ESLint", "Prettier", "热重载"],
      },
      {
        name: "vue3-vite",
        description: "基于 Vue 3 + Vite 的现代化前端项目模板",
        features: ["Vue 3", "Composition API", "Vite", "TypeScript", "ESLint", "Prettier", "SFC"],
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `📋 可用模板列表:\n\n${templates
            .map(
              (t) =>
                `• ${t.name}\n  ${t.description}\n  特性: ${t.features.join(", ")}\n`
            )
            .join("\n")}`,
        },
      ],
    };
  } else if (name === "cache_info") {
    const stats = templateCache.getCacheStats();
    const cacheDir = templateCache.getCacheDir();
    const config = templateCache.config;

    return {
      content: [
        {
          type: "text",
          text: `📊 Template Cache Information:\n\n📁 Cache Directory: ${cacheDir}\n🎯 Cache Enabled: ${config.enabled ? 'Yes' : 'No'}\n⏱️  Cache Expiry: ${config.maxAge / (60 * 60 * 1000)} hours\n💾 Max Cache Size: ${config.maxSize / (1024 * 1024)} MB\n\n📈 Cache Statistics:\n   Cache Hits: ${stats.hitCount}\n   Cache Misses: ${stats.missCount}\n   Hit Rate: ${stats.hitCount + stats.missCount > 0 ? Math.round((stats.hitCount / (stats.hitCount + stats.missCount)) * 100) : 0}%\n   Total Size: ${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB\n   Cached Templates: ${stats.cachedTemplates.join(', ') || 'None'}\n\n💡 Tips:\n   Cache is automatically cleaned up after 7 days\n   Use cache_warm to pre-load templates\n   Use cache_clear to manually clear cache`,
        },
      ],
    };
  } else if (name === "cache_clear") {
    const { confirm } = args;

    if (!confirm) {
      throw new Error("Please set confirm: true to clear cache");
    }

    await templateCache.clearCache();

    return {
      content: [
        {
          type: "text",
          text: "🧹 Cache cleared successfully",
        },
      ],
    };
  } else if (name === "cache_warm") {
    const { templates, templateUrl } = args;

    if (!templates || !Array.isArray(templates)) {
      throw new Error("templates array is required");
    }

    const defaultUrl = "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz";
    await templateCache.warmCache(templates, templateUrl || defaultUrl);

    return {
      content: [
        {
          type: "text",
          text: "🔥 Cache warming completed",
        },
      ],
    };
  } else {
    throw new Error(`Unknown tool: ${name}`);
  }
});

// 占位符替换函数
function replaceRecursively(dir: string, vars: Record<string, string>) {
  const files = fs.readdirSync(dir, { recursive: true });

  for (const file of files) {
    const fullPath = path.join(dir, file);

    // Skip directories
    if (!fs.statSync(fullPath).isFile()) continue;

    // Skip binary files (common extensions)
    const ext = path.extname(fullPath).toLowerCase();
    const binaryExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".ico",
      ".svg",
      ".pdf",
      ".zip",
      ".tar",
      ".gz",
    ];
    if (binaryExtensions.includes(ext)) continue;

    try {
      let content = fs.readFileSync(fullPath, "utf8");

      // Replace all ${{key}} patterns
      content = content.replace(/\$\{\{(\w+)\}\}/g, (match, key) => {
        return vars[key] ?? "";
      });

      fs.writeFileSync(fullPath, content, "utf8");
    } catch (error) {
      // Skip files that can't be read as text
      console.warn(`Skipping binary file: ${fullPath}`);
    }
  }
}

// npm 安装函数
function npmInstall(cwd: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const { spawn } = await import("node:child_process");
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

    const cp = spawn(npmCmd, ["install"], {
      cwd,
      stdio: "pipe", // Silent mode
      shell: true,
    });

    let errorOutput = "";

    cp.stderr?.on("data", (data) => {
      errorOutput += data.toString();
    });

    cp.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}: ${errorOutput}`));
      }
    });

    cp.on("error", (error) => {
      reject(new Error(`Failed to spawn npm: ${error.message}`));
    });
  });
}

// 启动HTTP服务器
async function main() {
  try {
    // 创建HTTP传输
    const transport = new HttpServerTransport({
      host: HOST,
      port: PORT,
    });

    await server.connect(transport);

    console.log(`🚀 XAGI Frontend MCP HTTP server started`);
    console.log(`📡 Server running at http://${HOST}:${PORT}`);
    console.log(`🛠️  Available tools: create_frontend, download_template, list_templates, cache_info, cache_clear, cache_warm`);

    // 添加优雅关闭处理
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