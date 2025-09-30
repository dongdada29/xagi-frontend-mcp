/**
 * Monorepo Management Service
 * 多包管理服务 - 专门用于处理基于 pnpm workspace 的模板项目
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { MONOREPO_CONFIG } from "../config/index.js";
import { MonorepoConfig, MonorepoTemplate } from "../types/index.js";

export class MonorepoManager {
  private config: MonorepoConfig;
  private workspaceRoot: string;

  constructor(workspaceRoot?: string) {
    this.config = MONOREPO_CONFIG;
    this.workspaceRoot = workspaceRoot || process.cwd();
  }

  /**
   * Get workspace root directory
   * 获取工作空间根目录
   */
  getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  /**
   * Check if workspace is valid
   * 检查工作空间是否有效
   */
  isValidWorkspace(): boolean {
    const workspaceFile = path.join(this.workspaceRoot, this.config.sharedConfig.workspace);
    const packageJson = path.join(this.workspaceRoot, "package.json");
    const packagesDir = path.join(this.workspaceRoot, this.config.workspacePath);

    return (
      fs.existsSync(workspaceFile) &&
      fs.existsSync(packageJson) &&
      fs.existsSync(packagesDir)
    );
  }

  /**
   * Get all available templates in workspace
   * 获取工作空间中所有可用模板
   */
  getWorkspaceTemplates(): MonorepoTemplate[] {
    if (!this.config.enabled) {
      return [];
    }

    // Support both workspace path and root directory
    const searchPath = this.config.workspacePath
      ? path.join(this.workspaceRoot, this.config.workspacePath)
      : this.workspaceRoot;

    if (!fs.existsSync(searchPath)) {
      return [];
    }

    const templates: MonorepoTemplate[] = [];
    const packageDirs = fs.readdirSync(searchPath);

    for (const dir of packageDirs) {
      const packagePath = path.join(searchPath, dir);
      const packageJson = path.join(packagePath, "package.json");

      if (fs.statSync(packagePath).isDirectory() && fs.existsSync(packageJson)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJson, "utf8"));
          const templateConfig = this.config.templates[dir];

          // Skip if not a known template
          if (!templateConfig) {
            continue;
          }

          templates.push({
            ...templateConfig,
            package: templateConfig.package, // Use config package name
            path: packagePath,
            name: dir, // Add the directory name as template name
          });
        } catch (error) {
          console.warn(`Failed to parse package.json for ${dir}:`, error);
        }
      }
    }

    return templates;
  }

  /**
   * Get specific template by name
   * 根据名称获取特定模板
   */
  getTemplate(templateName: string): MonorepoTemplate | null {
    if (!this.config.enabled || !this.config.templates[templateName]) {
      return null;
    }

    const templateConfig = this.config.templates[templateName];
    const templatePath = path.join(this.workspaceRoot, templateConfig.path);

    if (!fs.existsSync(templatePath)) {
      return null;
    }

    return {
      ...templateConfig,
      path: templatePath,
    };
  }

  /**
   * Get template package.json
   * 获取模板的 package.json
   */
  getTemplatePackageJson(templateName: string): any {
    const template = this.getTemplate(templateName);
    if (!template) {
      return null;
    }

    const packageJsonPath = path.join(template.path, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      return null;
    }

    try {
      return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch (error) {
      console.warn(`Failed to parse package.json for ${templateName}:`, error);
      return null;
    }
  }

  /**
   * Get template dependencies
   * 获取模板依赖
   */
  getTemplateDependencies(templateName: string): { dependencies: Record<string, string>; devDependencies: Record<string, string> } {
    const packageJson = this.getTemplatePackageJson(templateName);
    if (!packageJson) {
      return { dependencies: {}, devDependencies: {} };
    }

    return {
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
    };
  }

  /**
   * Get template scripts
   * 获取模板脚本
   */
  getTemplateScripts(templateName: string): Record<string, string> {
    const packageJson = this.getTemplatePackageJson(templateName);
    if (!packageJson) {
      return {};
    }

    return packageJson.scripts || {};
  }

  /**
   * Get template information for MCP
   * 获取用于 MCP 的模板信息
   */
  getTemplateInfo(templateName: string): { name: string; description: string; features: string[]; port: string } | null {
    const template = this.getTemplate(templateName);
    if (!template) {
      return null;
    }

    const scripts = this.getTemplateScripts(templateName);
    const features = this.extractFeaturesFromPackage(templateName, scripts);

    return {
      name: templateName,
      description: template.description,
      features,
      port: template.port,
    };
  }

  /**
   * Extract features from package.json and scripts
   * 从 package.json 和脚本中提取特性
   */
  private extractFeaturesFromPackage(templateName: string, scripts: Record<string, string>): string[] {
    const features: string[] = [];

    // Base features for all templates
    features.push("TypeScript 支持", "现代化构建工具");

    // Add features based on template type
    if (templateName.includes("react")) {
      features.push("React 18");
      if (templateName.includes("next")) {
        features.push("Next.js 14", "App Router", "SEO 优化");
      } else {
        features.push("Vite", "快速构建");
      }
    } else if (templateName.includes("vue")) {
      features.push("Vue 3", "Composition API", "Vite");
    }

    // Add features based on available scripts
    if (scripts.lint) features.push("ESLint");
    if (scripts["type-check"]) features.push("类型检查");
    if (scripts.test) features.push("测试支持");
    if (scripts.build) features.push("生产构建");

    return features;
  }

  /**
   * Run workspace command
   * 运行工作空间命令
   */
  runWorkspaceCommand(command: string, cwd?: string): { success: boolean; output: string; error: string | null } {
    try {
      const workingDir = cwd || this.workspaceRoot;
      const output = execSync(command, {
        cwd: workingDir,
        encoding: "utf8",
        stdio: "pipe"
      });

      return {
        success: true,
        output: output,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        output: "",
        error: error.message,
      };
    }
  }

  /**
   * Install dependencies for workspace
   * 为工作空间安装依赖
   */
  installDependencies(): { success: boolean; output: string; error: string | null } {
    return this.runWorkspaceCommand("pnpm install");
  }

  /**
   * Build all templates
   * 构建所有模板
   */
  buildAll(): { success: boolean; output: string; error: string | null } {
    return this.runWorkspaceCommand("pnpm build");
  }

  /**
   * Run development server for specific template
   * 运行特定模板的开发服务器
   */
  runDevServer(templateName: string): { success: boolean; output: string; error: string | null } {
    const template = this.getTemplate(templateName);
    if (!template) {
      return {
        success: false,
        output: "",
        error: `Template ${templateName} not found`,
      };
    }

    // Run in template directory
    return this.runWorkspaceCommand("pnpm dev", template.path);
  }

  /**
   * Get workspace status
   * 获取工作空间状态
   */
  getWorkspaceStatus(): {
    isValid: boolean;
    templates: MonorepoTemplate[];
    packageManager: string;
    workspaceRoot: string;
  } {
    return {
      isValid: this.isValidWorkspace(),
      templates: this.getWorkspaceTemplates(),
      packageManager: this.config.sharedConfig.packageManager,
      workspaceRoot: this.workspaceRoot,
    };
  }

  /**
   * Generate workspace report
   * 生成工作空间报告
   */
  generateWorkspaceReport(): string {
    const status = this.getWorkspaceStatus();

    let report = `📊 Monorepo Workspace Report\n\n`;
    report += `📍 Workspace Root: ${status.workspaceRoot}\n`;
    report += `📦 Package Manager: ${status.packageManager}\n`;
    report += `✅ Valid Workspace: ${status.isValid ? "Yes" : "No"}\n\n`;

    if (status.templates.length > 0) {
      report += `📋 Available Templates (${status.templates.length}):\n\n`;

      for (const template of status.templates) {
        const packageJson = this.getTemplatePackageJson(template.package.replace("@xagi-templates/", ""));
        const version = packageJson?.version || "unknown";
        const scripts = this.getTemplateScripts(template.package.replace("@xagi-templates/", ""));

        report += `📦 ${template.package}\n`;
        report += `   Version: ${version}\n`;
        report += `   Path: ${template.path}\n`;
        report += `   Port: ${template.port}\n`;
        report += `   Description: ${template.description}\n`;
        report += `   Scripts: ${Object.keys(scripts).join(", ")}\n\n`;
      }
    } else {
      report += `❌ No templates found in workspace\n`;
    }

    return report;
  }
}