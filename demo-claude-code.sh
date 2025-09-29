#!/bin/bash

# Claude Code 使用演示脚本
# 展示如何在 Claude Code 中使用 XAGI Frontend MCP

echo "🚀 Claude Code 使用演示"
echo "========================"

# 检查 Node.js 版本
echo "📋 检查环境..."
node --version
npm --version

echo ""
echo "🔧 配置 Claude Code MCP 服务器..."
echo ""

# 显示配置命令
echo "1. 使用 NPX 配置（推荐）："
echo "   claude mcp add xagi-frontend -- npx xagi-frontend-mcp"
echo ""

echo "2. 使用全局安装配置："
echo "   npm install -g xagi-frontend-mcp"
echo "   claude mcp add xagi-frontend -- xagi-frontend-mcp"
echo ""

echo "3. 配置文件方式："
echo "   在 Claude Code 配置中添加："
echo "   {"
echo "     \"mcpServers\": {"
echo "       \"xagi-frontend-mcp\": {"
echo "         \"command\": \"npx\","
echo "         \"args\": [\"xagi-frontend-mcp\"]"
echo "       }"
echo "     }"
echo "   }"
echo ""

echo "🎯 在 Claude Code 中的使用示例："
echo ""

echo "示例 1: 列出可用模板"
echo "用户: 列出所有可用的前端项目模板"
echo ""

echo "示例 2: 创建 React 项目"
echo "用户: 创建一个名为 'my-react-app' 的 React 项目"
echo ""

echo "示例 3: 创建 Vue3 项目"
echo "用户: 创建一个名为 'my-vue-app' 的 Vue3 项目，使用远程模板"
echo ""

echo "示例 4: 下载模板"
echo "用户: 下载 react-vite 模板到本地"
echo ""

echo "示例 5: 自定义配置"
echo "用户: 创建一个名为 'todo-app' 的 React 项目，使用远程模板，项目描述为 '待办事项管理应用'"
echo ""

echo "🔧 测试 MCP 服务器..."
echo ""

# 测试 MCP 服务器
echo "测试帮助命令："
npx xagi-frontend-mcp --help

echo ""
echo "测试版本命令："
npx xagi-frontend-mcp --version

echo ""
echo "测试 MCP 协议："
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npx xagi-frontend-mcp

echo ""
echo "✅ 演示完成！"
echo ""
echo "📚 更多信息："
echo "- 完整文档: README.md"
echo "- 快速开始: QUICKSTART.md"
echo "- Claude Code 指南: CLAUDE_CODE_GUIDE.md"
echo "- 故障排除: README.md#故障排除"
