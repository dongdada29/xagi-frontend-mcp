# XAGI Frontend MCP

🚀 **为 AI Agent 提供前端工程初始化能力的 MCP 工具**

一个专业的 Model Context Protocol (MCP) 服务器，专为 AI Agent 设计，用于快速初始化现代化前端工程项目。支持 React + Next.js、React + Vite 和 Vue3 + Vite 等主流技术栈，提供智能模板管理和自动化工程配置。

## ✨ 核心特性

- 🤖 **AI Agent 优化** - 专为 AI 对话场景设计，提供自然的工程初始化体验
- 🎯 **零依赖创建** - 无需安装 create-react-app、vue-cli 等外部 CLI 工具
- 🚀 **Next.js 默认** - 默认使用 React + Next.js + Tailwind + Radix UI 现代化栈
- 📦 **多模板支持** - 内置 react-next、react-vite、vue3-vite 三种模板
- 🌐 **远程模板** - 支持从 GitHub 仓库下载最新模板，确保技术栈更新
- 💾 **智能缓存** - 自动缓存下载的模板，重复使用提升速度
- 🔄 **占位符替换** - 自动替换模板中的项目名称、描述等变量
- 📦 **自动安装** - 自动运行 npm install 安装依赖
- 🛠️ **TypeScript 支持** - 完整的 TypeScript 类型定义和配置
- 🔧 **MCP 协议** - 与 Claude Desktop、Claude Code 完美集成
- 📁 **智能项目名** - 未指定项目名时自动使用当前目录名
- 📂 **当前目录初始化** - 支持直接在当前目录创建项目，无需指定项目名
- ⚡ **高性能** - 缓存机制带来 95%+ 性能提升
- 🏗️ **分层架构** - 清晰的代码组织，便于维护和扩展

## 🚀 快速开始

### 安装方式

#### 方式 1: NPX（推荐，无需安装）

```bash
# 直接运行，无需全局安装 (stdio 模式)
npx xagi-frontend-mcp

# 启动 HTTP 服务器模式
npx xagi-frontend-mcp --http

# 查看帮助
npx xagi-frontend-mcp --help

# 查看版本
npx xagi-frontend-mcp --version
```

#### 方式 2: 全局安装

```bash
npm install -g xagi-frontend-mcp
```

### 在 Claude Desktop 中使用

#### 在 Claude Desktop 中配置

1. 打开 Claude Desktop 设置
2. 添加 MCP 服务器配置：

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
      },
      "description": "XAGI Frontend MCP - Create standardized frontend projects from templates",
      "capabilities": {
        "tools": true,
        "resources": true,
        "prompts": true
      }
    }
  }
}
```

#### 使用全局安装

```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "xagi-frontend-mcp"
    }
  }
}
```

3. 重启 Claude Desktop
4. 在对话中使用以下命令：

### HTTP 服务器模式

除了传统的 MCP 协议模式，XAGI Frontend MCP 还支持 HTTP 服务器模式，便于 Web 界面和 API 集成：

```bash
# 启动 HTTP 服务器 (默认端口 3000)
npx xagi-frontend-mcp --http

# 开发模式 + HTTP 服务器
npx xagi-frontend-mcp --http --dev
```

#### HTTP API 端点

启动 HTTP 服务器后，可以通过以下方式访问：

- **服务器地址**: `http://localhost:3000`
- **MCP 协议端点**: `/mcp`
- **健康检查**: `/health`

### 在 Claude Code 中使用

#### 配置 Claude Code

在 Claude Code 中配置 MCP 服务器：

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
      },
      "description": "XAGI Frontend MCP - Create standardized frontend projects from templates",
      "capabilities": {
        "tools": true,
        "resources": true,
        "prompts": true
      }
    }
  }
}
```

#### 命令行使用

```bash
# 在 Claude Code 中直接使用（推荐配置）
claude mcp add xagi-frontend -- npx xagi-frontend-mcp@latest --mcp

# 或者使用全局安装
claude mcp add xagi-frontend -- xagi-frontend-mcp
```

### 🤖 AI Agent 使用场景

#### 对话示例 1: 创建 React Next.js 项目

```
用户: 我需要创建一个现代化的 React 项目，最好使用 Next.js

Claude: 我来帮您创建一个现代化的 React Next.js 项目。我将使用默认的 react-next 模板，它包含了 Next.js 14、Tailwind CSS 和 Radix UI。

[调用 create_react_app 工具，参数：
- projectName: "react-project"
- useRemote: true
]

✅ 项目创建成功！现代化 React Next.js 项目已创建在 react-project 目录中。

🚀 下一步：
   cd react-project
   npm run dev

