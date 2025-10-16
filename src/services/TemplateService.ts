/**
 * Template management service
 * 模板管理服务
 */

import fs from "node:fs";
import path from "node:path";
import { SimpleTemplateCache } from "../cache/SimpleTemplateCache.js";
import { TEMPLATE_CONFIG, DEFAULT_PORT_CONFIG, MONOREPO_CONFIG } from "../config/index.js";
import { TemplateInfo, PlaceholderValues, MonorepoConfig } from "../types/index.js";
import { FileManager } from "../utils/FileManager.js";
import { PlaceholderReplacer } from "../utils/PlaceholderReplacer.js";
import { NpmInstaller } from "./NpmInstaller.js";
import { MonorepoManager } from "./MonorepoManager.js";

export class TemplateService {
  private templateCache: SimpleTemplateCache;
  private templateDir: string;
  private monorepoConfig: MonorepoConfig;
  private monorepoManager: MonorepoManager;

  constructor(cacheDir?: string) {
    this.templateCache = new SimpleTemplateCache(cacheDir ? { location: cacheDir } : undefined);
    this.templateDir = path.join(process.cwd(), "templates"); // Fallback, though we use remote
    this.monorepoConfig = MONOREPO_CONFIG;
    this.monorepoManager = new MonorepoManager();
  }

  /**
   * Create a frontend project from template
   * 从模板创建前端项目
   */
  async createFrontendProject(
    template: string = TEMPLATE_CONFIG.default,
    projectName?: string,
    placeholders: PlaceholderValues = {},
    useRemote: boolean = false,
    port?: string,
    autoInstall: boolean = false
  ): Promise<string> {
    // Validate template
    if (!TEMPLATE_CONFIG.enum.includes(template)) {
      throw new Error(`Invalid template: ${template}. Available templates: ${TEMPLATE_CONFIG.enum.join(", ")}`);
    }

    // Set default port based on template (with monorepo support)
    if (!placeholders.port) {
      if (this.monorepoConfig.enabled && this.monorepoConfig.templates[template]) {
        placeholders.port = port || this.monorepoConfig.templates[template].port;
      } else {
        placeholders.port = port || DEFAULT_PORT_CONFIG[template as keyof typeof DEFAULT_PORT_CONFIG] || "3000";
      }
    }

    // Set smart defaults
    if (!placeholders.projectName) {
      placeholders.projectName = PlaceholderReplacer.generateProjectName(projectName);
    }
    if (!placeholders.description) {
      placeholders.description = PlaceholderReplacer.getDefaultDescription(template);
    }

    // Validate target directory
    const { targetDir, validationError } = FileManager.validateTargetDirectory(projectName, true);
    if (validationError) {
      throw new Error(validationError);
    }

    // Create directory if needed
    if (projectName) {
      FileManager.createDirectory(targetDir, projectName);
    }

    try {
      // Get template source
      const sourceDir = await this.getTemplateSource(template, useRemote);

      // Copy template files
      FileManager.copyTemplateFiles(sourceDir, targetDir, projectName, useRemote ? template : undefined);

      // Replace placeholders
      PlaceholderReplacer.replaceRecursively(targetDir, placeholders);

      // Install dependencies (optional)
      if (autoInstall) {
        await NpmInstaller.install(targetDir);
      }

      const displayName = projectName || "current directory";
      const installStep = autoInstall ? '' : 'Install dependencies using your package manager\n   ';
      return `✅ Project created successfully in ${displayName}.\n🚀  Next steps:\n   ${projectName ? `cd ${projectName}` : ''}${installStep} Start development server using your package manager`;
    } catch (error) {
      // Clean up on failure
      if (projectName) {
        FileManager.cleanupDirectory(targetDir);
      }
      throw error;
    }
  }

