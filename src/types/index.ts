/**
 * Type definitions for XAGI Frontend MCP
 * 类型定义文件
 */

export interface PlaceholderValues {
  projectName?: string;
  description?: string;
  port?: string;
  [key: string]: string | undefined;
}

export interface TemplateMetadata {
  name: string;
  description: string;
  features: string[];
}

export interface CreateFrontendArgs {
  template?: string;
  projectName?: string;
  placeholders?: PlaceholderValues;
  useRemote?: boolean;
  port?: string;
}

export interface CreateReactAppArgs {
  projectName?: string;
  port?: string;
  useRemote?: boolean;
}

export interface DownloadTemplateArgs {
  template: string;
  templateUrl?: string;
}

export interface CacheInfoArgs {
  // Empty interface for cache info tool
}

export interface CacheClearArgs {
  confirm: boolean;
}

export interface CacheWarmArgs {
  templates?: string[];
  templateUrl?: string;
}

export interface TemplateInfo {
  name: string;
  description: string;
  features: string[];
}

export interface CacheStats {
  hitCount: number;
  missCount: number;
  totalSize: number;
  cachedTemplates: string[];
}

export interface MonorepoTemplate {
  name: string;
  package: string;
  path: string;
  port: string;
  description: string;
}

export interface MonorepoConfig {
  enabled: boolean;
  workspacePath: string;
  templates: Record<string, MonorepoTemplate>;
  sharedConfig: {
    packageManager: string;
    workspace: string;
    commonScripts: string[];
  };
}