项目特性：
- React 18 + Next.js 14
- TypeScript 支持
- Tailwind CSS 样式系统
- Radix UI 组件库
- ESLint + Prettier
- 现代化构建工具链
- 智能缓存系统
```

#### 对话示例 2: 在当前目录初始化（无项目名）

```
用户: 在当前目录创建一个 Vue 项目

Claude: 我将在当前目录创建一个 Vue 3 项目。由于您没有指定项目名，我将直接在当前目录初始化项目。

[调用 create_frontend 工具，参数：
- template: "vue3-vite"
- useRemote: true
- projectName: undefined (不指定，使用当前目录)
]

✅ Vue 3 项目创建成功！项目已初始化在当前目录。

🚀 下一步：
   npm install
   npm run dev

项目特性：
- Vue 3 + Composition API
- Vite 构建工具
- TypeScript 支持
- 单文件组件 (SFC)
- 热重载开发服务器
- ESLint + Prettier
```

**功能说明**: 当不指定 `projectName` 时，系统会自动使用当前工作目录作为项目根目录，所有模板文件会直接复制到当前目录中。

#### 对话示例 3: 智能项目配置

```
用户: 创建一个企业级前端项目，需要包含：
- React 框架
- TypeScript 支持
- 现代化 UI 组件库
- 代码质量工具
- 端口号 8080

Claude: 根据您的需求，我推荐使用 React + Next.js 模板，它完全符合企业级项目的要求。我将为您创建项目并配置端口为 8080。

[调用 create_frontend 工具，参数：
- template: "react-next"
- projectName: "enterprise-app"
- useRemote: true
- placeholders: {
    "port": "8080",
    "description": "企业级前端应用"
  }
]

✅ 企业级前端项目创建成功！

项目已配置：
- React 18 + Next.js 14
- TypeScript 类型安全
- Tailwind CSS + Radix UI
- ESLint + Prettier 代码质量
- 开发服务器端口: 8080
```

### 可用工具

#### 1. create_react_app（推荐）
```
一键创建 React + Next.js 应用，使用最佳默认配置
- 默认使用 react-next 模板
- 自动配置远程模板下载
- 智能项目命名
- 自动依赖安装
```

#### 2. create_frontend（通用）
```
创建前端项目，支持多种模板和自定义配置
- 支持所有可用模板
- 自定义占位符替换
- 灵活的端口配置
- 本地/远程模板选择
- 支持当前目录初始化（不指定 projectName）
```

#### 3. list_templates
```
查看所有可用的模板及其特性
```

#### 4. download_template
```
下载指定模板到本地临时目录
```

#### 5. cache_info
```
查看缓存统计信息和配置
```

#### 6. cache_warm
```
预热缓存，提前下载模板
```

#### 7. cache_clear
```
清除缓存（需要确认）
```

## 💡 使用示例

### 命令行使用示例

```bash
# 1. 使用 NPX 直接运行 (stdio 模式)
npx xagi-frontend-mcp

# 2. 使用 NPX 运行最新版本 (推荐)
npx xagi-frontend-mcp@latest

# 3. 启动 HTTP 服务器模式
npx xagi-frontend-mcp --http

# 4. 查看帮助信息
npx xagi-frontend-mcp --help

# 5. 开发模式（详细日志）
npx xagi-frontend-mcp --dev

# 6. 全局安装后使用
npm install -g xagi-frontend-mcp
xagi-frontend-mcp --version
```

### AI Agent 集成示例

```javascript
// 在 AI Agent 中使用 MCP 工具
const frontendTools = {
  create_react_app: {
    description: "创建 React + Next.js 项目",
    parameters: {
      type: "object",
      properties: {
        projectName: { type: "string", description: "项目名称" },
        port: { type: "string", description: "开发服务器端口" },
        useRemote: { type: "boolean", description: "使用远程模板" }
      }
    }
  },

  create_frontend: {
    description: "创建前端项目",
    parameters: {
      type: "object",
      properties: {
        template: {
          type: "string",
          enum: ["react-next", "react-vite", "vue3-vite"],
          description: "模板类型"
        },
        projectName: { type: "string", description: "项目名称" },
        placeholders: { type: "object", description: "占位符配置" }
      }
    }
  }
};
```

## 📋 支持的模板

### 🚀 React + Next.js（默认）
- **框架**: React 18 + Next.js 14
- **UI 库**: Tailwind CSS + Radix UI
- **语言**: TypeScript
- **特性**: App Router、服务端渲染、API 路由、图像优化
- **默认端口**: 3000
- **适用场景**: 企业级应用、内容管理系统、电商网站

### ⚡ React + Vite
- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **特性**: 热重载、ESLint、Prettier、快速构建
- **默认端口**: 5173
- **适用场景**: 单页应用、快速原型、中小型项目

### 🟢 Vue3 + Vite
- **框架**: Vue 3
- **API**: Composition API
- **构建工具**: Vite
- **语言**: TypeScript
- **特性**: SFC、热重载、ESLint、Prettier、Pinia
- **默认端口**: 5173
- **适用场景**: Vue 3 应用、渐进式 Web 应用

## 🔧 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/dongdada29/xagi-frontend-mcp.git
cd xagi-frontend-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式（详细日志）
npm run dev

# 测试 MCP 服务器
npm test

# 测试 CLI 界面
node bin/cli.js --help
node bin/cli.js --version

# 测试 HTTP 服务器
node bin/cli.js --http
```

