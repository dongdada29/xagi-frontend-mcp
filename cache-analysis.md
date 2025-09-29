# 模板缓存机制分析与改进方案

## 当前状态

### ❌ 现有问题
1. **无 HTTP 缓存**：每次都重新下载，浪费带宽
2. **无文件缓存**：下载的 tarball 不保存
3. **无版本检查**：无法判断模板是否有更新
4. **无离线支持**：网络断开时无法工作
5. **无过期机制**：缓存管理不完善

### 📁 当前实现
```typescript
// 每次都重新下载
const templateUrl = `https://github.com/dongdada29/xagi-frontend-templates/archive/main.tar.gz`;
await downloadTemplate(template, tempDir, templateUrl);
```

## 🚀 改进方案

### 方案 1: 简单文件缓存 (推荐)

**实现位置**: `src/cache/TemplateCache.ts`

```typescript
class TemplateCache {
  private cacheDir: string;
  private cacheExpiry: number = 24 * 60 * 60 * 1000; // 24小时

  async getTemplate(templateName: string, templateUrl: string): Promise<string> {
    const cacheKey = this.getCacheKey(templateName, templateUrl);
    const cachedPath = path.join(this.cacheDir, cacheKey);

    // 检查缓存是否存在且未过期
    if (await this.isValidCache(cachedPath)) {
      return cachedPath;
    }

    // 下载并缓存
    return await this.downloadAndCache(templateName, templateUrl, cachedPath);
  }
}
```

**特点**:
- ✅ 实现简单
- ✅ 减少重复下载
- ✅ 支持离线使用
- ✅ 可配置过期时间

### 方案 2: HTTP 缓存 + 文件缓存

**实现位置**: `src/cache/HttpCache.ts`

```typescript
class HttpCache {
  async downloadWithCache(url: string, cachePath: string): Promise<void> {
    // 检查缓存文件和 HTTP 头信息
    const etag = await this.getETag(cachePath);
    const lastModified = await this.getLastModified(cachePath);

    // 发送条件请求
    const response = await fetch(url, {
      headers: {
        'If-None-Match': etag,
        'If-Modified-Since': lastModified
      }
    });

    if (response.status === 304) {
      // 使用缓存
      return;
    }

    // 更新缓存
    await this.saveResponse(response, cachePath);
  }
}
```

**特点**:
- ✅ 更智能的缓存策略
- ✅ 支持增量更新
- ✅ 节省带宽
- ✅ 自动检测更新

### 方案 3: Git 缓存 (最强大)

**实现位置**: `src/cache/GitCache.ts`

```typescript
class GitCache {
  private repoDir: string;

  async getTemplate(templateName: string, repoUrl: string): Promise<string> {
    // 克隆或更新仓库
    await this.ensureRepoUpdated(repoUrl);

    // 获取指定版本的模板
    const templatePath = path.join(this.repoDir, templateName);
    const commitHash = await this.getCurrentCommit();

    // 复制到缓存目录
    const cachePath = path.join(this.cacheDir, `${templateName}-${commitHash}`);
    await fs.copy(templatePath, cachePath);

    return cachePath;
  }
}
```

**特点**:
- ✅ 完整的版本历史
- ✅ 支持版本切换
- ✅ 增量更新
- ✅ 最小的下载量

## 📋 推荐实现方案

### 优先级 1: 简单文件缓存
```typescript
// src/cache/SimpleCache.ts
export class SimpleTemplateCache {
  constructor(private cacheDir = path.join(os.homedir(), '.xagi-frontend-cache')) {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  }

  async getTemplate(templateName: string, templateUrl: string): Promise<string> {
    const cacheFile = path.join(this.cacheDir, `${templateName}.tar.gz`);
    const extractDir = path.join(this.cacheDir, templateName);

    // 检查缓存是否存在且未过期
    if (fs.existsSync(cacheFile) && this.isCacheValid(cacheFile)) {
      console.log(`📦 Using cached template: ${templateName}`);
      return extractDir;
    }

    // 下载新版本
    await this.downloadTemplate(templateUrl, cacheFile);
    await this.extractTemplate(cacheFile, extractDir);

    return extractDir;
  }

  private isCacheValid(cacheFile: string): boolean {
    const stats = fs.statSync(cacheFile);
    const cacheAge = Date.now() - stats.mtime.getTime();
    return cacheAge < 24 * 60 * 60 * 1000; // 24小时
  }
}
```

### 集成到主文件
```typescript
// src/index.ts
import { SimpleTemplateCache } from './cache/SimpleCache';

const cache = new SimpleTemplateCache();

// 在 downloadTemplate 函数中
async function downloadTemplate(name: string, dest: string, templateUrl?: string) {
  const cacheDir = await cache.getTemplate(name, templateUrl);

  // 从缓存复制到目标目录
  fs.cpSync(cacheDir, dest, { recursive: true });
}
```

## 🎯 缓存策略建议

### 缓存位置
- **macOS**: `~/Library/Caches/xagi-frontend-mcp`
- **Linux**: `~/.cache/xagi-frontend-mcp`
- **Windows**: `%LOCALAPPDATA%\xagi-frontend-mcp\cache`

### 缓存管理
1. **自动清理**: 超过 7 天的缓存自动删除
2. **手动清理**: 提供 `--clean-cache` 命令
3. **大小限制**: 缓存总大小不超过 100MB
4. **版本检查**: 基于 Git commit hash 或 ETag

### 配置选项
```typescript
interface CacheConfig {
  enabled: boolean;
  maxAge: number;           // 毫秒
  maxSize: number;          // 字节
  location: string;        // 自定义缓存目录
  offlineMode: boolean;    // 离线模式
}
```

## 📊 性能提升预期

| 场景 | 无缓存 | 有缓存 | 提升 |
|------|--------|--------|------|
| 首次下载 | 100% | 100% | 0% |
| 重复下载 | 100% | 5% | 95% |
| 离线使用 | 0% | 100% | 100% |
| 网络缓慢 | 100% | 10% | 90% |

## 🔧 实现步骤

1. **第一步**: 实现简单文件缓存
2. **第二步**: 添加缓存管理功能
3. **第三步**: 实现 HTTP 缓存头支持
4. **第四步**: 添加 Git 缓存选项
5. **第五步**: 完善缓存清理和统计

这个改进将显著提升用户体验，特别是在重复使用和网络不稳定的情况下。