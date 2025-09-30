#!/usr/bin/env node

/**
 * 开发模式 MCP 服务器
 * 包含详细的日志输出和错误处理
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "node:https";
import * as tar from "tar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "templates");

// 启用详细日志
const DEBUG = process.env.NODE_ENV === 'development';

function log(...args) {
  if (DEBUG) {
    console.error('[DEBUG]', ...args);
  }
}

const server = new Server(
  { name: "xagi-frontend-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// 工具定义
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('📋 收到工具列表请求');
  return {
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
              description:
                "Key-value pairs to replace in template files (format: ${{key}})",
            },
            useRemote: {
              type: "boolean",
              description:
                "Whether to download template from remote repository (default: false)",
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
        description: "List available templates from remote repository",
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
    ],
  };
});

// 工具处理
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  log(`🔧 收到工具调用: ${name}`, args);

  if (name === "create_frontend") {
    const {
      template,
      projectName,
      placeholders = {},
      useRemote = false,
    } = args as {
      template: string;
      projectName: string;
      placeholders?: Record<string, string>;
      useRemote?: boolean;
    };

    log(`📁 创建项目: ${projectName}, 模板: ${template}, 远程: ${useRemote}`);

    // Validate inputs
    if (!template || !projectName) {
      throw new Error("template and projectName are required");
    }

    const dest = path.resolve(projectName);
    if (fs.existsSync(dest)) {
      throw new Error(`Directory ${projectName} already exists`);
    }

    try {
      let src: string;

      if (useRemote) {
        log('🌐 使用远程模板');
        const tempDir = path.join(__dirname, "temp-templates");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const templateUrl = `https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz`;
        await downloadTemplate(template, tempDir, templateUrl);
        src = path.join(tempDir, template);
      } else {
        log('📂 使用本地模板');
        src = path.join(TEMPLATE_DIR, template);
        if (!fs.existsSync(src)) {
          throw new Error(`Template ${template} not found in ${TEMPLATE_DIR}`);
        }
      }

      log(`📋 复制模板从 ${src} 到 ${dest}`);

      // 1. Copy template files
      fs.cpSync(src, dest, {
        recursive: true,
        filter: (srcPath) => !srcPath.includes("node_modules"),
      });

      // 2. Replace placeholders
      log('🔄 替换占位符:', placeholders);
      replaceRecursively(dest, placeholders);

      // 3. Install dependencies
      log('📦 安装依赖...');
      await npmInstall(dest);

      log('✅ 项目创建成功');
      return {
        content: [
          {
            type: "text",
            text: `✅ ${projectName} created successfully.\n🚀  Next steps:\n   cd ${projectName}\n   Start development server using your package manager`,
          },
        ],
      };
    } catch (error) {
      log('❌ 创建项目失败:', error);
      // Clean up on failure
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      throw error;
    }
  } else if (name === "download_template") {
    const { template, templateUrl } = args as {
      template: string;
      templateUrl?: string;
    };

    if (!template) {
      throw new Error("template is required");
    }

    try {
      log(`📥 下载模板: ${template}`);
      const tempDir = path.join(__dirname, "temp-templates");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const defaultUrl =
        "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz";
      await downloadTemplate(template, tempDir, templateUrl || defaultUrl);

      log('✅ 模板下载成功');
      return {
        content: [
          {
            type: "text",
            text: `✅ Template ${template} downloaded successfully to temp-templates directory`,
          },
        ],
      };
    } catch (error) {
      log('❌ 下载模板失败:', error);
      throw new Error(
        `Failed to download template: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  } else if (name === "list_templates") {
    log('📋 列出模板');
    const templates = [
      {
        name: "react-vite",
        description: "基于 React 18 + Vite 的现代化前端项目模板",
        features: [
          "React 18",
          "Vite",
          "TypeScript",
          "ESLint",
          "Prettier",
          "热重载",
        ],
      },
      {
        name: "vue3-vite",
        description: "基于 Vue 3 + Vite 的现代化前端项目模板",
        features: [
          "Vue 3",
          "Composition API",
          "Vite",
          "TypeScript",
          "ESLint",
          "Prettier",
          "SFC",
        ],
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: `📋 可用模板列表:\n\n${templates
            .map(
              (t) =>
                `• ${t.name}\n  ${t.description}\n  特性: ${t.features.join(
                  ", "
                )}\n`
            )
            .join("\n")}`,
        },
      ],
    };
  } else {
    throw new Error(`Unknown tool: ${name}`);
  }
});

// 占位符替换函数
function replaceRecursively(dir: string, vars: Record<string, string>) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];

  for (const file of files) {
    const fullPath = path.join(dir, file as string);

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
      log(`⚠️  跳过二进制文件: ${fullPath}`);
    }
  }
}

// npm 安装函数
function npmInstall(cwd: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const { spawn } = await import("node:child_process");
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

    log(`📦 运行 npm install 在 ${cwd}`);

    const cp = spawn(npmCmd, ["install"], {
      cwd,
      stdio: "pipe", // Silent mode
      shell: true,
    });

    let errorOutput = "";

    cp.stderr?.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    });

    cp.on("close", (code: number) => {
      if (code === 0) {
        log('✅ npm install 成功');
        resolve();
      } else {
        log('❌ npm install 失败:', errorOutput);
        reject(
          new Error(`npm install failed with code ${code}: ${errorOutput}`)
        );
      }
    });

    cp.on("error", (error: Error) => {
      log('❌ npm 启动失败:', error);
      reject(new Error(`Failed to spawn npm: ${error.message}`));
    });
  });
}

// 模板下载函数
async function downloadTemplate(
  name: string,
  dest: string,
  templateUrl?: string
) {
  const TEMPLATE_URL =
    templateUrl ||
    `https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz`;

  log(`🌐 下载模板从: ${TEMPLATE_URL}`);

  return new Promise<void>((resolve, reject) => {
    const request = https.get(TEMPLATE_URL, (res) => {
      // 处理重定向
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          log(`🔄 重定向到: ${redirectUrl}`);
          // 递归调用处理重定向
          downloadTemplate(name, dest, redirectUrl).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download template: ${res.statusCode}`));
        return;
      }

      log('📦 解压模板文件...');
      res
        .pipe(
          tar.x(
            {
              strip: 1, // 调整 strip 参数，因为仓库结构可能不同
              cwd: dest,
            },
            [`xagi-frontend-templates-main/${name}`]
          )
        )
        .on("finish", () => {
          log('✅ 模板解压完成');
          resolve();
        })
        .on("error", reject);
    });

    request.on("error", reject);
  });
}

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 XAGI Frontend MCP server started (开发模式)");
}

main().catch((error) => {
  console.error("❌ 服务器启动失败:", error);
  process.exit(1);
});
