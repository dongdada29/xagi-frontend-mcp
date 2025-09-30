# XAGI Frontend MCP - AI Agent 优化的分层架构设计

## 🏗️ 为 AI Agent 优化的分层架构概述

本项目采用专为 AI Agent 设计的清晰分层架构，提高代码的可维护性、可扩展性和可测试性，同时为 AI Agent 提供自然的前端工程初始化体验。

```
src/
├── config/          # 配置层 - 统一管理所有配置
├── types/           # 类型定义层 - TypeScript类型定义
├── utils/           # 工具层 - 通用工具函数
├── services/        # 服务层 - 业务逻辑实现
├── core/           # 核心层 - MCP服务器核心逻辑
└── index.ts        # 入口文件
```

## 📂 层级说明

### 1. 配置层 (config/)
- **目的**: 集中管理所有配置项
- **文件**: `src/config/index.ts`
- **内容**:
  - 服务器配置 (`SERVER_CONFIG`)
  - 模板配置 (`TEMPLATE_CONFIG`)
  - HTTP配置 (`HTTP_CONFIG`)
  - 默认端口配置 (`DEFAULT_PORT_CONFIG`)

### 2. 类型定义层 (types/)
- **目的**: 提供完整的TypeScript类型支持
- **文件**: `src/types/index.ts`
- **内容**:
  - 工具参数类型 (`CreateFrontendArgs`, `CreateReactAppArgs`等)
  - 模板元数据类型 (`TemplateMetadata`)
  - 缓存统计类型 (`CacheStats`)
  - 占位符类型 (`PlaceholderValues`)

### 3. 工具层 (utils/)
- **目的**: 提供可复用的工具函数
- **文件**:
  - `PlaceholderReplacer.ts` - 占位符替换工具
  - `FileManager.ts` - 文件和目录管理工具
- **功能**:
  - 递归替换模板占位符
  - 智能项目命名
  - 目录验证和创建
  - 文件复制和清理

### 4. 服务层 (services/)
- **目的**: 实现具体的业务逻辑
- **文件**:
  - `TemplateService.ts` - 模板管理服务
  - `NpmInstaller.ts` - npm包安装服务
- **功能**:
  - 项目创建流程管理
  - 模板下载和缓存
  - 依赖安装
  - 缓存统计和管理

### 5. 核心层 (core/)
- **目的**: MCP协议和工具集成
- **文件**: `MCPServer.ts`
- **功能**:
  - MCP服务器实例管理
  - 工具定义和注册
  - 请求路由和处理
  - 错误处理

### 6. 入口层 (Entry Points)
- **文件**:
  - `src/index.ts` - stdio模式入口
  - `http-server.js` - HTTP模式入口（向后兼容）
- **功能**: 启动不同模式的服务器

## 🔄 数据流

1. **请求接收**: MCP服务器接收工具调用请求
2. **参数验证**: 核心层验证输入参数
3. **服务调用**: 核心层调用相应的服务层方法
4. **业务处理**: 服务层协调各个工具完成业务逻辑
5. **返回结果**: 结果逐层返回给调用方

```
MCP Request → Core Layer → Service Layer → Utility Layer → File System
                ↑                                   ↓
Response ← Core Layer ← Service Layer ← Utility Layer
```

## 🎯 设计原则

### 1. 单一职责原则 (SRP)
- 每个模块只负责一个明确的功能
- 服务层专注业务逻辑，工具层专注通用功能

### 2. 依赖注入 (DI)
- 服务类通过构造函数接收依赖
- 便于测试和模块替换

### 3. 配置集中化
- 所有配置项统一管理
- 避免硬编码值散布在代码中

### 4. 类型安全
- 完整的TypeScript类型定义
- 编译时类型检查

### 5. 错误处理
- 统一的错误处理机制
- 优雅的错误消息和清理

## 🚀 扩展性

### 添加新模板
1. 在 `src/config/index.ts` 中添加模板到 `TEMPLATE_CONFIG.enum`
2. 在 `DEFAULT_PORT_CONFIG` 中添加默认端口
3. 在 `TemplateService.getAvailableTemplates()` 中添加模板信息

### 添加新工具
1. 在 `src/types/index.ts` 中定义参数类型
2. 在 `src/core/MCPServer.ts` 中添加工具定义
3. 在 `src/services/` 或 `src/utils/` 中实现业务逻辑

### 添加新服务
1. 在 `src/services/` 中创建新的服务类
2. 在核心层中集成并使用新服务

## 🧪 测试策略

分层架构便于单元测试：
- **工具层**: 独立测试各个工具函数
- **服务层**: Mock依赖，测试业务逻辑
- **核心层**: 测试MCP协议集成
- **端到端**: 测试完整的工作流

## 📝 迁移指南

### 从旧架构迁移
1. 配置项移动到 `src/config/index.ts`
2. 类型定义移动到 `src/types/index.ts`
3. 业务逻辑重构为服务类
4. 通用函数提取到工具类
5. MCP逻辑集中到核心类

### 向后兼容
- 保留原有的入口点接口
- HTTP服务器模式保持兼容
- CLI命令和参数不变