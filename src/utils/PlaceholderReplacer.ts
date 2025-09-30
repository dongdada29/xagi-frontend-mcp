/**
 * Utility for replacing placeholders in template files
 * 模板占位符替换工具
 */

import fs from "node:fs";
import path from "node:path";
import { PlaceholderValues } from "../types/index.js";

export class PlaceholderReplacer {
  private static readonly BINARY_EXTENSIONS = [
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".pdf", ".zip", ".tar", ".gz"
  ];

  /**
   * Recursively replace placeholders in all files in a directory
   * 递归替换目录中所有文件的占位符
   */
  static replaceRecursively(dir: string, vars: PlaceholderValues): void {
    const files = fs.readdirSync(dir, { recursive: true }) as string[];

    for (const file of files) {
      const fullPath = path.join(dir, file as string);

      // Skip directories
      if (!fs.statSync(fullPath).isFile()) continue;

      // Skip binary files
      const ext = path.extname(fullPath).toLowerCase();
      if (this.BINARY_EXTENSIONS.includes(ext)) continue;

      this.replaceInFile(fullPath, vars);
    }
  }

  /**
   * Replace placeholders in a single file
   * 替换单个文件中的占位符
   */
  private static replaceInFile(filePath: string, vars: PlaceholderValues): void {
    try {
      let content = fs.readFileSync(filePath, "utf8");

      // Replace all ${{key}} patterns
      content = content.replace(/\$\{\{(\w+)\}\}/g, (match, key) => {
        return vars[key] ?? "";
      });

      fs.writeFileSync(filePath, content, "utf8");
    } catch (error) {
      // Skip files that can't be read as text
      console.warn(`Skipping binary file: ${filePath}`);
    }
  }

  /**
   * Generate smart project name from directory name
   * 从目录名称生成智能项目名称
   */
  static generateProjectName(projectName?: string): string {
    if (!projectName) {
      return process.cwd().split(path.sep).pop() || "React App";
    }

    return projectName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get default description based on template
   * 根据模板获取默认描述
   */
  static getDefaultDescription(template: string): string {
    const descriptions = {
      "react-next": "A modern React application built with Next.js",
      "react-vite": "A modern React application built with Vite",
      "vue3-vite": "A modern Vue 3 application built with Vite"
    };

    return descriptions[template as keyof typeof descriptions] || "A modern frontend application";
  }
}