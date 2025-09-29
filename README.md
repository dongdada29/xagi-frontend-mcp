# XAGI Frontend MCP

🚀 **MCP server for frontend project scaffolding without external CLI**

一个强大的 Model Context Protocol (MCP) 服务器，用于快速创建前端项目，无需安装外部 CLI 工具。支持 React + Vite 和 Vue3 + Vite 模板，可以从本地或远程仓库获取模板。

## ✨ 特性

- 🎯 **零依赖创建** - 无需安装 create-react-app、vue-cli 等工具
- 📦 **多模板支持** - 内置 React + Vite 和 Vue3 + Vite 模板
- 🌐 **远程模板** - 支持从 GitHub 仓库下载最新模板
- 💾 **智能缓存** - 自动缓存下载的模板，重复使用提升速度
- 🔄 **占位符替换** - 自动替换模板中的项目名称等变量
- 📦 **自动安装** - 自动运行 npm install 安装依赖
- 🛠️ **TypeScript 支持** - 完整的 TypeScript 类型定义
- 🔧 **MCP 协议** - 与 Claude Desktop 完美集成
- 🌐 **HTTP 服务器** - 支持 HTTP API 模式，便于 Web 界面集成
- 📁 **智能项目名** - 未指定项目名时自动使用当前目录名
- ⚡ **高性能** - 缓存机制带来 95%+ 性能提升

## 🚀 快速开始

### 安装方式

#### 方式 1: NPX（推荐，无需安装）

```bash
# 直接运行，无需全局安装 (stdio 模式)
npx xagi-frontend-mcp

# 启动 HTTP 服务器模式
npx xagi-frontend-mcp --http

# 指定端口和主机
npx xagi-frontend-mcp --http --port 8080 --host 0.0.0.0

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

#### 使用 NPX（推荐）

1. 打开 Claude Desktop 设置
2. 添加 MCP 服务器配置：

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

# 自定义端口和主机
npx xagi-frontend-mcp --http --port 8080 --host 0.0.0.0

# 开发模式 + HTTP 服务器
npx xagi-frontend-mcp --http --dev
```

#### HTTP API 端点

启动 HTTP 服务器后，可以通过以下方式访问：

- **服务器地址**: `http://localhost:3000` (默认)
- **MCP 协议端点**: `/mcp`
- **健康检查**: `/health`

#### 环境变量配置

```bash
# 设置端口
export PORT=8080

# 设置主机
export HOST=0.0.0.0

# 启动服务器
npx xagi-frontend-mcp --http
```

### 在 Claude Code 中使用

#### 配置 Claude Code

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

#### 命令行使用

```bash
# 在 Claude Code 中直接使用
claude mcp add xagi-frontend -- npx xagi-frontend-mcp

# 或者使用全局安装
claude mcp add xagi-frontend -- xagi-frontend-mcp
```

#### 详细使用指南

查看 [Claude Code 使用指南](CLAUDE_CODE_GUIDE.md) 了解完整的使用方法。

### 可用工具

#### 1. 列出可用模板
```
列出所有可用的前端项目模板
```

#### 2. 创建项目（本地模板）
```
创建一个名为 "my-react-app" 的 React 项目，使用本地模板
```

#### 3. 创建项目（智能项目名）
```
如果未指定项目名，将自动使用当前目录名作为项目名
```

#### 4. 创建项目（远程模板）
```
创建一个名为 "my-vue-app" 的 Vue3 项目，使用远程模板，项目描述为 "我的 Vue 应用"
```

#### 4. 下载模板
```
下载 react-vite 模板到本地
```

#### 6. 缓存管理
```
查看缓存统计信息
```

```
预热缓存（提前下载模板）
```

```
清除缓存（需要确认）
```

## 💡 使用示例

### 在 Claude Desktop 中的完整对话示例

```
用户: 我想创建一个新的 React 项目

Claude: 我来帮您创建一个 React 项目。首先让我列出可用的模板：

[调用 list_templates 工具]

根据可用模板，我推荐使用 React + Vite 模板。请告诉我：
1. 项目名称（可选，未指定将使用当前目录名）
2. 项目描述（可选）
3. 是否使用远程模板（推荐，获取最新版本）

用户: 项目名称是 "my-awesome-app"，描述是 "我的第一个 React 应用"，使用远程模板

Claude: 好的！我来为您创建项目：

[调用 create_frontend 工具，参数：
- template: "react-vite"
- projectName: "my-awesome-app"
- useRemote: true
- placeholders: {
    "projectName": "My Awesome App",
    "description": "我的第一个 React 应用"
  }
]

✅ 项目创建成功！项目已保存在 my-awesome-app 目录中。

🚀 下一步：
   cd my-awesome-app
   npm run dev

项目特性：
- React 18 + Vite
- TypeScript 支持
- 热重载开发服务器
- ESLint + Prettier
- 现代化构建工具链
- 智能缓存系统
```

