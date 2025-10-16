# 快速开始

## 5 分钟快速上手

### 1. 安装（1 分钟）

#### 使用 NPX（推荐）

```bash
# 测试运行
npx xagi-frontend-mcp --help

# 启动 HTTP 服务器
npx xagi-frontend-mcp --http
```

#### 全局安装

```bash
npm install -g xagi-frontend-mcp

# 验证安装
xagi-frontend-mcp --version
```

### 2. 配置 Claude Desktop（1 分钟）

添加到 Claude Desktop 配置：

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

### 3. 配置 Claude Code（1 分钟）

```bash
claude mcp add xagi-frontend-template --env NODE_ENV=production -- npx xagi-frontend-mcp@latest --mcp
```

### 4. 使用（2 分钟）

#### 在 Claude Desktop/Code 中使用：

**创建 React 项目**
```
用户: 创建一个 React 项目

Claude: 我来帮您创建一个 React Vite 项目。

[调用 xagi_create_react_app 工具]

✅ 项目创建成功！
🚀 下一步：
   使用包管理器安装依赖
   启动开发服务器
```

**创建 Vue 项目**
```
用户: 创建一个 Vue 项目

Claude: 我来帮您创建一个 Vue 3 项目。

[调用 xagi_create_frontend 工具，参数：template: "vue3-vite"]

✅ 项目创建成功！
🚀 下一步：
   使用包管理器安装依赖
   启动开发服务器
```

### 5. 常用命令

```bash
# 查看可用模板
npx xagi-frontend-mcp --list-templates

# 查看缓存信息
npx xagi-frontend-mcp --cache-info

# 清除缓存
npx xagi-frontend-mcp --cache-clear

# 预热缓存
npx xagi-frontend-mcp --cache-warm
```

## 故障排除

### 常见问题

1. **工具不显示**
   - 重启 Claude Desktop/Code
   - 检查配置文件格式

2. **网络错误**
   - 检查网络连接
   - 使用本地模板：`useRemote: false`

3. **权限问题**
   - 检查目录权限
   - 使用管理员权限运行

## 下一步

- 阅读 [完整文档](README.md)
- 查看 [API 参考](docs/API.md)
- 了解 [模板详情](docs/TEMPLATES.md)
