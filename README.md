# XAGI Frontend MCP

🚀 **MCP server for frontend project scaffolding without external CLI**

一个强大的 Model Context Protocol (MCP) 服务器，用于快速创建前端项目，无需安装外部 CLI 工具。支持 React + Vite 和 Vue3 + Vite 模板，可以从本地或远程仓库获取模板。

## ✨ 特性

- 🎯 **零依赖创建** - 无需安装 create-react-app、vue-cli 等工具
- 📦 **多模板支持** - 内置 React + Vite 和 Vue3 + Vite 模板
- 🌐 **远程模板** - 支持从 GitHub 仓库下载最新模板
- 🔄 **占位符替换** - 自动替换模板中的项目名称等变量
- 📦 **自动安装** - 自动运行 npm install 安装依赖
- 🛠️ **TypeScript 支持** - 完整的 TypeScript 类型定义
- 🔧 **MCP 协议** - 与 Claude Desktop 完美集成

## 🚀 快速开始

### 安装方式

#### 方式 1: NPX（推荐，无需安装）

```bash
# 直接运行，无需全局安装
npx xagi-frontend-mcp

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

### 可用工具

#### 1. 列出可用模板
```
列出所有可用的前端项目模板
```

#### 2. 创建项目（本地模板）
```
创建一个名为 "my-react-app" 的 React 项目，使用本地模板
```

#### 3. 创建项目（远程模板）
```
创建一个名为 "my-vue-app" 的 Vue3 项目，使用远程模板，项目描述为 "我的 Vue 应用"
```

#### 4. 下载模板
```
下载 react-vite 模板到本地
```

## 💡 使用示例

### 在 Claude Desktop 中的完整对话示例

```
用户: 我想创建一个新的 React 项目

Claude: 我来帮您创建一个 React 项目。首先让我列出可用的模板：

[调用 list_templates 工具]

根据可用模板，我推荐使用 React + Vite 模板。请告诉我：
1. 项目名称
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
```

### 命令行使用示例

```bash
# 1. 使用 NPX 直接运行
npx xagi-frontend-mcp

# 2. 查看帮助信息
npx xagi-frontend-mcp --help

# 3. 开发模式（详细日志）
npx xagi-frontend-mcp --dev

# 4. 全局安装后使用
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
```

#### 2. MCP 服务器调试
```bash
# 使用调试脚本
node debug-mcp.js

# 直接测试 MCP 协议
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

#### 3. 开发服务器
```bash
# 启动带详细日志的开发服务器
node dev-server.js
```

## 📁 项目结构

```
xagi-frontend-mcp/
├── src/
│   └── index.ts          # 主服务器代码
├── bin/
│   └── cli.js            # CLI 命令行界面
├── templates/            # 本地模板
│   ├── react-vite/       # React 模板
│   └── vue3-vite/        # Vue3 模板
├── dist/                 # 构建输出
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