# 📦 发布指南

## 发布方式

### 1. NPM 包发布（推荐）

#### 准备工作

1. **注册 NPM 账号**
   ```bash
   npm adduser
   # 或
   npm login
   ```

2. **检查包名是否可用**
   ```bash
   npm view xagi-frontend-mcp
   ```

3. **更新版本号**
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

#### 发布步骤

1. **构建项目**
   ```bash
   npm run build
   ```

2. **检查发布内容**
   ```bash
   npm pack --dry-run
   ```

3. **发布到 NPM**
   ```bash
   npm publish
   ```

4. **验证发布**
   ```bash
   npm view xagi-frontend-mcp
   ```

### 2. GitHub Releases

#### 创建 Release

1. **打标签**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **在 GitHub 上创建 Release**
   - 访问 https://github.com/dongdada29/xagi-frontend-mcp/releases
   - 点击 "Create a new release"
   - 选择标签 `v1.0.0`
   - 填写发布说明
   - 上传构建文件（可选）

### 3. Docker 镜像发布

#### 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY templates/ ./templates/

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

#### 构建和发布

```bash
# 构建镜像
docker build -t xagi-frontend-mcp .

# 标记镜像
docker tag xagi-frontend-mcp dongdada29/xagi-frontend-mcp:latest

# 推送到 Docker Hub
docker push dongdada29/xagi-frontend-mcp:latest
```

## 发布检查清单

### 发布前检查

- [ ] 所有测试通过
- [ ] 文档更新完整
- [ ] 版本号正确
- [ ] CHANGELOG 更新
- [ ] 许可证文件存在
- [ ] README 示例可运行

### 发布后检查

- [ ] NPM 包可正常安装
- [ ] 功能测试通过
- [ ] 文档链接有效
- [ ] 示例项目可创建

## 版本管理

### 语义化版本

- **MAJOR**: 不兼容的 API 更改
- **MINOR**: 向后兼容的功能添加
- **PATCH**: 向后兼容的错误修复

### 版本更新命令

```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 次要版本 (1.0.0 -> 1.1.0)
npm version minor

# 主要版本 (1.0.0 -> 2.0.0)
npm version major
```

## 自动化发布

### GitHub Actions

创建 `.github/workflows/publish.yml`:

```yaml
name: Publish

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 发布后推广

### 社交媒体

- Twitter/X: 分享发布消息
- LinkedIn: 技术文章
- Reddit: 相关社区分享

### 技术社区

- GitHub: 更新项目描述
- NPM: 添加关键词标签
- 技术博客: 写使用教程

## 维护

### 定期更新

- 依赖更新
- 安全补丁
- 新功能添加
- 文档维护

### 用户反馈

- 监控 Issues
- 回复用户问题
- 收集功能建议
- 改进用户体验
