# 🚀 Claude Code 命令行使用指南

## 概述

本指南将详细介绍如何在 Claude Code 命令行环境中使用 XAGI Frontend MCP 服务器来初始化前端项目。

## 📋 前置要求

- Node.js >= 18
- Claude Code 环境
- 网络连接（用于下载远程模板）

## 🔧 安装和配置

### 1. 安装 MCP 服务器

#### 方式 A: 使用 NPX（推荐）

```bash
# 测试 NPX 是否可用
npx xagi-frontend-mcp --help
```

#### 方式 B: 全局安装

```bash
# 全局安装
npm install -g xagi-frontend-mcp

# 验证安装
xagi-frontend-mcp --version
```

### 2. 配置 Claude Code

在 Claude Code 中配置 MCP 服务器：

```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "npx",
      "args": ["xagi-frontend-mcp"]
    }
  }
}
```

或者使用全局安装：

```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "xagi-frontend-mcp"
    }
  }
}
```

## 🎯 基本使用

### 1. 列出可用模板

在 Claude Code 中，您可以这样询问：

```
请列出所有可用的前端项目模板
```

或者直接使用：

```
列出模板
```

**预期输出：**
```
📋 可用模板列表:

• react-vite
  基于 React 18 + Vite 的现代化前端项目模板
  特性: React 18, Vite, TypeScript, ESLint, Prettier, 热重载

• vue3-vite
  基于 Vue 3 + Vite 的现代化前端项目模板
  特性: Vue 3, Composition API, Vite, TypeScript, ESLint, Prettier, SFC
```

### 2. 创建 React 项目

#### 基本创建

```
创建一个名为 "my-react-app" 的 React 项目
```

#### 使用远程模板

```
创建一个名为 "my-react-app" 的 React 项目，使用远程模板
```

#### 带自定义配置

```
创建一个名为 "my-awesome-app" 的 React 项目，使用远程模板，项目描述为 "我的第一个 React 应用"
```

### 3. 创建 Vue3 项目

#### 基本创建

```
创建一个名为 "my-vue-app" 的 Vue3 项目
```

#### 使用远程模板

```
创建一个名为 "my-vue-app" 的 Vue3 项目，使用远程模板，项目描述为 "我的 Vue 应用"
```

### 4. 下载模板

```
下载 react-vite 模板到本地
```

## 💡 完整使用示例

### 示例 1: 创建 React 项目

**用户输入：**
```
我想创建一个新的 React 项目，项目名称是 "todo-app"，使用远程模板，项目描述是 "一个待办事项管理应用"
```

**Claude 处理过程：**
1. 调用 `list_templates` 工具确认可用模板
2. 调用 `create_frontend` 工具创建项目
3. 自动替换占位符
4. 安装依赖

**预期输出：**
```
✅ todo-app created successfully.
🚀  Next steps:
   cd todo-app
   npm run dev
```

### 示例 2: 创建 Vue3 项目

**用户输入：**
```
帮我创建一个 Vue3 项目，名称是 "blog-frontend"，使用远程模板
```

**Claude 处理过程：**
1. 确认使用 vue3-vite 模板
2. 从远程仓库下载最新模板
3. 创建项目目录
4. 替换占位符
5. 安装依赖

**预期输出：**
```
✅ blog-frontend created successfully.
🚀  Next steps:
   cd blog-frontend
   npm run dev
```

## 🔧 高级用法

### 1. 自定义占位符

```
创建一个名为 "my-project" 的 React 项目，使用以下配置：
- 项目名称: "My Awesome Project"
- 描述: "一个现代化的 Web 应用"
- 端口: 3000
```

### 2. 批量操作

```
帮我创建两个项目：
1. React 项目 "admin-panel"，使用远程模板
2. Vue3 项目 "user-dashboard"，使用远程模板
```

### 3. 模板管理

```
先下载 react-vite 模板，然后创建一个名为 "test-app" 的项目
```

## 🛠️ 故障排除

### 常见问题

#### 1. MCP 服务器未响应

**症状：** Claude 无法识别 MCP 工具

**解决方案：**
```bash
# 检查 MCP 服务器是否正常工作
npx xagi-frontend-mcp --help

# 重启 Claude Code
# 检查配置文件格式
```

#### 2. 项目创建失败

**症状：** 项目创建过程中出现错误

**解决方案：**
```bash
# 检查目标目录是否已存在
ls -la your-project-name

# 使用开发模式查看详细错误
npx xagi-frontend-mcp --dev
```

#### 3. 模板下载失败

**症状：** 远程模板下载失败

**解决方案：**
```bash
# 检查网络连接
ping github.com

# 使用本地模板
# 在请求中明确指定 useRemote: false
```

### 调试命令

```bash
# 测试 MCP 服务器
npx xagi-frontend-mcp --dev

# 直接测试 MCP 协议
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npx xagi-frontend-mcp

# 查看详细日志
npx xagi-frontend-mcp --dev
```

## 📝 最佳实践

### 1. 项目命名

- 使用小写字母和连字符
- 避免特殊字符和空格
- 保持简洁明了

**好的命名：**
- `my-react-app`
- `todo-manager`
- `blog-frontend`

**避免的命名：**
- `My React App`（包含空格）
- `my_react_app`（使用下划线）
- `myReactApp`（驼峰命名）

### 2. 模板选择

- **React + Vite**: 适合现代 React 应用
- **Vue3 + Vite**: 适合 Vue3 应用
- **远程模板**: 获取最新功能和修复

### 3. 配置建议

```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "npx",
      "args": ["xagi-frontend-mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🚀 快速参考

### 常用命令

| 功能 | 命令 |
|------|------|
| 列出模板 | "列出所有可用的模板" |
| 创建 React 项目 | "创建一个名为 'xxx' 的 React 项目" |
| 创建 Vue3 项目 | "创建一个名为 'xxx' 的 Vue3 项目" |
| 使用远程模板 | "使用远程模板创建项目" |
| 下载模板 | "下载 react-vite 模板" |

### 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| template | 模板名称 | "react-vite", "vue3-vite" |
| projectName | 项目目录名 | "my-app" |
| useRemote | 是否使用远程模板 | true, false |
| placeholders | 自定义占位符 | {"projectName": "My App"} |

## 📚 相关资源

- [完整文档](README.md)
- [快速开始](QUICKSTART.md)
- [故障排除](README.md#故障排除)
- [GitHub 仓库](https://github.com/dongdada29/xagi-frontend-mcp)

---

🎉 现在您已经掌握了在 Claude Code 中使用 XAGI Frontend MCP 的所有技巧！
