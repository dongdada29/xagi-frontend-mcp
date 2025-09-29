import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { execSync } from "node:child_process";
import * as tar from "tar";
import os from "node:os";

export interface CacheConfig {
  enabled: boolean;
  maxAge: number; // Cache expiry time in milliseconds (default: 24 hours)
  maxSize: number; // Maximum cache size in bytes (default: 100MB)
  location?: string; // Custom cache directory
  offlineMode: boolean; // Whether to work offline when possible
}

export interface CacheStats {
  hitCount: number;
  missCount: number;
  totalSize: number;
  cachedTemplates: string[];
}

export class SimpleTemplateCache {
  private cacheDir: string;
  public config: CacheConfig;
  private stats: CacheStats = {
    hitCount: 0,
    missCount: 0,
    totalSize: 0,
    cachedTemplates: [],
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      enabled: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 100 * 1024 * 1024, // 100MB
      offlineMode: false,
      ...config,
    };

    // Set cache directory
    this.cacheDir = this.config.location || this.getDefaultCacheDir();

    // Initialize cache directory
    this.initializeCache();
  }

  private getDefaultCacheDir(): string {
    const platform = os.platform();
    const homeDir = os.homedir();

    if (platform === "darwin") {
      return path.join(homeDir, "Library", "Caches", "xagi-frontend-mcp");
    } else if (platform === "win32") {
      return path.join(process.env.LOCALAPPDATA || homeDir, "xagi-frontend-mcp", "cache");
    } else {
      return path.join(homeDir, ".cache", "xagi-frontend-mcp");
    }
  }

  private initializeCache(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    // Load cache stats
    this.loadStats();
  }

  private loadStats(): void {
    const statsFile = path.join(this.cacheDir, "cache-stats.json");
    if (fs.existsSync(statsFile)) {
      try {
        const data = fs.readFileSync(statsFile, "utf8");
        this.stats = JSON.parse(data);
      } catch (error) {
        console.warn("Failed to load cache stats:", error);
      }
    }
  }

  private saveStats(): void {
    const statsFile = path.join(this.cacheDir, "cache-stats.json");
    try {
      fs.writeFileSync(statsFile, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      console.warn("Failed to save cache stats:", error);
    }
  }

  async getTemplate(
    templateName: string,
    templateUrl: string
  ): Promise<string> {
    const cacheKey = this.getCacheKey(templateName, templateUrl);
    const cacheFile = path.join(this.cacheDir, `${cacheKey}.tar.gz`);
    const extractDir = path.join(this.cacheDir, templateName);

    if (!this.config.enabled) {
      await this.downloadTemplate(templateName, templateUrl, cacheFile);
      // Extract template after download
      await this.extractTemplate(cacheFile, extractDir);
      return extractDir;
    }

    // Check if cached version exists and is valid
    if (fs.existsSync(cacheFile) && this.isCacheValid(cacheFile)) {
      console.log(`📦 Using cached template: ${templateName}`);
      this.stats.hitCount++;
      this.saveStats();

      // Extract from cache
      await this.extractTemplate(cacheFile, extractDir);
      return extractDir;
    }

    // Download and cache
    console.log(`🌐 Downloading template: ${templateName}`);
    this.stats.missCount++;
    this.saveStats();

    await this.downloadAndCache(templateName, templateUrl, cacheFile, extractDir);
    return extractDir;
  }

  private getCacheKey(templateName: string, templateUrl: string): string {
    // Create a unique cache key based on template name and URL
    const urlHash = this.simpleHash(templateUrl);
    return `${templateName}-${urlHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private isCacheValid(cacheFile: string): boolean {
    try {
      const stats = fs.statSync(cacheFile);
      const cacheAge = Date.now() - stats.mtime.getTime();
      return cacheAge < this.config.maxAge;
    } catch (error) {
      return false;
    }
  }

  private async downloadAndCache(
    templateName: string,
    templateUrl: string,
    cacheFile: string,
    extractDir: string
  ): Promise<void> {
    try {
      // Download template
      await this.downloadTemplate(templateName, templateUrl, cacheFile);

      // Extract template
      await this.extractTemplate(cacheFile, extractDir);

      // Update cached templates list
      if (!this.stats.cachedTemplates.includes(templateName)) {
        this.stats.cachedTemplates.push(templateName);
        this.saveStats();
      }

      // Clean up old cache if needed
      await this.cleanupCache();
    } catch (error) {
      console.error("Failed to download and cache template:", error);
      throw error;
    }
  }

  private async downloadTemplate(
    templateName: string,
    templateUrl: string,
    savePath?: string
  ): Promise<void> {
    const tempDir = path.join(this.cacheDir, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFile = savePath || path.join(tempDir, `${templateName}-${Date.now()}.tar.gz`);

    return new Promise<void>((resolve, reject) => {
      const request = https.get(templateUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            this.downloadTemplate(templateName, redirectUrl, tempFile)
              .then(resolve)
              .catch(reject);
            return;
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download template: ${res.statusCode}`));
          return;
        }

        const fileStream = fs.createWriteStream(tempFile);
        res.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", (error) => {
          fs.unlinkSync(tempFile);
          reject(error);
        });
      });

      request.on("error", (error) => {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
        reject(error);
      });

      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error("Download timeout after 30 seconds"));
      });
    });
  }

  private async extractTemplate(
    archiveFile: string,
    extractDir: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (fs.existsSync(extractDir)) {
        fs.rmSync(extractDir, { recursive: true, force: true });
      }

      fs.mkdirSync(extractDir, { recursive: true });

      fs.createReadStream(archiveFile)
        .pipe(
          tar.x({
            strip: 1,
            cwd: extractDir,
          })
        )
        .on("finish", resolve)
        .on("error", reject);
    });
  }

  private async cleanupCache(): Promise<void> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let totalSize = 0;
      const oldFiles: string[] = [];

      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);

        if (file.endsWith(".tar.gz")) {
          totalSize += stats.size;
          const cacheAge = Date.now() - stats.mtime.getTime();

          // Remove files older than 7 days
          if (cacheAge > 7 * 24 * 60 * 60 * 1000) {
            oldFiles.push(filePath);
          }
        }
      }

      // Remove old files
      for (const file of oldFiles) {
        fs.unlinkSync(file);
        console.log(`🧹 Cleaned up old cache file: ${path.basename(file)}`);
      }

      // Remove extracted directories
      const directories = files.filter(file =>
        !file.endsWith('.tar.gz') &&
        !file.endsWith('.json') &&
        fs.statSync(path.join(this.cacheDir, file)).isDirectory()
      );

      for (const dir of directories) {
        const dirPath = path.join(this.cacheDir, dir);
        const stats = fs.statSync(dirPath);
        const cacheAge = Date.now() - stats.mtime.getTime();

        if (cacheAge > 7 * 24 * 60 * 60 * 1000) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`🧹 Cleaned up old cache directory: ${dir}`);
        }
      }

      this.stats.totalSize = totalSize - oldFiles.reduce((sum, file) => {
        return sum + fs.statSync(file).size;
      }, 0);
      this.saveStats();

    } catch (error) {
      console.warn("Cache cleanup failed:", error);
    }
  }

  // Public methods for cache management
  async clearCache(): Promise<void> {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      this.initializeCache();
      console.log("🧹 Cache cleared successfully");
    }
  }

  getCacheStats(): CacheStats {
    return { ...this.stats };
  }

  getCacheDir(): string {
    return this.cacheDir;
  }

  async warmCache(templateNames: string[], templateUrl: string): Promise<void> {
    console.log("🔥 Warming up cache...");

    for (const templateName of templateNames) {
      try {
        await this.getTemplate(templateName, templateUrl);
        console.log(`✅ Cached template: ${templateName}`);
      } catch (error) {
        console.warn(`Failed to cache template ${templateName}:`, error);
      }
    }

    console.log("🔥 Cache warming completed");
  }
}