### 智能项目名示例

```
用户: 在当前目录创建一个 React 项目

Claude: 我将在当前目录创建一个 React 项目。当前目录名是 "my-project"，这将被用作项目名。

[调用 create_frontend 工具，参数：
- template: "react-vite"
- useRemote: true
]

✅ 项目创建成功！React + Vite 模板已应用到当前目录。

🚀 下一步：
   npm install
   npm run dev

注意：由于目标目录不为空，系统会自动检查并确保安全创建。
```

### 命令行使用示例

```bash
# 1. 使用 NPX 直接运行 (stdio 模式)
npx xagi-frontend-mcp

# 2. 启动 HTTP 服务器模式
npx xagi-frontend-mcp --http

# 3. 指定端口和主机
npx xagi-frontend-mcp --http --port 8080 --host 0.0.0.0

# 4. 查看帮助信息
npx xagi-frontend-mcp --help

# 5. 开发模式（详细日志）
npx xagi-frontend-mcp --dev

# 6. 全局安装后使用
npm install -g xagi-frontend-mcp
xagi-frontend-mcp --version
```

## 📋 支持的模板

### React + Vite
- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **特性**: 热重载、ESLint、Prettier

### Vue3 + Vite
- **框架**: Vue 3
- **API**: Composition API
- **构建工具**: Vite
- **语言**: TypeScript
- **特性**: SFC、热重载、ESLint、Prettier

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
node bin/cli.js --http --port 3000
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

# 指定端口测试 HTTP 服务器
node bin/cli.js --http --port 8080
```

#### 2. MCP 服务器调试
```bash
# 使用调试脚本
node debug-mcp.js

# 直接测试 MCP 协议
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

#### 3. HTTP 服务器调试
```bash
# 启动 HTTP 服务器
node http-server.js

# 设置环境变量启动
PORT=8080 HOST=0.0.0.0 node http-server.js

# 开发模式 + HTTP 服务器
NODE_ENV=development node http-server.js
```

#### 4. 开发服务器
```bash
# 启动带详细日志的开发服务器
node dev-server.js
```

## 📁 项目结构

```
xagi-frontend-mcp/
├── src/
│   ├── index.ts          # 主服务器代码
│   └── cache/
│       └── SimpleTemplateCache.ts  # 缓存系统实现
├── bin/
│   └── cli.js            # CLI 命令行界面
├── templates/            # 本地模板
│   ├── react-vite/       # React 模板
│   └── vue3-vite/        # Vue3 模板
├── dist/                 # 构建输出
├── http-server.js        # HTTP 服务器模式
├── debug-mcp.js          # MCP 调试脚本
├── dev-server.js         # 开发服务器
├── claude-desktop-config.json  # Claude Desktop 配置示例
├── mcp-config.json       # MCP 配置示例
├── package.json
├── README.md
└── LICENSE
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
- [模板仓库](https://github.com/dongdada29/xagi-frontend-templates)

## 💾 缓存系统

XAGI Frontend MCP 内置智能缓存系统，显著提升模板下载速度和离线使用体验。

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

### 🛠️ 缓存管理命令

#### 查看缓存信息
```
显示缓存统计信息、位置和配置
```

#### 预热缓存
```
提前下载并缓存所有模板，确保离线可用
```

#### 清除缓存
```
清除所有缓存的模板文件（需要确认）
```

### 📊 性能对比

| 场景 | 无缓存 | 有缓存 | 提升 |
|------|--------|--------|------|
| 首次下载 | 100% | 100% | 0% |
| 重复下载 | 100% | 5% | **95%** |
| 离线使用 | 0% | 100% | **100%** |

### 🔧 缓存配置

缓存系统提供以下配置选项：

- **缓存过期时间**: 24 小时（默认）
- **最大缓存大小**: 100MB（默认）
- **自动清理**: 7 天后自动清理
- **离线模式**: 支持纯离线工作

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

# 使用本地模板
# 在 Claude Desktop 中设置 useRemote: false
```

#### 4. 项目创建失败
```bash
# 检查目标目录是否已存在
ls -la your-project-name

# 检查权限
chmod +x bin/cli.js

# 查看详细日志
node bin/cli.js --dev
```

### 调试模式

启用详细日志来诊断问题：

```bash
# CLI 调试模式
node bin/cli.js --dev

# 开发服务器模式
node dev-server.js

# MCP 协议测试
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

### 日志位置

- **CLI 输出**: 控制台标准输出
- **MCP 错误**: 控制台标准错误输出
- **开发模式**: 包含详细的调试信息

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