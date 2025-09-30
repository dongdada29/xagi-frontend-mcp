# Claude Code 使用示例

## 在当前目录初始化项目

### 使用 create_react_app（推荐）

```
用户: 在当前目录创建一个 React 项目

Claude: 我将在当前目录创建一个 React Next.js 项目。

[调用 create_react_app 工具]

✅ 项目创建成功！
🚀 下一步：
   使用包管理器安装依赖
   启动开发服务器
```

### 使用 create_frontend 工具

```
用户: 在当前目录创建一个 Vue 项目

Claude: 我将在当前目录创建一个 Vue 3 项目。

[调用 create_frontend 工具，参数：template: "vue3-vite"]

✅ Vue 3 项目创建成功！
🚀 下一步：
   使用包管理器安装依赖
   启动开发服务器
```

## 创建指定目录项目

```
用户: 创建一个名为 my-app 的 React 项目

Claude: 我将为您创建一个 React Next.js 项目。

[调用 create_frontend 工具，参数：
- template: "react-next"
- projectName: "my-app"
]

✅ 项目创建成功！
🚀 下一步：
   cd my-app
   使用包管理器安装依赖
   启动开发服务器
```

## 配置 Claude Code

```bash
claude mcp add xagi-frontend-template --env NODE_ENV=production -- npx xagi-frontend-mcp@latest --mcp
```

## 技术说明

- **不指定 projectName**: 所有文件直接创建在当前目录
- **指定 projectName**: 创建子目录并在此初始化项目
- **autoInstall 参数**: 可选自动安装依赖
- **包管理器兼容**: 支持所有主流包管理器（npm、yarn、pnpm、bun）