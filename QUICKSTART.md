# 🚀 快速开始指南

## 5 分钟快速上手

### 1. 安装和配置（2 分钟）

#### 方式 A: 使用 NPX（推荐）

```bash
# 测试 NPX 是否可用
npx xagi-frontend-mcp --help

# 测试 HTTP 服务器模式
npx xagi-frontend-mcp --http
```

#### 方式 B: 全局安装

```bash
# 全局安装
npm install -g xagi-frontend-mcp

# 验证安装
xagi-frontend-mcp --version

# 测试 HTTP 服务器
xagi-frontend-mcp --http --port 8080
```

### 2. 配置 Claude Desktop（1 分钟）

打开 Claude Desktop 设置，添加 MCP 服务器配置：

#### NPX 配置（推荐）
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

#### 全局安装配置
```json
{
  "mcpServers": {
    "xagi-frontend-mcp": {
      "command": "xagi-frontend-mcp"
    }
  }
}
```

### 3. 重启 Claude Desktop（30 秒）

保存配置后重启 Claude Desktop 应用。

### 4. 开始使用（1.5 分钟）

在 Claude Desktop 中开始对话：

```
用户: 我想创建一个 React 项目

Claude: 我来帮您创建一个 React 项目。请告诉我项目名称。

用户: 项目名称是 "my-app"

Claude: 好的！我来为您创建项目...

[自动创建项目并安装依赖]

✅ 项目创建成功！项目已保存在 my-app 目录中。

🚀 下一步：
   cd my-app
   npm run dev
```

## 🎯 常用命令

### 在 Claude Desktop 中

- **创建 React 项目**: "创建一个名为 'xxx' 的 React 项目"
- **创建 Vue 项目**: "创建一个名为 'xxx' 的 Vue3 项目"
- **使用远程模板**: "使用远程模板创建项目"
- **列出模板**: "列出所有可用的模板"

### 命令行使用

```bash
# 查看帮助
npx xagi-frontend-mcp --help

# 查看版本
npx xagi-frontend-mcp --version

# 开发模式（详细日志）
npx xagi-frontend-mcp --dev
```

## 🔧 故障排除

### 问题 1: NPX 命令找不到
```bash
# 检查 Node.js 版本（需要 >= 18）
node --version

# 更新 npm
npm install -g npm@latest
```

### 问题 2: MCP 服务器无法连接
```bash
# 检查配置是否正确
# 确保 JSON 格式正确，没有语法错误

# 重启 Claude Desktop
# 检查控制台是否有错误信息
```

### 问题 3: 项目创建失败
```bash
# 检查目标目录是否已存在
ls -la your-project-name

# 使用开发模式查看详细错误
npx xagi-frontend-mcp --dev
```

## 📚 下一步

- 查看 [完整文档](README.md)
- 了解 [支持的模板](README.md#支持的模板)
- 学习 [高级用法](README.md#使用示例)
- 查看 [故障排除](README.md#故障排除)

## 🆘 需要帮助？

- 查看 [Issues](https://github.com/dongdada29/xagi-frontend-mcp/issues)
- 创建新的 Issue
- 查看 [完整文档](README.md)

---

🎉 恭喜！您已经成功配置了 XAGI Frontend MCP 服务器！
