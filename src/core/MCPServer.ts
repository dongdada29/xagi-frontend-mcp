/**
 * Core MCP Server implementation
 * MCP服务器核心实现
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TemplateService } from "../services/TemplateService.js";
import { SERVER_CONFIG, TEMPLATE_CONFIG } from "../config/index.js";
import {
  CreateFrontendArgs,
  CreateReactAppArgs,
  DownloadTemplateArgs,
  CacheInfoArgs,
  CacheClearArgs,
  CacheWarmArgs,
} from "../types/index.js";

export class MCPServer {
  private server: Server;
  private templateService: TemplateService;

  constructor(cacheDir?: string) {
    this.server = new Server(SERVER_CONFIG as any, {
      capabilities: { tools: {} },
    });
    this.templateService = new TemplateService(cacheDir);
    this.setupHandlers();
  }

  /**
   * Set up MCP request handlers
   * 设置MCP请求处理器
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, () => ({
      tools: this.getToolDefinitions(),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (req) => {
      const { name, arguments: args } = req.params;
      return await this.handleToolCall(name, args);
    });
  }

  /**
   * Get tool definitions
   * 获取工具定义
   */
  private getToolDefinitions() {
    return [
      {
        name: "create_frontend",
        description:
          "为 AI Agent 提供前端工程初始化工具。使用 React+Vite 模板在当前目录创建现代化前端项目。如果 projectName 不指定，将在当前目录创建项目",
        inputSchema: {
          type: "object",
          properties: {
            template: {
              type: "string",
              enum: TEMPLATE_CONFIG.enum,
              description: `Template to use for the project (default: ${TEMPLATE_CONFIG.default})`,
              default: TEMPLATE_CONFIG.default,
            },
            projectName: {
              type: "string",
              description:
                "Name of the project directory to create (optional, if not specified will create in current directory)",
            },
            placeholders: {
              type: "object",
              additionalProperties: true,
              description:
                "Key-value pairs to replace in template files (format: ${{key}}). Common placeholders: projectName, description, port (default varies by template)",
            },
            useRemote: {
              type: "boolean",
              description:
                "Whether to download template from remote repository (default: false)",
              default: false,
            },
            autoInstall: {
              type: "boolean",
              description:
                "Whether to automatically install dependencies (default: false)",
              default: false,
            },
          },
          required: [],
        },
      },
      {
        name: "create_react_app",
        description:
          "AI Agent 专用工具：一键创建 React+Vite 现代化项目，使用最佳默认配置和远程模板。如果 projectName 不指定，将在当前目录创建项目",
        inputSchema: {
          type: "object",
          properties: {
            projectName: {
              type: "string",
              description:
                "Project name (optional, if not specified will create in current directory)",
            },
            port: {
              type: "string",
              description: "Development server port (default: 3000)",
            },
            useRemote: {
              type: "boolean",
              description:
                "Use remote template (default: true for latest features)",
              default: true,
            },
            autoInstall: {
              type: "boolean",
              description:
                "Whether to automatically install dependencies (default: false)",
              default: false,
            },
          },
          required: [],
        },
      },
      {
        name: "download_template",
        description: "AI Agent 工具：从远程仓库下载指定模板到本地临时目录",
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
        description: "AI Agent 工具：列出所有可用的前端项目模板及其特性描述",
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
        description: "AI Agent 工具：获取模板缓存统计信息和配置状态",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "cache_clear",
        description: "AI Agent 工具：清除模板缓存（需要确认参数）",
        inputSchema: {
          type: "object",
          properties: {
            confirm: {
              type: "boolean",
              description: "Confirmation to clear cache (required)",
            },
          },
          required: ["confirm"],
        },
      },
      {
        name: "cache_warm",
        description: "AI Agent 工具：预热模板缓存，提前下载模板以确保离线可用",
        inputSchema: {
          type: "object",
          properties: {
            templates: {
              type: "array",
              items: { type: "string" },
              description: "List of template names to cache",
            },
            templateUrl: {
              type: "string",
              description: "Template repository URL (optional)",
            },
          },
        },
      },
    ];
  }

  /**
   * Handle tool calls
   * 处理工具调用
   */
  private async handleToolCall(name: string, args: any) {
    switch (name) {
      case "create_frontend":
        return await this.handleCreateFrontend(args as CreateFrontendArgs);
      case "create_react_app":
        return await this.handleCreateReactApp(args as CreateReactAppArgs);
      case "download_template":
        return await this.handleDownloadTemplate(args as DownloadTemplateArgs);
      case "list_templates":
        return await this.handleListTemplates();
      case "cache_info":
        return await this.handleCacheInfo(args as CacheInfoArgs);
      case "cache_clear":
        return await this.handleCacheClear(args as CacheClearArgs);
      case "cache_warm":
        return await this.handleCacheWarm(args as CacheWarmArgs);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async handleCreateFrontend(args: CreateFrontendArgs) {
    const {
      template = TEMPLATE_CONFIG.default,
      projectName,
      placeholders = {},
      useRemote = false,
      port,
      autoInstall = false,
    } = args;

    const result = await this.templateService.createFrontendProject(
      template,
      projectName,
      placeholders,
      useRemote,
      port,
      autoInstall
    );

    return {
      content: [{ type: "text", text: result }],
    };
  }

  private async handleCreateReactApp(args: CreateReactAppArgs) {
    const { projectName, port, useRemote = true, autoInstall = false } = args;

    // Force react-vite template with remote download
    const result = await this.templateService.createFrontendProject(
      "react-vite",
      projectName,
      {},
      useRemote,
      port,
      autoInstall
    );

    return {
      content: [{ type: "text", text: result }],
    };
  }

  private async handleDownloadTemplate(args: DownloadTemplateArgs) {
    const { template, templateUrl } = args;

    if (!template) {
      throw new Error("template is required");
    }

    try {
      await this.templateService.downloadTemplate(template, templateUrl);

      return {
        content: [
          {
            type: "text",
            text: `✅ Template ${template} downloaded successfully to temp-templates directory`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to download template: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async handleListTemplates() {
    const templates = this.templateService.getAvailableTemplates();

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
  }

  private async handleCacheInfo(args: CacheInfoArgs) {
    const cacheInfo = this.templateService.getCacheInfo();

    return {
      content: [
        {
          type: "text",
          text: `📊 Template Cache Information:

📁 Cache Directory: ${cacheInfo.cacheDir}
🎯 Cache Enabled: ${cacheInfo.enabled ? "Yes" : "No"}
⏱️  Cache Expiry: ${Math.round(cacheInfo.maxAge / (60 * 60 * 1000))} hours
💾 Max Cache Size: ${Math.round(cacheInfo.maxSize / (1024 * 1024))} MB

📈 Cache Statistics:
   Cache Hits: ${cacheInfo.stats.hitCount}
   Cache Misses: ${cacheInfo.stats.missCount}
   Hit Rate: ${
     cacheInfo.stats.hitCount + cacheInfo.stats.missCount > 0
       ? Math.round(
           (cacheInfo.stats.hitCount /
             (cacheInfo.stats.hitCount + cacheInfo.stats.missCount)) *
             100
         )
       : 0
   }%
   Total Size: ${Math.round(cacheInfo.stats.totalSize / (1024 * 1024))} MB
   Cached Templates: ${cacheInfo.stats.cachedTemplates.join(", ") || "None"}

💡 Tips:
   Cache is automatically cleaned up after 7 days
   Use cache_warm to pre-load templates
   Use cache_clear to manually clear cache`,
        },
      ],
    };
  }

  private async handleCacheClear(args: CacheClearArgs) {
    const { confirm } = args;

    if (!confirm) {
      throw new Error("Confirmation required to clear cache");
    }

    try {
      await this.templateService.clearCache();

      return {
        content: [
          {
            type: "text",
            text: "✅ Template cache cleared successfully\n\nCache will be rebuilt on next template download.",
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to clear cache: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async handleCacheWarm(args: CacheWarmArgs) {
    const { templates = TEMPLATE_CONFIG.enum, templateUrl } = args;

    try {
      await this.templateService.warmCache(templates, templateUrl);

      return {
        content: [
          {
            type: "text",
            text: `✅ Cache warming completed\n\nTemplates cached: ${templates.join(
              ", "
            )}\n\nThese templates are now available for offline use.`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to warm cache: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get the underlying MCP server instance
   * 获取底层MCP服务器实例
   */
  getServer(): Server {
    return this.server;
  }
}
