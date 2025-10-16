# XAGI Frontend MCP

🚀 **为 AI Agent 提供前端工程初始化能力的 MCP 工具**

专业的 Model Context Protocol (MCP) 服务器，专为 AI Agent 设计，用于快速初始化现代化前端工程项目。

## ✨ 核心特性

- 🤖 **AI Agent 优化** - 专为 AI 对话场景设计
- 🚀 **Vite 默认** - 默认使用 React + Vite + TypeScript
- 📦 **多模板支持** - react-next、react-vite、vue3-vite 三种模板
- 🌐 **远程模板** - 从 GitHub 仓库下载最新模板
- 💾 **智能缓存** - 自动缓存，95%+ 性能提升
- 📦 **自动安装** - 可选自动依赖安装
- 📁 **当前目录初始化** - 支持不指定项目名直接在当前目录创建
- 🛠️ **TypeScript 支持** - 完整类型定义和配置

## 🚀 快速开始

### 安装

```bash
# NPX 推荐（无需安装）
npx xagi-frontend-mcp

# 全局安装
npm install -g xagi-frontend-mcp
```

### Claude Desktop 配置

```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "npx",
      "args": [
        "xagi-frontend-mcp@latest",
        "--mcp"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Claude Code 配置

```bash
claude mcp add xagi-frontend-template --env NODE_ENV=production -- npx xagi-frontend-mcp@latest --mcp
```

## 🤖 AI Agent 使用示例

### 创建 React 项目（当前目录）

```
用户: 在当前目录创建一个 React 项目

Claude: 我将在当前目录创建一个 React Vite 项目。

[调用 create_react_app 工具]

✅ 项目创建成功！
🚀 下一步：
   使用包管理器安装依赖
   启动开发服务器
```

### 创建 Vue 项目（指定目录）

```
用户: 创建一个名为 my-vue-app 的 Vue 项目

Claude: 我将为您创建一个 Vue 3 项目。

[调用 create_frontend 工具，参数：template: "vue3-vite", projectName: "my-vue-app"]

✅ 项目创建成功！
🚀 下一步：
   cd my-vue-app
   使用包管理器安装依赖
   启动开发服务器
```

## 📋 可用工具

### 1. create_react_app（推荐）
一键创建 React + Next.js 项目，使用最佳默认配置

### 2. create_frontend（通用）
创建前端项目，支持多种模板和自定义配置

### 3. list_templates
查看所有可用模板及其特性

### 4. cache_info / cache_clear / cache_warm
缓存管理工具

## 📦 支持的模板

### 🚀 React + Vite（默认）
- React 18 + Vite + TypeScript
- 默认端口: 3000

### ⚡ React + Next.js
- React 18 + Next.js 14 + TypeScript + Tailwind CSS + Radix UI
- 默认端口: 3000

### 🟢 Vue3 + Vite
- Vue 3 + Composition API + Vite + TypeScript
- 默认端口: 4000

## 🔧 开发

```bash
# 克隆仓库
git clone https://github.com/dongdada29/xagi-frontend-mcp.git
cd xagi-frontend-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式
npm run dev
```

## 📄 许可证

MIT License

## 🔗 相关链接

- [GitHub](https://github.com/dongdada29/xagi-frontend-mcp)
- [模板仓库](https://github.com/dongdada29/xagi-frontend-templates)
- [MCP 协议](https://modelcontextprotocol.io/)