  /**
   * Get template source directory (local or cached remote)
   * 获取模板源目录（本地或缓存远程）
   */
  private async getTemplateSource(template: string, useRemote: boolean): Promise<string> {
    if (useRemote) {
      return await this.templateCache.getTemplate(template, TEMPLATE_CONFIG.remoteUrl);
    } else {
      const localPath = path.join(this.templateDir, template);
      if (!fs.existsSync(localPath)) {
        throw new Error(`Local template ${template} not found. Use remote templates with useRemote: true`);
      }
      return localPath;
    }
  }

  /**
   * Get available templates list
   * 获取可用模板列表
   */
  getAvailableTemplates(): TemplateInfo[] {
    if (this.monorepoConfig.enabled) {
      // Try to get templates from monorepo workspace first
      try {
        const workspaceTemplates = this.monorepoManager.getWorkspaceTemplates();
        if (workspaceTemplates.length > 0) {
          return workspaceTemplates.map(template => {
            const info = this.monorepoManager.getTemplateInfo(
              template.package.replace("@xagi-templates/", "")
            );
            return {
              name: template.package.replace("@xagi-templates/", ""),
              description: template.description,
              features: info?.features || this.getTemplateFeatures(template.package.replace("@xagi-templates/", "")),
            };
          });
        }
      } catch (error) {
        console.warn("Failed to get workspace templates, falling back to config:", error);
      }

      // Fallback to configuration-based templates
      return Object.entries(this.monorepoConfig.templates).map(([key, template]) => ({
        name: key,
        description: template.description,
        features: this.getTemplateFeatures(key),
      }));
    } else {
      // Fallback to hardcoded templates
      return [
        {
          name: "react-next",
          description: "基于 React + Next.js + Tailwind + Radix UI 的现代化前端项目模板",
          features: ["React 18", "Next.js 14", "TypeScript", "Tailwind CSS", "Radix UI", "ESLint", "Prettier"],
        },
        {
          name: "react-vite",
          description: "基于 React 18 + Vite 的现代化前端项目模板",
          features: ["React 18", "Vite", "TypeScript", "ESLint", "Prettier", "热重载"],
        },
        {
          name: "vue3-vite",
          description: "基于 Vue 3 + Vite 的现代化前端项目模板",
          features: ["Vue 3", "Composition API", "Vite", "TypeScript", "ESLint", "Prettier", "SFC"],
        },
      ];
    }
  }

  /**
   * Get template features based on template name
   * 根据模板名称获取模板特性
   */
  private getTemplateFeatures(templateName: string): string[] {
    const featureMap: Record<string, string[]> = {
      "react-next": [
        "React 18", "Next.js 14", "TypeScript", "Tailwind CSS", "Radix UI",
        "ESLint", "Prettier", "App Router", "SEO 优化", "Server Components"
      ],
      "react-vite": [
        "React 18", "Vite", "TypeScript", "ESLint", "Prettier", "热重载",
        "快速构建", "现代化开发体验"
      ],
      "vue3-vite": [
        "Vue 3", "Composition API", "Vite", "TypeScript", "ESLint", "Prettier",
        "SFC", "快速热重载", "现代化开发体验"
      ]
    };

    return featureMap[templateName] || [];
  }

  /**
   * Get cache statistics
   * 获取缓存统计信息
   */
  getCacheInfo() {
    const stats = this.templateCache.getCacheStats();
    const cacheDir = this.templateCache.getCacheDir();
    const config = this.templateCache.config;

    return {
      cacheDir,
      enabled: config.enabled,
      maxAge: config.maxAge,
      maxSize: config.maxSize,
      stats
    };
  }

  /**
   * Clear template cache
   * 清除模板缓存
   */
  async clearCache(): Promise<void> {
    await this.templateCache.clearCache();
  }

  /**
   * Warm up template cache
   * 预热模板缓存
   */
  async warmCache(templates: string[], templateUrl?: string): Promise<void> {
    const url = templateUrl || TEMPLATE_CONFIG.remoteUrl;
    await this.templateCache.warmCache(templates, url);
  }

  /**
   * Download template to temp directory
   * 下载模板到临时目录
   */
  async downloadTemplate(template: string, templateUrl?: string): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp-templates");
    FileManager.createDirectory(tempDir);

