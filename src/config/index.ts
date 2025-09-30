/**
 * Core MCP Server configuration
 * 服务器核心配置
 */

export interface ServerConfig {
  name: string;
  version: string;
  capabilities: {
    tools: Record<string, any>;
  };
}

export interface TemplateConfig {
  enum: string[];
  default: string;
  remoteUrl: string;
  cacheExpiry: number; // in milliseconds
  maxSize: number; // in bytes
}

export const SERVER_CONFIG: ServerConfig = {
  name: "xagi-frontend-mcp",
  version: "1.0.7",
  capabilities: { tools: {} }
};

export const TEMPLATE_CONFIG: TemplateConfig = {
  enum: ["react-next", "react-vite", "vue3-vite"],
  default: "react-next",
  remoteUrl: "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz",
  cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 100 * 1024 * 1024 // 100MB
};

// 多包管理模板配置
// 基于 pnpm workspace 的 monorepo 架构
// 每个模板都是独立的包，位于远程仓库的根目录下
export const MONOREPO_CONFIG = {
  "enabled": true,
  "workspacePath": "packages",
  "templates": {
    "react-next": {
      "name": "react-next",
      "package": "@xagi-templates/react-next",
      "path": "packages/react-next",
      "port": "3000",
      "description": "React + Next.js + TypeScript + Tailwind CSS 模板 - 基于 Next.js 14 的全栈应用开发模板"
    },
    "react-vite": {
      "name": "react-vite",
      "package": "@xagi-templates/react-vite",
      "path": "packages/react-vite",
      "port": "3000",
      "description": "React + Vite + TypeScript 模板 - 基于 Vite 的现代化 React 开发模板"
    },
    "vue3-vite": {
      "name": "vue3-vite",
      "package": "@xagi-templates/vue3-vite",
      "path": "packages/vue3-vite",
      "port": "4000",
      "description": "Vue 3 + Vite + TypeScript 模板 - 基于 Vite 的现代化 Vue 3 开发模板"
    }
  },
  "sharedConfig": {
    "packageManager": "pnpm",
    "workspace": "pnpm-workspace.yaml",
    "commonScripts": [
      "build",
      "dev",
      "lint",
      "type-check",
      "clean"
    ]
  }
};

export const HTTP_CONFIG = {
  PORT: 3000,
  HOST: 'localhost'
};

export const DEFAULT_PORT_CONFIG = {
  "react-next": "3000",
  "react-vite": "3000",
  "vue3-vite": "4000"
} as const;