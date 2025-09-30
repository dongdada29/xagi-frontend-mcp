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
  private templatesDir: string;
  private archivesDir: string;
  private tempDir: string;
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

    // Set cache directory structure
    this.cacheDir = this.config.location || this.getDefaultCacheDir();
    this.templatesDir = path.join(this.cacheDir, "templates");
    this.archivesDir = path.join(this.cacheDir, "archives");
    this.tempDir = path.join(this.cacheDir, "temp");

    // Initialize cache directory structure
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
    // Create directory structure
    const dirs = [this.cacheDir, this.templatesDir, this.archivesDir, this.tempDir];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Clean up temp directory on startup
    this.cleanTempDirectory();

    // Load cache stats
    this.loadStats();
  }

  private cleanTempDirectory(): void {
    if (fs.existsSync(this.tempDir)) {
      const files = fs.readdirSync(this.tempDir);
      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        try {
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.warn(`Failed to clean temp file ${file}:`, error);
        }
      }
    }
  }

  private loadStats(): void {
    const statsFile = path.join(this.cacheDir, "cache-stats.json");
    if (fs.existsSync(statsFile)) {
      try {
        const data = fs.readFileSync(statsFile, "utf8");
        this.stats = JSON.parse(data);
      } catch (error) {
        console.warn("Failed to load cache stats:", error);
        this.stats = { hitCount: 0, missCount: 0, totalSize: 0, cachedTemplates: [] };
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
    if (!this.config.enabled) {
      return await this.downloadAndExtractTemplate(templateName, templateUrl);
    }

    const cacheKey = this.getCacheKey(templateName, templateUrl);
    const archiveFile = path.join(this.archivesDir, `${cacheKey}.tar.gz`);
    const templateDir = path.join(this.templatesDir, cacheKey);

    // Check if cached version exists and is valid
    if (fs.existsSync(archiveFile) && fs.existsSync(templateDir) && this.isCacheValid(archiveFile)) {
      // Try monorepo structure first (packages/templateName)
      let specificTemplateDir = path.join(templateDir, "packages", templateName);

      // If not found in packages/, try old structure (templateName directly)
      if (!fs.existsSync(specificTemplateDir)) {
        specificTemplateDir = path.join(templateDir, templateName);
      }

      if (fs.existsSync(specificTemplateDir)) {
        console.log(`📦 Using cached template: ${templateName}`);
        this.stats.hitCount++;
        this.saveStats();
        return specificTemplateDir;
      } else {
        console.log(`📦 Template repository cached, but ${templateName} not found. Re-downloading...`);
        // Template not found in cached repository, need to re-download
        this.stats.missCount++;
        this.saveStats();
        return await this.downloadAndCacheTemplate(templateName, templateUrl, cacheKey, archiveFile, templateDir);
      }
    }

    // Download and cache
    console.log(`🌐 Downloading template: ${templateName}`);
    this.stats.missCount++;
    this.saveStats();

    return await this.downloadAndCacheTemplate(templateName, templateUrl, cacheKey, archiveFile, templateDir);
  }

  private getCacheKey(templateName: string, templateUrl: string): string {
    // Create a cache key based only on URL hash, since all templates come from the same repository
    const urlHash = this.simpleHash(templateUrl);
    return `remote-templates-${urlHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
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

  private async downloadAndCacheTemplate(
    templateName: string,
    templateUrl: string,
    cacheKey: string,
    archiveFile: string,
    templateDir: string
  ): Promise<string> {
    try {
      // Clean up existing template directory if it exists
      if (fs.existsSync(templateDir)) {
        fs.rmSync(templateDir, { recursive: true, force: true });
      }

      // Download template to temp location
      const tempArchiveFile = await this.downloadTemplate(templateName, templateUrl);

      // Copy to archive cache
      fs.copyFileSync(tempArchiveFile, archiveFile);

      // Extract template
      await this.extractTemplate(archiveFile, templateDir);

      // Find the specific template directory (monorepo or single)
      const specificTemplateDir = this.findTemplateDirectory(templateDir, templateName);

      // Update cached templates list
      if (!this.stats.cachedTemplates.includes(templateName)) {
        this.stats.cachedTemplates.push(templateName);
        this.saveStats();
      }

      // Update total size
      this.updateTotalSize();

      // Clean up old cache if needed
      await this.cleanupCache();

      return specificTemplateDir;
    } catch (error) {
      console.error("Failed to download and cache template:", error);
      throw error;
    } finally {
      // Clean up temp files
      this.cleanTempDirectory();
    }
  }

  private findTemplateDirectory(templateDir: string, templateName: string): string {
    // Try monorepo structure first (packages/templateName)
    let specificTemplateDir = path.join(templateDir, "packages", templateName);

    // If not found in packages/, try old structure (templateName directly)
    if (!fs.existsSync(specificTemplateDir)) {
      specificTemplateDir = path.join(templateDir, templateName);
    }

    if (fs.existsSync(specificTemplateDir)) {
      return specificTemplateDir;
    }

    throw new Error(`Template '${templateName}' not found in cache. Available: ${this.getAvailableTemplates(templateDir)}`);
  }

  private getAvailableTemplates(templateDir: string): string {
    const packageDir = path.join(templateDir, "packages");
    let templates: string[] = [];

    if (fs.existsSync(packageDir)) {
      // Monorepo structure - list packages
      try {
        const packages = fs.readdirSync(packageDir).filter(p =>
          fs.statSync(path.join(packageDir, p)).isDirectory()
        );
        templates = packages.map(p => `packages/${p}`);
      } catch (error) {
        console.warn("Failed to read packages directory:", error);
      }
    }

    // Also check root directory templates
    try {
      const rootDirs = fs.readdirSync(templateDir).filter(d => {
        const dirPath = path.join(templateDir, d);
        return fs.statSync(dirPath).isDirectory() &&
               d !== "packages" &&
               fs.existsSync(path.join(dirPath, "package.json"));
      });
      templates.push(...rootDirs);
    } catch (error) {
      console.warn("Failed to read root directory:", error);
    }

    return templates.join(", ") || "None";
  }

  private async downloadAndExtractTemplate(
    templateName: string,
    templateUrl: string
  ): Promise<string> {
    const tempDir = path.join(this.tempDir, `download-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // Download template
      const archiveFile = await this.downloadTemplate(templateName, templateUrl, tempDir);

      // Extract template
      await this.extractTemplate(archiveFile, tempDir);

      // Try monorepo structure first (packages/templateName)
      let specificTemplateDir = path.join(tempDir, "packages", templateName);

      // If not found in packages/, try old structure (templateName directly)
      if (!fs.existsSync(specificTemplateDir)) {
        specificTemplateDir = path.join(tempDir, templateName);
      }

      if (fs.existsSync(specificTemplateDir)) {
        return specificTemplateDir;
      } else {
        const availableDirs = fs.readdirSync(tempDir).filter(d => fs.statSync(path.join(tempDir, d)).isDirectory());
        const packageDirs = [];
        const rootDirs = [];

        for (const dir of availableDirs) {
          const dirPath = path.join(tempDir, dir);
          if (fs.existsSync(path.join(dirPath, "package.json"))) {
            // Check if this is a packages directory
            if (dir === "packages") {
              const subDirs = fs.readdirSync(dirPath).filter(subDir => fs.statSync(path.join(dirPath, subDir)).isDirectory());
              packageDirs.push(...subDirs.map(subDir => `packages/${subDir}`));
            } else {
              rootDirs.push(dir);
            }
          }
        }

        throw new Error(`Template '${templateName}' not found in downloaded repository.\nAvailable:\n  Root directories: ${rootDirs.join(', ')}\n  Package directories: ${packageDirs.join(', ')}`);
      }
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      throw error;
    }
  }

  private async downloadTemplate(
    templateName: string,
    templateUrl: string,
    targetDir?: string
  ): Promise<string> {
    const tempDir = targetDir || this.tempDir;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFile = path.join(tempDir, `${templateName}-${Date.now()}.tar.gz`);

    return new Promise<string>((resolve, reject) => {
      const request = https.get(templateUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            this.downloadTemplate(templateName, redirectUrl, tempDir)
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
          resolve(tempFile);
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
        reject(new Error("Download timeout"));
      });
    });
  }

  private async extractTemplate(archiveFile: string, extractDir: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }

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

  private updateTotalSize(): void {
    try {
      let totalSize = 0;
      const files = fs.readdirSync(this.archivesDir);

      for (const file of files) {
        if (file.endsWith(".tar.gz")) {
          const filePath = path.join(this.archivesDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      }

      this.stats.totalSize = totalSize;
    } catch (error) {
      console.warn("Failed to update total size:", error);
    }
  }

  private async cleanupCache(): Promise<void> {
    try {
      await this.cleanupOldArchives();
      await this.cleanupUnusedTemplates();
      await this.enforceSizeLimit();
    } catch (error) {
      console.warn("Cache cleanup failed:", error);
    }
  }

  private async cleanupOldArchives(): Promise<void> {
    const files = fs.readdirSync(this.archivesDir);
    const oldFiles: string[] = [];

    for (const file of files) {
      if (file.endsWith(".tar.gz")) {
        const filePath = path.join(this.archivesDir, file);
        const stats = fs.statSync(filePath);
        const cacheAge = Date.now() - stats.mtime.getTime();

        // Remove files older than maxAge
        if (cacheAge > this.config.maxAge) {
          oldFiles.push(filePath);
        }
      }
    }

    // Remove old files
    for (const file of oldFiles) {
      try {
        fs.unlinkSync(file);
        console.log(`🧹 Cleaned up old archive: ${path.basename(file)}`);
      } catch (error) {
        console.warn(`Failed to clean up archive ${file}:`, error);
      }
    }
  }

  private async cleanupUnusedTemplates(): Promise<void> {
    // Get all valid cache keys from archives
    const archives = fs.readdirSync(this.archivesDir).filter(file => file.endsWith(".tar.gz"));
    const validKeys = archives.map(file => file.replace(".tar.gz", ""));

    // Remove template directories that don't have corresponding archives
    const templateDirs = fs.readdirSync(this.templatesDir);

    for (const dir of templateDirs) {
      if (!validKeys.includes(dir)) {
        const dirPath = path.join(this.templatesDir, dir);
        try {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`🧹 Cleaned up unused template directory: ${dir}`);
        } catch (error) {
          console.warn(`Failed to clean up template directory ${dir}:`, error);
        }
      }
    }
  }

  private async enforceSizeLimit(): Promise<void> {
    const files = fs.readdirSync(this.archivesDir)
      .filter(file => file.endsWith(".tar.gz"))
      .map(file => ({
        name: file,
        path: path.join(this.archivesDir, file),
        stats: fs.statSync(path.join(this.archivesDir, file))
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()); // Sort by newest first

    let totalSize = files.reduce((sum, file) => sum + file.stats.size, 0);

    // Remove oldest files until under size limit
    while (totalSize > this.config.maxSize && files.length > 1) {
      const oldestFile = files.pop()!;

      try {
        fs.unlinkSync(oldestFile.path);
        totalSize -= oldestFile.stats.size;
        console.log(`🧹 Removed archive to enforce size limit: ${oldestFile.name}`);

        // Also remove corresponding template directory
        const templateDir = path.join(this.templatesDir, oldestFile.name.replace(".tar.gz", ""));
        if (fs.existsSync(templateDir)) {
          fs.rmSync(templateDir, { recursive: true, force: true });
        }
      } catch (error) {
        console.warn(`Failed to remove archive ${oldestFile.name}:`, error);
      }
    }

    this.updateTotalSize();
  }

  // Public methods
  getCacheDir(): string {
    return this.cacheDir;
  }

  getCacheStats(): CacheStats {
    // Update total size before returning stats
    this.updateTotalSize();
    return { ...this.stats };
  }

  async clearCache(): Promise<void> {
    try {
      // Clear templates directory
      if (fs.existsSync(this.templatesDir)) {
        fs.rmSync(this.templatesDir, { recursive: true, force: true });
        fs.mkdirSync(this.templatesDir, { recursive: true });
      }

      // Clear archives directory
      if (fs.existsSync(this.archivesDir)) {
        fs.rmSync(this.archivesDir, { recursive: true, force: true });
        fs.mkdirSync(this.archivesDir, { recursive: true });
      }

      // Clear temp directory
      this.cleanTempDirectory();

      // Reset stats
      this.stats = { hitCount: 0, missCount: 0, totalSize: 0, cachedTemplates: [] };
      this.saveStats();

      console.log("🧹 Cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear cache:", error);
      throw error;
    }
  }

  async warmCache(templates: string[], templateUrl: string): Promise<void> {
    console.log("🔥 Warming cache with templates:", templates.join(", "));

    for (const template of templates) {
      try {
        await this.getTemplate(template, templateUrl);
        console.log(`✅ Cached template: ${template}`);
      } catch (error) {
        console.warn(`Failed to cache template ${template}:`, error);
      }
    }
  }
}