    const url = templateUrl || TEMPLATE_CONFIG.remoteUrl;
    const cachedTemplateDir = await this.templateCache.getTemplate(template, url);

    // Copy from cache to temp directory
    const targetDir = path.join(tempDir, template);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.cpSync(cachedTemplateDir, targetDir, { recursive: true });

    return targetDir;
  }

  /**
   * Initialize template in specified project path
   * 在指定的项目路径中初始化模板
   */
  async initTemplate(
    template: string = TEMPLATE_CONFIG.default,
    projectPath?: string,
    placeholders: PlaceholderValues = {},
    useRemote: boolean = false,
    autoInstall: boolean = false
  ): Promise<string> {
    // 从环境变量获取项目路径，如果没有提供的话
    const targetPath = projectPath || process.env.projectPath;

    if (!targetPath) {
      throw new Error("项目路径未指定。请提供 projectPath 参数或设置 projectPath 环境变量。");
    }

    // 验证模板
    if (!TEMPLATE_CONFIG.enum.includes(template)) {
      throw new Error(`无效的模板: ${template}。可用模板: ${TEMPLATE_CONFIG.enum.join(", ")}`);
    }

    // 设置默认端口
    if (!placeholders.port) {
      if (this.monorepoConfig.enabled && this.monorepoConfig.templates[template]) {
        placeholders.port = this.monorepoConfig.templates[template].port;
      } else {
        placeholders.port = DEFAULT_PORT_CONFIG[template as keyof typeof DEFAULT_PORT_CONFIG] || "3000";
      }
    }

    // 设置智能默认值
    if (!placeholders.projectName) {
      const pathName = path.basename(targetPath);
      placeholders.projectName = PlaceholderReplacer.generateProjectName(pathName);
    }
    if (!placeholders.description) {
      placeholders.description = PlaceholderReplacer.getDefaultDescription(template);
    }

    // 验证目标目录
    if (!fs.existsSync(targetPath)) {
      throw new Error(`目标路径不存在: ${targetPath}`);
    }

    // 检查目录是否为空
    const files = fs.readdirSync(targetPath);
    if (files.length > 0) {
      throw new Error(`目标目录不为空: ${targetPath}。请选择一个空目录或清空现有内容。`);
    }

    try {
      // 优先使用本地缓存的模板
      let sourceDir: string;
      let templateSource: string;

      try {
        // 首先尝试从缓存获取模板
        sourceDir = await this.templateCache.getTemplate(template, TEMPLATE_CONFIG.remoteUrl);
        templateSource = 'cached';
        console.log(`📦 Using cached template: ${template}`);
      } catch (cacheError) {
        // 如果缓存中没有，则根据 useRemote 参数决定是否下载
        if (useRemote) {
          sourceDir = await this.getTemplateSource(template, true);
          templateSource = 'remote';
          console.log(`🌐 Using remote template: ${template}`);
        } else {
          // 尝试使用本地模板
          sourceDir = await this.getTemplateSource(template, false);
          templateSource = 'local';
          console.log(`📁 Using local template: ${template}`);
        }
      }

      // 复制模板文件
      FileManager.copyTemplateFiles(sourceDir, targetPath, undefined, templateSource === 'remote' ? template : undefined);

      // 替换占位符
      PlaceholderReplacer.replaceRecursively(targetPath, placeholders);

      // 安装依赖（可选）
      if (autoInstall) {
        await NpmInstaller.install(targetPath);
      }

      const installStep = autoInstall ? '' : '安装依赖项\n   ';
      const sourceInfo = templateSource === 'cached' ? '（使用本地缓存）' : templateSource === 'remote' ? '（使用远程模板）' : '（使用本地模板）';
      return `✅ 模板 ${template} 已成功初始化到 ${targetPath}${sourceInfo}。\n🚀 下一步:\n   ${installStep}使用您的包管理器启动开发服务器`;
    } catch (error) {
      throw new Error(`初始化模板失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
