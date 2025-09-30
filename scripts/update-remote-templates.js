#!/usr/bin/env node

/**
 * Remote Templates Management Script
 * 远程模板管理脚本 - 用于同步和更新远程模板项目
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  remoteRepo: "https://github.com/dongdada29/xagi-frontend-templates.git",
  localPath: path.join(__dirname, "../remote-templates"),
  templatesConfig: path.join(__dirname, "../src/config/index.ts"),
};

// Colors for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Clone or update remote repository
 * 克隆或更新远程仓库
 */
function setupRemoteRepo() {
  log("🚀 Setting up remote templates repository...", "cyan");

  if (fs.existsSync(CONFIG.localPath)) {
    log("📁 Remote templates directory exists, updating...", "yellow");
    try {
      process.chdir(CONFIG.localPath);
      execSync("git pull origin main", { stdio: "inherit" });
      log("✅ Remote templates updated successfully", "green");
    } catch (error) {
      log(`❌ Failed to update remote templates: ${error.message}`, "red");
      process.exit(1);
    }
  } else {
    log("📁 Cloning remote templates repository...", "yellow");
    try {
      execSync(`git clone ${CONFIG.remoteRepo} ${CONFIG.localPath}`, {
        stdio: "inherit"
      });
      log("✅ Remote templates cloned successfully", "green");
    } catch (error) {
      log(`❌ Failed to clone remote templates: ${error.message}`, "red");
      process.exit(1);
    }
  }

  process.chdir(path.join(__dirname, ".."));
}

/**
 * Analyze remote templates structure
 * 分析远程模板结构
 */
function analyzeRemoteTemplates() {
  log("🔍 Analyzing remote templates structure...", "cyan");

  // Try both packages/ directory and root directory
  const packagesPath = path.join(CONFIG.localPath, "packages");
  const rootPath = CONFIG.localPath;

  let searchPath = packagesPath;
  if (!fs.existsSync(packagesPath)) {
    log("📁 Packages directory not found, using root directory", "yellow");
    searchPath = rootPath;
  }

  const templates = [];
  const packageDirs = fs.readdirSync(searchPath);

  for (const dir of packageDirs) {
    const packagePath = path.join(searchPath, dir);
    const packageJsonPath = path.join(packagePath, "package.json");

    if (fs.statSync(packagePath).isDirectory() && fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

        templates.push({
          name: dir,
          package: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          path: packagePath,
          scripts: packageJson.scripts || {},
          dependencies: packageJson.dependencies || {},
          devDependencies: packageJson.devDependencies || {},
        });

        log(`📦 Found template: ${packageJson.name} (${dir})`, "blue");
      } catch (error) {
        log(`⚠️  Failed to parse package.json for ${dir}: ${error.message}`, "yellow");
      }
    }
  }

  log(`✅ Found ${templates.length} templates in remote repository`, "green");
  return templates;
}

/**
 * Generate configuration from remote templates
 * 从远程模板生成配置
 */
function generateConfiguration(templates) {
  log("⚙️  Generating configuration from remote templates...", "cyan");

  const monorepoConfig = {
    enabled: true,
    workspacePath: "packages",
    templates: {},
    sharedConfig: {
      packageManager: "pnpm",
      workspace: "pnpm-workspace.yaml",
      commonScripts: ["build", "dev", "lint", "type-check", "clean"]
    }
  };

  const defaultPortConfig = {};

  templates.forEach(template => {
    // Extract port from scripts or use default
    let port = "3000";
    if (template.name === "vue3-vite") {
      port = "4000";
    } else if (template.name === "react-next") {
      port = "3000";
    } else if (template.name === "react-vite") {
      port = "3000";
    }

    monorepoConfig.templates[template.name] = {
      package: template.package,
      path: `packages/${template.name}`,
      port: port,
      description: template.description,
    };

    defaultPortConfig[template.name] = port;
  });

  return { monorepoConfig, defaultPortConfig };
}

