# 发布指南

## 发布流程

### 1. 准备工作

```bash
# 登录 NPM
npm login

# 检查包名可用性
npm view xagi-frontend-mcp
```

### 2. 发布前检查

```bash
# 构建项目
npm run build

# 运行测试
npm test

# 检查版本号
npm version patch/minor/major
```

### 3. 发布到 NPM

```bash
# 发布
npm publish

# 或发布为最新版本
npm publish --tag latest
```

### 4. 验证发布

```bash
# 测试安装
npm install -g xagi-frontend-mcp@latest

# 测试运行
xagi-frontend-mcp --version

# 测试功能
npx xagi-frontend-mcp --help
```

## GitHub Actions 自动发布

项目已配置 GitHub Actions，支持：

1. **自动发布**: 推送到 main 分支自动构建和发布
2. **手动发布**: 在 Actions 页面手动触发发布
3. **版本管理**: 自动根据 commit message 生成版本号

## 发布后验证

1. **Claude Desktop 测试**
   - 配置 MCP 服务器
   - 测试工具可用性
   - 测试项目创建功能

2. **Claude Code 测试**
   - 配置 MCP 服务器
   - 测试命令行工具
   - 测试项目创建功能

3. **功能测试**
   - 所有模板创建测试
   - 缓存功能测试
   - 错误处理测试

## 回滚版本

如果发现问题，可以回滚到之前版本：

```bash
# 撤销发布
npm unpublish xagi-frontend-mcp@version

# 或弃用版本
npm deprecate xagi-frontend-mcp@version "原因说明"
```

## 发布清单

- [ ] 版本号更新
- [ ] 构建成功
- [ ] 测试通过
- [ ] 更新日志更新
- [ ] 文档同步
- [ ] 发布到 NPM
- [ ] 验证发布成功
- [ ] 更新 GitHub Release