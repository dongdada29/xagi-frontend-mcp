# XAGI Frontend MCP - AI Agent 前端工程初始化模板指南

## 📋 为 AI Agent 优化的模板系统

### 1. react-next (默认) - AI Agent 推荐
**技术栈**: React 18 + Next.js 14 + TypeScript + Tailwind CSS + Radix UI + ESLint + Prettier

**特性**:
- ⚡ React 18 最新特性
- 🚀 Next.js 14 App Router
- 🎨 Tailwind CSS 原子化样式
- 🎯 Radix UI 无障碍组件库
- 📝 TypeScript 类型安全
- 🔍 ESLint 代码质量检查
- 💅 Prettier 代码格式化
- 🌐 内置国际化支持
- 📱 移动端适配
- 🎪 主题切换功能

**默认端口**: 3000

**AI Agent 推荐场景**:
- 🏢 企业级应用开发
- 📝 内容管理系统构建
- 🛒 电商平台前端
- 📰 博客和网站项目
- ☁️ SaaS 应用界面

**AI Agent 优势**: 完整的企业级解决方案，包含现代化的 UI 组件库和最佳实践配置

### 2. react-vite
**技术栈**: React 18 + Vite + TypeScript + ESLint + Prettier

**特性**:
- ⚡ React 18 最新特性
- 🚀 Vite 极速热重载
- 📝 TypeScript 类型安全
- 🔍 ESLint 代码质量检查
- 💅 Prettier 代码格式化
- 🎨 CSS Modules 支持
- 📦 优化的构建配置
- 🔄 环境变量管理

**默认端口**: 5173

**AI Agent 推荐场景**:
- ⚡ 单页应用 (SPA) 快速开发
- 🚀 原型和概念验证
- 📦 中小型项目构建
- 📚 React 学习和教学
- 🔧 组件库开发

**AI Agent 优势**: 极速开发体验，热重载和快速构建，适合敏捷开发

### 3. vue3-vite
**技术栈**: Vue 3 + Composition API + Vite + TypeScript + ESLint + Prettier

**特性**:
- ⚡ Vue 3 Composition API
- 🚀 Vite 极速热重载
- 📝 TypeScript 类型安全
- 🔍 ESLint 代码质量检查
- 💅 Prettier 代码格式化
- 🎨 SFC (单文件组件)
- 📦 优化的构建配置
- 🔄 Pinia 状态管理

**默认端口**: 5173

**AI Agent 推荐场景**:
- 🟢 Vue 3 应用快速开发
- 🌈 渐进式 Web 应用构建
- 🧩 Vue 组件库开发
- 📱 中小型项目
- 📖 Vue 3 学习和探索

**AI Agent 优势**: 现代化的 Vue 3 生态，Composition API 提供更好的代码组织

## 🤖 AI Agent 模板使用指南

### 智能模板选择

AI Agent 可以根据用户需求智能推荐最适合的模板：

```
用户需求 → 推荐模板
企业级应用 → react-next (默认)
快速原型 → react-vite
Vue 项目 → vue3-vite
学习目的 → react-vite 或 vue3-vite
```

### 基础用法示例

```typescript
// AI Agent 使用默认模板 (react-next)
await mcpServer.callTool("create_frontend", {
  projectName: "enterprise-app"
});

// AI Agent 根据需求选择模板
await mcpServer.callTool("create_frontend", {
  template: "react-vite",  // 快速开发
  projectName: "prototype-app"
});

// AI Agent 在当前目录初始化项目
await mcpServer.callTool("create_frontend", {
  template: "vue3-vite"
  // 不指定projectName，智能使用当前目录名
});
```

### AI Agent 专用快捷工具

```typescript
// AI Agent 一键创建 React Next.js 项目（推荐）
await mcpServer.callTool("create_react_app", {
  projectName: "awesome-project",
  port: "3000"
});
// 自动使用 react-next 模板 + 远程下载 + 最佳配置
```

### 智能配置示例

```typescript
// AI Agent 根据项目需求智能配置
await mcpServer.callTool("create_frontend", {
  template: "react-next",
  projectName: "ai-startup",
  placeholders: {
    projectName: "AI Startup Platform",
    description: "基于 AI 的创业公司平台，包含智能推荐和自动化功能",
    port: "8080",
    author: "AI Agent",
    email: "ai@example.com"
  },
  useRemote: true  // 确保使用最新模板
});
```

### 远程模板优化

```typescript
// AI Agent 推荐使用远程模板（获取最新特性）
await mcpServer.callTool("create_frontend", {
  template: "react-next",
  projectName: "modern-app",
  useRemote: true  // 推荐设置，获取最新模板
});
```

## 📝 模板占位符

所有模板支持以下占位符：

### 通用占位符
- `{{projectName}}` - 项目名称
- `{{description}}` - 项目描述
- `{{port}}` - 开发服务器端口
- `{{author}}` - 作者姓名
- `{{email}}` - 作者邮箱
- `{{year}}` - 当前年份

### 特定模板占位符
不同模板可能支持额外的占位符，具体请参考模板文档。

## 🔧 模板配置

### 默认配置
```typescript
const TEMPLATE_CONFIG = {
  enum: ["react-next", "react-vite", "vue3-vite"],
  default: "react-next",
  remoteUrl: "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz"
};

const DEFAULT_PORT_CONFIG = {
  "react-next": "3000",
  "react-vite": "5173",
  "vue3-vite": "5173"
};
```

### 自定义模板源
```typescript
// 使用自定义模板仓库
await mcpServer.callTool("download_template", {
  template: "my-custom-template",
  templateUrl: "https://github.com/username/custom-templates/archive/main.tar.gz"
});
```

## 🌐 缓存管理

### 查看缓存信息
```typescript
await mcpServer.callTool("cache_info");
```

### 清除缓存
```typescript
await mcpServer.callTool("cache_clear", {
  confirm: true
});
```

### 预热缓存
```typescript
await mcpServer.callTool("cache_warm", {
  templates: ["react-next", "react-vite"],
  templateUrl: "https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz"
});
```

## 📦 模板开发

### 模板结构
```
template-name/
├── package.json         # 项目配置
├── README.md           # 项目说明
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置 (如适用)
├── next.config.js      # Next.js配置 (如适用)
├── tailwind.config.js  # Tailwind配置 (如适用)
├── public/             # 静态资源
├── src/                # 源代码
│   ├── components/     # 组件
│   ├── pages/         # 页面
│   ├── styles/        # 样式
│   ├── utils/         # 工具
│   └── main.tsx       # 入口文件
└── .eslintrc.js       # ESLint配置
```

### 模板要求
1. **package.json**: 包含必要的依赖和脚本
2. **占位符替换**: 使用 `{{key}}` 格式的占位符
3. **TypeScript**: 推荐使用TypeScript
4. **构建工具**: 统一使用Vite或Next.js
5. **代码质量**: 包含ESLint和Prettier配置

### 贡献模板
欢迎贡献新的模板！请遵循以下步骤：

1. 创建模板目录
2. 实现模板结构和功能
3. 添加必要的占位符
4. 测试模板功能
5. 提交Pull Request

## 📚 相关文档

- [架构设计](./ARCHITECTURE.md)
- [使用指南](../README.md)
- [API文档](./API.md)
- [开发指南](./DEVELOPMENT.md)