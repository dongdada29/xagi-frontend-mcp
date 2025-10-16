# XAGI Frontend MCP API 文档

## 可用工具

### 1. create_frontend
创建前端项目，支持多种模板和自定义配置。

**参数**:
- `template` (string, 可选): 模板名称
  - 枚举值: `["react-next", "react-vite", "vue3-vite"]`
  - 默认值: `"react-next"`
- `projectName` (string, 可选): 项目目录名称
  - 如果不指定，使用当前目录
- `placeholders` (object, 可选): 占位符替换
  - 支持: `projectName`, `description`, `port`, `author`, `email`
- `useRemote` (boolean, 可选): 是否使用远程模板
  - 默认值: `false`
- `port` (string, 可选): 开发服务器端口
  - 根据模板有不同默认值
- `autoInstall` (boolean, 可选): 是否自动安装依赖
  - 默认值: `false`

**示例**:
```json
{
  "name": "create_frontend",
  "arguments": {
    "template": "react-vite",
    "projectName": "my-app",
    "useRemote": true,
    "autoInstall": true
  }
}
```

### 2. create_react_app
一键创建 React + Vite 项目，使用最佳默认配置。

**参数**:
- `projectName` (string, 可选): 项目名称
- `port` (string, 可选): 开发服务器端口
  - 默认值: `"3000"`
- `useRemote` (boolean, 可选): 使用远程模板
  - 默认值: `true`
- `autoInstall` (boolean, 可选): 是否自动安装依赖
  - 默认值: `false`

**示例**:
```json
{
  "name": "create_react_app",
  "arguments": {
    "projectName": "my-react-app",
    "autoInstall": true
  }
}
```

### 3. list_templates
查看所有可用模板及其特性。

**参数**: 无

### 4. download_template
下载指定模板到本地临时目录。

**参数**:
- `template` (string, 必需): 模板名称
- `templateUrl` (string, 可选): 自定义模板仓库URL

### 5. cache_info
查看缓存统计信息和配置。

**参数**: 无

### 6. cache_clear
清除模板缓存（需要确认）。

**参数**:
- `confirm` (boolean, 必需): 确认清除缓存

### 7. cache_warm
预热模板缓存，提前下载模板。

**参数**:
- `templates` (array, 可选): 要缓存的模板列表
- `templateUrl` (string, 可选): 模板仓库URL

## 支持的模板

| 模板 | 描述 | 默认端口 | 特性 |
|------|------|----------|------|
| react-vite | React + Vite + TypeScript（默认） | 3000 | 快速构建，热重载 |
| react-next | React + Next.js + TypeScript + Tailwind + Radix UI | 3000 | 全栈框架，SSR，API路由 |
| vue3-vite | Vue 3 + Composition API + Vite + TypeScript | 4000 | 现代Vue开发体验 |

## 错误处理

常见错误及解决方案：

1. **权限错误**: `Permission denied`
   - 解决方案: 检查文件系统权限

2. **网络错误**: 模板下载失败
   - 解决方案: 检查网络连接，使用 `useRemote: false`

3. **依赖安装失败**: `Dependency installation failed`
   - 解决方案: 检查包管理器配置和网络

4. **模板不存在**: `Invalid template`
   - 解决方案: 使用 `list_templates` 查看可用模板