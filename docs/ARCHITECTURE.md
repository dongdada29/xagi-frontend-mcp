# 架构设计

## 分层架构

项目采用清晰的分层架构，提高可维护性和可扩展性：

```
src/
├── config/          # 配置层
├── types/           # 类型定义层
├── utils/           # 工具层
├── services/        # 服务层
├── core/           # 核心层
└── index.ts        # 入口文件
```

## 层级说明

### 1. 配置层 (config/)
集中管理所有配置项：
- 服务器配置 (`SERVER_CONFIG`)
- 模板配置 (`TEMPLATE_CONFIG`)
- HTTP配置 (`HTTP_CONFIG`)
- 默认端口配置 (`DEFAULT_PORT_CONFIG`)

### 2. 类型定义层 (types/)
提供完整的 TypeScript 类型支持：
- MCP 工具参数类型
- 模板信息类型
- 缓存配置类型

### 3. 工具层 (utils/)
通用工具函数：
- 文件管理 (`FileManager`)
- 占位符替换 (`PlaceholderReplacer`)

### 4. 服务层 (services/)
业务逻辑实现：
- 模板服务 (`TemplateService`)
- 包安装服务 (`NpmInstaller`)
- Monorepo管理 (`MonorepoManager`)

### 5. 核心层 (core/)
MCP 服务器核心逻辑：
- MCP 服务器实现 (`MCPServer`)

### 6. 缓存层 (cache/)
模板缓存管理：
- 简单模板缓存 (`SimpleTemplateCache`)

## 设计原则

### 1. 单一职责
每个模块只负责一个明确的功能领域

### 2. 依赖倒置
高层模块不依赖低层模块，依赖抽象而非具体实现

### 3. 开闭原则
对扩展开放，对修改关闭

### 4. 接口隔离
使用最小接口，避免接口污染

## 关键特性

### 智能缓存系统
- 自动缓存远程模板
- 基于 LRU 的缓存清理
- 缓存预热功能

### 模板管理
- 支持本地和远程模板
- Monorepo 模板支持
- 智能占位符替换

### 错误处理
- 统一错误处理机制
- 优雅的失败恢复
- 详细的错误信息

### 性能优化
- 流式文件操作
- 并发下载支持
- 内存使用优化