### 调试工具

#### 1. CLI 调试
```bash
# 查看帮助信息
node bin/cli.js --help

# 开发模式启动（详细日志）
node bin/cli.js --dev

# 查看版本信息
node bin/cli.js --version

# 测试 HTTP 服务器模式
node bin/cli.js --http
```

#### 2. MCP 服务器调试
```bash
# 使用调试脚本
node debug-mcp.js

# 直接测试 MCP 协议
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

## 📁 项目结构

```
xagi-frontend-mcp/
├── src/
│   ├── config/           # 配置层
│   │   └── index.ts      # 统一配置管理
│   ├── types/            # 类型定义层
│   │   └── index.ts      # TypeScript 类型定义
│   ├── utils/            # 工具层
│   │   ├── PlaceholderReplacer.ts  # 占位符替换
│   │   └── FileManager.ts          # 文件管理
│   ├── services/         # 服务层
│   │   ├── TemplateService.ts     # 模板管理服务
│   │   └── NpmInstaller.ts        # npm 安装服务
│   ├── core/             # 核心层
│   │   └── MCPServer.ts          # MCP 服务器核心
│   ├── cache/            # 缓存系统
│   │   └── SimpleTemplateCache.ts # 模板缓存
│   └── index.ts          # 主入口点
├── bin/
│   └── cli.js            # CLI 命令行界面
├── docs/                # 文档目录
│   ├── ARCHITECTURE.md  # 架构设计文档
│   ├── API.md           # API 文档
│   └── TEMPLATES.md     # 模板指南
├── dist/                # 构建输出
├── http-server.js       # HTTP 服务器模式
├── package.json
└── README.md
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [Claude Code](https://claude.ai/code)
- [模板仓库](https://github.com/dongdada29/xagi-frontend-templates)
- [架构设计](./docs/ARCHITECTURE.md)
- [API 文档](./docs/API.md)

## 💾 智能缓存系统

XAGI Frontend MCP 内置智能缓存系统，专为 AI Agent 优化，显著提升模板下载速度和离线使用体验。

### 🎯 缓存特性

- **自动缓存**: 下载的模板自动保存到本地
- **智能更新**: 基于时间自动检测模板更新
- **离线使用**: 缓存的模板可在离线状态下使用
- **性能提升**: 重复下载速度提升 95%+
- **自动清理**: 超过 7 天的缓存自动清理

### 📁 缓存位置

缓存文件存储在系统标准缓存目录中：

- **macOS**: `~/Library/Caches/xagi-frontend-mcp/`
- **Linux**: `~/.cache/xagi-frontend-mcp/`
- **Windows**: `%LOCALAPPDATA%\xagi-frontend-mcp\cache\`

### 🛠️ 缓存管理

AI Agent 可以通过以下工具管理缓存：

- **cache_info**: 查看缓存统计和配置
- **cache_warm**: 预热缓存，确保离线可用
- **cache_clear**: 清除缓存（需要确认）

## 🔧 故障排除

### 常见问题

#### 1. NPX 命令找不到
```bash
# 确保 Node.js 版本 >= 18
node --version

# 更新 npm 到最新版本
npm install -g npm@latest

# 清除 npm 缓存
npm cache clean --force
```

#### 2. MCP 服务器无法启动
```bash
# 检查依赖是否正确安装
npm install

# 重新构建项目
npm run build

# 使用开发模式查看详细错误
node bin/cli.js --dev
```

#### 3. 模板下载失败
```bash
# 检查网络连接
ping github.com

# 使用本地模板（如果可用）
# 在工具调用中设置 useRemote: false
```

### 调试模式

启用详细日志来诊断问题：

```bash
# CLI 调试模式
node bin/cli.js --dev

# MCP 协议测试
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

## 📞 支持

如果您遇到任何问题或有建议，请：

1. 查看 [Issues](https://github.com/dongdada29/xagi-frontend-mcp/issues)
2. 创建新的 Issue（请包含错误日志）
3. 查看故障排除部分
4. 联系维护者

### 报告问题

请在创建 Issue 时包含：
- 操作系统和版本
- Node.js 版本
- 错误信息或日志
- 复现步骤
- 期望的行为

---

⭐ 如果这个项目对您有帮助，请给它一个星标！