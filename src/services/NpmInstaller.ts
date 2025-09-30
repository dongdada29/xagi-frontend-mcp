/**
 * npm package installation service
 * npm包安装服务
 */

export class NpmInstaller {
  /**
   * Install npm dependencies in a directory
   * 在指定目录中安装npm依赖
   */
  static async install(cwd: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const { spawn } = await import("node:child_process");
      const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

      const cp = spawn(npmCmd, ["install"], {
        cwd,
        stdio: "pipe", // Silent mode
        shell: true,
      });

      let errorOutput = "";

      cp.stderr?.on("data", (data: Buffer) => {
        errorOutput += data.toString();
      });

      cp.on("close", (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(`npm install failed with code ${code}: ${errorOutput}`)
          );
        }
      });

      cp.on("error", (error: Error) => {
        reject(new Error(`Failed to spawn npm: ${error.message}`));
      });
    });
  }
}