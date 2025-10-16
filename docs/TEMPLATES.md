# 模板指南

## 支持的模板

### 1. react-vite (默认)
**技术栈**: React 18 + Vite + TypeScript

**特性**:
- Vite 快速构建
- 热重载开发体验
- TypeScript 支持
- ESLint + Prettier
- 现代化开发工具链

**默认端口**: 3000

**适用场景**: 单页应用、快速原型、中小型项目

### 2. react-next
**技术栈**: React 18 + Next.js 14 + TypeScript + Tailwind CSS + Radix UI

**特性**:
- Next.js 14 App Router
- Tailwind CSS 原子化样式
- Radix UI 无障碍组件库
- TypeScript 类型安全
- ESLint + Prettier
- 内置国际化支持
- 主题切换功能

**默认端口**: 3000

**适用场景**: 企业级应用、内容管理系统、电商平台、SaaS应用

### 3. vue3-vite
**技术栈**: Vue 3 + Composition API + Vite + TypeScript

**特性**:
- Vue 3 Composition API
- Vite 构建工具
- 单文件组件 (SFC)
- TypeScript 支持
- 快速热重载
- ESLint + Prettier

**默认端口**: 4000

**适用场景**: Vue 3 应用、渐进式Web应用

## 模板结构

所有模板都遵循以下结构：
```
project/
├── src/           # 源代码
├── public/        # 静态资源
├── package.json   # 项目配置
├── tsconfig.json   # TypeScript 配置
└── README.md      # 项目说明
```

## 自定义配置

模板支持通过 `placeholders` 参数自定义：
- `projectName`: 项目名称
- `description`: 项目描述
- `port`: 开发服务器端口
- `author`: 作者信息
- `email`: 邮箱地址

## 远程模板

所有模板都支持从远程仓库下载，确保使用最新版本：
```json
{
  "useRemote": true
}
```
