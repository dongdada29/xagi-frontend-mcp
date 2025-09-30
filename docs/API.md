# XAGI Frontend MCP - AI Agent 前端工程初始化 API 文档

## 🛠️ 为 AI Agent 优化的 MCP 工具集

### 1. create_frontend - AI Agent 前端工程初始化工具
专为 AI Agent 设计的前端项目创建工具，支持多种模板和智能配置。

**参数**:
- `template` (string, 可选): 模板名称
  - 枚举值: `["react-next", "react-vite", "vue3-vite"]`
  - 默认值: `"react-next"`
- `projectName` (string, 可选): 项目目录名称
  - 如果不指定，使用当前目录
- `placeholders` (object, 可选): 占位符替换
  - 支持的键: `projectName`, `description`, `port`, `author`, `email`等
- `useRemote` (boolean, 可选): 是否使用远程模板
  - 默认值: `false`
- `port` (string, 可选): 开发服务器端口
  - 根据模板有不同默认值

**示例**:
```json
{
  "name": "create_frontend",
  "arguments": {
    "template": "react-next",
    "projectName": "my-app",
    "placeholders": {
      "description": "My awesome application",
      "port": "3000"
    },
    "useRemote": true
  }
}
```

### 2. create_react_app - AI Agent 专用 React Next.js 快捷工具
AI Agent 专用工具：一键创建现代化 React Next.js 项目，使用最佳默认配置。

**参数**:
- `projectName` (string, 可选): 项目目录名称
- `port` (string, 可选): 开发服务器端口
  - 默认值: `"3000"`
- `useRemote` (boolean, 可选): 是否使用远程模板
  - 默认值: `true`

**示例**:
```json
{
  "name": "create_react_app",
  "arguments": {
    "projectName": "quick-react-app",
    "port": "3000"
  }
}
```

### 3. download_template - AI Agent 模板下载工具
AI Agent 工具：从远程仓库下载指定模板到本地临时目录，用于离线使用或模板检查。

**参数**:
- `template` (string, 必需): 模板名称
- `templateUrl` (string, 可选): 自定义模板仓库URL

**示例**:
```json
{
  "name": "download_template",
  "arguments": {
    "template": "react-next"
  }
}
```

### 4. list_templates - AI Agent 模板信息工具
AI Agent 工具：列出所有可用的前端项目模板及其详细特性，帮助 AI Agent 做出模板选择决策。

**参数**:
- `templateUrl` (string, 可选): 自定义模板仓库URL

**示例**:
```json
{
  "name": "list_templates",
  "arguments": {}
}
```

