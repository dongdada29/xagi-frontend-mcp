# 🎯 Claude Code 使用示例

## 交互式对话示例

### 示例 1: 创建 React 项目

```
👤 用户: 我想创建一个新的 React 项目

🤖 Claude: 我来帮您创建一个 React 项目。首先让我列出可用的模板：

[调用 list_templates 工具]

📋 可用模板列表:

• react-vite
  基于 React 18 + Vite 的现代化前端项目模板
  特性: React 18, Vite, TypeScript, ESLint, Prettier, 热重载

• vue3-vite
  基于 Vue 3 + Vite 的现代化前端项目模板
  特性: Vue 3, Composition API, Vite, TypeScript, ESLint, Prettier, SFC

我推荐使用 React + Vite 模板。请告诉我：
1. 项目名称
2. 是否使用远程模板（推荐，获取最新版本）
3. 项目描述（可选）

👤 用户: 项目名称是 "todo-app"，使用远程模板，描述是 "一个待办事项管理应用"

🤖 Claude: 好的！我来为您创建项目：

[调用 create_frontend 工具，参数：
- template: "react-vite"
- projectName: "todo-app"
- useRemote: true
- placeholders: {
    "projectName": "Todo App",
    "description": "一个待办事项管理应用"
  }
]

✅ todo-app created successfully.
🚀  Next steps:
   cd todo-app
   npm run dev

项目特性：
- React 18 + Vite
- TypeScript 支持
- 热重载开发服务器
- ESLint + Prettier
- 现代化构建工具链

您现在可以进入项目目录开始开发了！
```

### 示例 2: 创建 Vue3 项目

```
👤 用户: 帮我创建一个 Vue3 项目，名称是 "blog-frontend"

🤖 Claude: 我来为您创建一个 Vue3 项目。让我使用 Vue3 + Vite 模板：

[调用 create_frontend 工具，参数：
- template: "vue3-vite"
- projectName: "blog-frontend"
- useRemote: true
- placeholders: {
    "projectName": "Blog Frontend"
  }
]

✅ blog-frontend created successfully.
🚀  Next steps:
   cd blog-frontend
   npm run dev

项目特性：
- Vue 3 + Composition API
- Vite 构建工具
- TypeScript 支持
- 单文件组件 (SFC)
- 热重载开发服务器

Vue3 项目已创建完成！
```

### 示例 3: 下载模板

```
👤 用户: 我想先下载 react-vite 模板看看

🤖 Claude: 好的，我来为您下载 react-vite 模板：

[调用 download_template 工具，参数：
- template: "react-vite"
]

✅ Template react-vite downloaded successfully to temp-templates directory

模板已下载到 temp-templates 目录。您可以查看模板内容，然后决定是否使用它创建项目。
```

### 示例 4: 批量创建项目

```
👤 用户: 我需要创建两个项目：一个 React 管理后台和一个 Vue3 用户界面

🤖 Claude: 我来帮您创建这两个项目。

首先创建 React 管理后台：

[调用 create_frontend 工具，参数：
- template: "react-vite"
- projectName: "admin-panel"
- useRemote: true
- placeholders: {
    "projectName": "Admin Panel"
  }
]

✅ admin-panel created successfully.

现在创建 Vue3 用户界面：

[调用 create_frontend 工具，参数：
- template: "vue3-vite"
- projectName: "user-interface"
- useRemote: true
- placeholders: {
    "projectName": "User Interface"
  }
]

✅ user-interface created successfully.

两个项目都已创建完成！

📁 项目结构：
- admin-panel/     (React 管理后台)
- user-interface/  (Vue3 用户界面)

🚀 下一步：
   cd admin-panel && npm run dev
   cd user-interface && npm run dev
```

### 示例 5: 自定义配置

```
👤 用户: 创建一个名为 "my-awesome-app" 的 React 项目，使用以下配置：
- 项目名称: "My Awesome App"
- 描述: "一个现代化的 Web 应用"
- 端口: 3000
- 使用远程模板

🤖 Claude: 我来为您创建一个自定义配置的 React 项目：

[调用 create_frontend 工具，参数：
- template: "react-vite"
- projectName: "my-awesome-app"
- useRemote: true
- placeholders: {
    "projectName": "My Awesome App",
    "description": "一个现代化的 Web 应用",
    "port": "3000"
  }
]

✅ my-awesome-app created successfully.
🚀  Next steps:
   cd my-awesome-app
   npm run dev

项目已使用您的自定义配置创建完成！
- 项目名称: My Awesome App
- 描述: 一个现代化的 Web 应用
- 开发端口: 3000
```

## 🛠️ 故障排除示例

### 问题 1: 项目已存在

```
👤 用户: 创建一个名为 "test-app" 的 React 项目

🤖 Claude: 我来为您创建项目：

[调用 create_frontend 工具]

❌ 错误: Directory test-app already exists

看起来 test-app 目录已经存在。请选择以下选项之一：
1. 使用不同的项目名称
2. 删除现有目录
3. 在现有目录中工作

您希望如何处理？
```

### 问题 2: 网络连接问题

```
👤 用户: 使用远程模板创建一个 React 项目

🤖 Claude: 我来为您创建项目：

[调用 create_frontend 工具，useRemote: true]

❌ 错误: Failed to download template: Network error

远程模板下载失败，可能是网络连接问题。我建议：
1. 使用本地模板创建项目
2. 检查网络连接后重试

您希望使用本地模板继续吗？
```

## 📝 最佳实践

### 1. 项目命名建议

```
✅ 好的命名：
- my-react-app
- todo-manager
- blog-frontend
- admin-dashboard

❌ 避免的命名：
- My React App (包含空格)
- my_react_app (使用下划线)
- myReactApp (驼峰命名)
```

### 2. 模板选择建议

```
React + Vite:
- 适合现代 React 应用
- 支持 TypeScript
- 快速热重载
- 现代化构建工具

Vue3 + Vite:
- 适合 Vue3 应用
- Composition API
- 单文件组件
- 快速开发体验
```

### 3. 配置建议

```
推荐配置：
- 使用远程模板获取最新功能
- 提供有意义的项目描述
- 使用小写字母和连字符命名
- 定期更新模板
```

---

这些示例展示了如何在 Claude Code 中有效地使用 XAGI Frontend MCP 服务器。您可以根据需要调整和扩展这些示例。