/**
 * Update configuration file
 * 更新配置文件
 */
function updateConfiguration(monorepoConfig, defaultPortConfig) {
  log("📝 Updating configuration file...", "cyan");

  try {
    const configContent = fs.readFileSync(CONFIG.templatesConfig, "utf8");

    // Find and replace the MONOREPO_CONFIG section
    const monorepoConfigStr = `export const MONOREPO_CONFIG = ${JSON.stringify(monorepoConfig, null, 2)};`;

    // Find and replace the DEFAULT_PORT_CONFIG section
    const defaultPortConfigStr = `export const DEFAULT_PORT_CONFIG = ${JSON.stringify(defaultPortConfig, null, 2)} as const;`;

    // Replace the configurations (this is a simple approach, might need refinement)
    let updatedContent = configContent;

    // Replace MONOREPO_CONFIG
    const monorepoMatch = configContent.match(/export const MONOREPO_CONFIG = \{[\s\S]*?\};/);
    if (monorepoMatch) {
      updatedContent = updatedContent.replace(monorepoMatch[0], monorepoConfigStr);
    }

    // Replace DEFAULT_PORT_CONFIG
    const portMatch = configContent.match(/export const DEFAULT_PORT_CONFIG = \{[\s\S]*?\} as const;/);
    if (portMatch) {
      updatedContent = updatedContent.replace(portMatch[0], defaultPortConfigStr);
    }

    fs.writeFileSync(CONFIG.templatesConfig, updatedContent);
    log("✅ Configuration updated successfully", "green");
  } catch (error) {
    log(`❌ Failed to update configuration: ${error.message}`, "red");
    process.exit(1);
  }
}

/**
 * Generate report
 * 生成报告
 */
function generateReport(templates) {
  log("📊 Generating report...", "cyan");

  let report = `# Remote Templates Analysis Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- Total Templates: ${templates.length}\n`;
  report += `- Remote Repository: ${CONFIG.remoteRepo}\n`;
  report += `- Local Path: ${CONFIG.localPath}\n\n`;

  report += `## Templates\n\n`;

  templates.forEach(template => {
    report += `### ${template.package}\n\n`;
    report += `- **Name**: ${template.name}\n`;
    report += `- **Version**: ${template.version}\n`;
    report += `- **Description**: ${template.description}\n`;
    report += `- **Path**: ${template.path}\n`;
    report += `- **Scripts**: ${Object.keys(template.scripts).join(", ")}\n`;
    report += `- **Dependencies**: ${Object.keys(template.dependencies).length}\n`;
    report += `- **Dev Dependencies**: ${Object.keys(template.devDependencies).length}\n\n`;
  });

  const reportPath = path.join(__dirname, "../remote-templates-report.md");
  fs.writeFileSync(reportPath, report);
  log(`📄 Report generated: ${reportPath}`, "green");
}

/**
 * Main function
 * 主函数
 */
async function main() {
  log("🎯 Remote Templates Management Script", "cyan");
  log("==================================================", "cyan");

  try {
    // Step 1: Setup remote repository
    setupRemoteRepo();

    // Step 2: Analyze remote templates
    const templates = analyzeRemoteTemplates();

    if (templates.length === 0) {
      log("❌ No templates found in remote repository", "red");
      process.exit(1);
    }

    // Step 3: Generate configuration
    const { monorepoConfig, defaultPortConfig } = generateConfiguration(templates);

    // Step 4: Update configuration
    updateConfiguration(monorepoConfig, defaultPortConfig);

    // Step 5: Generate report
    generateReport(templates);

    log("\n🎉 Remote templates management completed successfully!", "green");
    log("📋 Next steps:", "cyan");
    log("   1. Review the generated configuration", "cyan");
    log("   2. Test the MCP server with new templates", "cyan");
    log("   3. Commit the updated configuration", "cyan");

  } catch (error) {
    log(`❌ Script failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
main();