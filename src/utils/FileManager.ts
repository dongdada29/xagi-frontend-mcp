/**
 * File and directory management utilities
 * 文件和目录管理工具
 */

import fs from "node:fs";
import path from "node:path";

export class FileManager {
  /**
   * Safely create directory if it doesn't exist
   * 安全创建目录（如果不存在）
   */
  static createDirectory(dirPath: string, projectName?: string): void {
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
      } catch (error) {
        throw new Error(`Failed to create directory ${projectName}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Check if directory is empty
   * 检查目录是否为空
   */
  static isDirectoryEmpty(dirPath: string): boolean {
    try {
      const files = fs.readdirSync(dirPath);
      return files.length === 0;
    } catch (error) {
      const errno = (error as NodeJS.ErrnoException).code;
      if (errno === 'ENOENT') {
        return true; // Directory doesn't exist, considered empty
      }
      throw new Error(`Cannot read directory: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate target directory for project creation
   * 验证项目创建的目标目录
   */
  static validateTargetDirectory(projectName?: string): { targetDir: string; validationError?: string } {
    const targetDir = projectName ? path.resolve(projectName) : process.cwd();

    if (projectName && !fs.existsSync(targetDir)) {
      // Directory doesn't exist, we'll create it
      return { targetDir };
    }

    const isEmpty = this.isDirectoryEmpty(targetDir);

    if (!isEmpty) {
      const error = projectName
        ? `Directory ${projectName} already exists and is not empty`
        : "Current directory is not empty. Please specify a project name or use an empty directory.";
      return { targetDir, validationError: error };
    }

    return { targetDir };
  }

  /**
   * Clean up directory on failure
   * 失败时清理目录
   */
  static cleanupDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * Copy template files to target directory
   * 复制模板文件到目标目录
   */
  static copyTemplateFiles(sourceDir: string, targetDir: string, projectName?: string, templateName?: string): void {
    if (projectName) {
      // Direct copy when project name is specified
      fs.cpSync(sourceDir, targetDir, {
        recursive: true,
        filter: (srcPath) => !srcPath.includes("node_modules"),
      });
    } else {
      // Copy contents to current directory
      let actualTemplateDir = sourceDir;
      const templateContents = fs.readdirSync(sourceDir);

      if (templateName && templateContents.includes(templateName)) {
        actualTemplateDir = path.join(sourceDir, templateName);
      }

      const templateFiles = fs.readdirSync(actualTemplateDir);
      for (const file of templateFiles) {
        const srcPath = path.join(actualTemplateDir, file);
        const destPath = path.join(targetDir, file);

        if (file === "node_modules") continue;

        if (fs.statSync(srcPath).isDirectory()) {
          fs.cpSync(srcPath, destPath, { recursive: true });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  }
}