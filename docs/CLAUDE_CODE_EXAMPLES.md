# Claude Code 使用示例

## 在当前目录初始化项目（不指定项目名）

### 场景描述
当您在 Claude Code 中想要在当前目录直接初始化一个前端项目时，可以不指定 `projectName` 参数。

### 使用方法

#### 方法 1: 使用 create_frontend 工具

```
用户: 我在当前目录想创建一个 React Next.js 项目

Claude: 我将在当前目录创建一个 React Next.js 项目。由于您没有指定项目名，所有项目文件会直接创建在当前目录中。

[调用 create_frontend 工具，参数：
- template: "react-next"
- useRemote: true
- projectName: 不指定（自动使用当前目录）
]

✅ React Next.js 项目创建成功！项目文件已直接创建在当前目录。

🚀 下一步：
   npm install
   npm run dev
```

#### 方法 2: 使用 create_react_app 工具

```
用户: 在当前目录创建一个 React 项目

Claude: 我将在当前目录创建一个 React 项目，使用默认的 Next.js 模板。

[调用 create_react_app 工具，参数：
- useRemote: true
- projectName: 不指定（自动使用当前目录）
]

✅ React 项目创建成功！项目文件已直接创建在当前目录。

🚀 下一步：
   npm install
   npm run dev
```

### 技术实现说明

#### 核心代码位置
- **主要逻辑**: `src/services/TemplateService.ts:46-95`
- **目录验证**: `src/utils/FileManager.ts:46-64`
- **文件复制**: `src/utils/FileManager.ts:80-110`

#### 实现原理

1. **目录验证**:
   ```typescript
   // 当 projectName 为 undefined 时，使用当前工作目录
   const targetDir = projectName ? path.resolve(projectName) : process.cwd();
   ```

2. **文件复制策略**:
   ```typescript
   // 当 projectName 不指定时，复制文件到当前目录而不是创建子目录
   if (projectName) {
     // 创建子目录模式
     fs.cpSync(sourceDir, targetDir, { recursive: true });
   } else {
     // 当前目录模式：逐个复制文件
     const templateFiles = fs.readdirSync(actualTemplateDir);
     for (const file of templateFiles) {
       const srcPath = path.join(actualTemplateDir, file);
       const destPath = path.join(targetDir, file);
       // 复制逻辑...
     }
   }
   ```

3. **安全性检查**:
   - 检查当前目录是否为空
   - 如果不为空，会提示错误或要求确认
   - 防止意外覆盖现有文件

### 使用注意事项

#### 优点
- **快速开始**: 无需创建新目录，直接在当前位置开始
- **灵活**: 适用于任何空目录
- **直观**: 符合"在这里创建项目"的自然期望

#### 前提条件
- 当前目录必须为空
- 或者当前目录只包含允许的隐藏文件（如 .git）
- 建议在专门的项目目录中使用

#### 错误处理
如果当前目录不为空，系统会返回错误：
```
"Current directory is not empty. Please specify a project name or use an empty directory."
```

### 最佳实践

#### 推荐工作流程
1. 创建一个新的空目录：`mkdir my-new-project`
2. 进入该目录：`cd my-new-project`
3. 在 Claude Code 中请求创建项目（不指定项目名）
4. 项目文件直接创建在当前目录

#### 配置示例
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
      },
      "description": "XAGI Frontend MCP - Create standardized frontend projects from templates",
      "capabilities": {
        "tools": true,
        "resources": true,
        "prompts": true
      }
    }
  }
}
```

### 支持的模板
所有模板都支持当前目录初始化：
- **react-next**: React + Next.js + TypeScript + Tailwind CSS
- **react-vite**: React + Vite + TypeScript
- **vue3-vite**: Vue 3 + Vite + TypeScript

这个功能特别适合在 Claude Code 中快速开始新项目，无需额外的目录切换步骤。