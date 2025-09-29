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

### 安装

```bash
npm install -g xagi-frontend-mcp
```

### 在 Claude Desktop 中使用

1. 打开 Claude Desktop 设置
2. 添加 MCP 服务器配置：

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

# 开发模式
npm run dev

# 测试
npm test
```

### 调试

使用提供的调试脚本：

```bash
node debug-mcp.js
```

## 📁 项目结构

```
xagi-frontend-mcp/
├── src/
│   └── index.ts          # 主服务器代码
├── templates/            # 本地模板
│   ├── react-vite/       # React 模板
│   └── vue3-vite/        # Vue3 模板
├── dist/                 # 构建输出
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
- [模板仓库](https://github.com/dongdada29/xagi-frontend-templates)

## 📞 支持

如果您遇到任何问题或有建议，请：

1. 查看 [Issues](https://github.com/dongdada29/xagi-frontend-mcp/issues)
2. 创建新的 Issue
3. 联系维护者

---

⭐ 如果这个项目对您有帮助，请给它一个星标！