**响应示例**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "📋 可用模板列表:\n\n• react-next\n  基于 React + Next.js + Tailwind + Radix UI 的现代化前端项目模板\n  特性: React 18, Next.js 14, TypeScript, Tailwind CSS, Radix UI, ESLint, Prettier\n\n• react-vite\n  基于 React 18 + Vite 的现代化前端项目模板\n  特性: React 18, Vite, TypeScript, ESLint, Prettier, 热重载\n\n"
    }
  ]
}
```

### 5. cache_info - AI Agent 缓存状态工具
AI Agent 工具：获取模板缓存的统计信息和当前状态，帮助 AI Agent 了解缓存使用情况。

**参数**: 无

**示例**:
```json
{
  "name": "cache_info",
  "arguments": {}
}
```

**响应示例**:
```json
{
  "content": [
    {
      "type": "text",
      "text": "📊 Template Cache Information:\n\n📁 Cache Directory: /var/folders/.../cache\n🎯 Cache Enabled: Yes\n⏱️  Cache Expiry: 168 hours\n💾 Max Cache Size: 100 MB\n\n📈 Cache Statistics:\n   Cache Hits: 5\n   Cache Misses: 2\n   Hit Rate: 71%\n   Total Size: 25 MB\n   Cached Templates: react-next, react-vite\n\n💡 Tips:\n   Cache is automatically cleaned up after 7 days\n   Use cache_warm to pre-load templates\n   Use cache_clear to manually clear cache"
    }
  ]
}
```

### 6. cache_clear - AI Agent 缓存清理工具
AI Agent 工具：清除模板缓存（需要确认参数），用于解决缓存问题或释放存储空间。

**参数**:
- `confirm` (boolean, 必需): 确认清除缓存

**示例**:
```json
{
  "name": "cache_clear",
  "arguments": {
    "confirm": true
  }
}
```

### 7. cache_warm - AI Agent 缓存预热工具
AI Agent 工具：预热模板缓存，提前下载模板以确保离线可用性，提升用户体验。

**参数**:
- `templates` (string[], 可选): 要缓存的模板列表
  - 默认值: `["react-next", "react-vite", "vue3-vite"]`
- `templateUrl` (string, 可选): 自定义模板仓库URL

**示例**:
```json
{
  "name": "cache_warm",
  "arguments": {
    "templates": ["react-next", "react-vite"]
  }
}
```

## 📝 响应格式

所有工具返回统一的响应格式：

```typescript
interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;  // 可选，表示是否发生错误
}
```

### 成功响应示例
```json
{
  "content": [
    {
      "type": "text",
      "text": "✅ Project created successfully in my-app.\n🚀  Next steps:\n   cd my-app\n   npm run dev"
    }
  ]
}
```

### 错误响应示例
```json
{
  "content": [
    {
      "type": "text",
      "text": "❌ Error: Template not found"
    }
  ],
  "isError": true
}
```

## 🔧 错误处理

### 常见错误类型

1. **模板不存在**
   - 错误信息: `Invalid template: xxx`
   - 解决方案: 使用有效的模板名称

2. **目录非空**
   - 错误信息: `Directory xxx already exists and is not empty`
   - 解决方案: 使用空目录或指定不同的项目名

3. **网络错误**
   - 错误信息: `Failed to download template: ...`
   - 解决方案: 检查网络连接和模板URL

4. **权限错误**
   - 错误信息: `Permission denied: ...`
   - 解决方案: 检查文件系统权限

5. **npm安装失败**
   - 错误信息: `npm install failed with code xxx`
   - 解决方案: 检查npm配置和网络

## 🌐 使用示例

### Claude Desktop 配置
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

### Python MCP 客户端
```python
import mcp

async def create_project():
    client = mcp.Client("stdio", command="npx", args=["xagi-frontend-mcp"])

    result = await client.call_tool("create_frontend", {
        "template": "react-next",
        "projectName": "my-app",
        "useRemote": True
    })

    print(result.content[0].text)
```

### Node.js MCP 客户端
```javascript
import { MCPSdkClient } from '@modelcontextprotocol/sdk';

const client = new MCPSdkClient({
  name: 'xagi-frontend-mcp-client',
  version: '1.0.0'
});

await client.connect({
  command: 'npx',
  args: ['xagi-frontend-mcp']
});

const result = await client.callTool({
  name: 'create_frontend',
  arguments: {
    template: 'react-next',
    projectName: 'my-app'
  }
});

console.log(result.content[0].text);
```

## 📊 性能指标

### 模板下载性能
- **缓存命中**: < 1秒
- **缓存未命中**: 3-10秒 (取决于网络)
- **并发下载**: 支持多模板并发缓存

### 项目创建性能
- **小项目**: 10-30秒
- **中项目**: 30-60秒
- **大项目**: 1-3分钟

### 缓存效率
- **缓存命中率**: 通常 > 70%
- **存储空间**: 每个模板约 10-50MB
- **缓存有效期**: 7天自动清理

## 🔍 调试和日志

### 启用调试模式
```bash
# 开发模式启动
xagi-frontend-mcp --dev

# HTTP服务器调试模式
xagi-frontend-mcp --http --dev
```

### 日志级别
- **ERROR**: 错误信息
- **WARN**: 警告信息
- **INFO**: 一般信息 (默认)
- **DEBUG**: 调试信息

### 常见问题排查
1. **模板下载失败**: 检查网络连接和GitHub访问
2. **npm安装失败**: 检查Node.js版本和npm配置
3. **权限问题**: 检查目标目录的写权限
4. **缓存问题**: 使用 `cache_clear` 清除缓存

## 📚 相关资源

- [MCP协议文档](https://modelcontextprotocol.io/)
- [模板指南](./TEMPLATES.md)
- [架构设计](./ARCHITECTURE.md)
- [GitHub仓库](https://github.com/dongdada29/xagi-frontend-mcp)