import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import tar from 'tar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');

const server = new Server(
  { name: 'xagi-frontend-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_frontend',
      description: 'Generate a frontend project without external CLI',
      inputSchema: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            enum: ['react-vite', 'vue3-vite'],
            description: 'Template to use for the project'
          },
          projectName: {
            type: 'string',
            description: 'Name of the project directory to create'
          },
          placeholders: {
            type: 'object',
            additionalProperties: true,
            description: 'Key-value pairs to replace in template files (format: ${{key}})'
          },
        },
        required: ['template', 'projectName'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name !== 'create_frontend') {
    throw new Error('Unknown tool');
  }

  const { template, projectName, placeholders = {} } = req.params.arguments as {
    template: string;
    projectName: string;
    placeholders?: Record<string, string>;
  };

  // Validate inputs
  if (!template || !projectName) {
    throw new Error('template and projectName are required');
  }

  const src = path.join(TEMPLATE_DIR, template);
  if (!fs.existsSync(src)) {
    throw new Error(`Template ${template} not found in ${TEMPLATE_DIR}`);
  }

  const dest = path.resolve(projectName);
  if (fs.existsSync(dest)) {
    throw new Error(`Directory ${projectName} already exists`);
  }

  try {
    // 1. Copy template files
    fs.cpSync(src, dest, {
      recursive: true,
      filter: (srcPath) => !srcPath.includes('node_modules')
    });

    // 2. Replace placeholders
    replaceRecursively(dest, placeholders);

    // 3. Install dependencies
    await npmInstall(dest);

    return {
      content: [
        {
          type: 'text',
          text: `✅ ${projectName} created successfully.\n🚀  Next steps:\n   cd ${projectName}\n   npm run dev`,
        },
      ],
    };
  } catch (error) {
    // Clean up on failure
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    throw error;
  }
});

function replaceRecursively(dir: string, vars: Record<string, string>) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];

  for (const file of files) {
    const fullPath = path.join(dir, file as string);

    // Skip directories
    if (!fs.statSync(fullPath).isFile()) continue;

    // Skip binary files (common extensions)
    const ext = path.extname(fullPath).toLowerCase();
    const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf', '.zip', '.tar', '.gz'];
    if (binaryExtensions.includes(ext)) continue;

    try {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace all ${{key}} patterns
      content = content.replace(/\$\{\{(\w+)\}\}/g, (match, key) => {
        return vars[key] ?? '';
      });

      fs.writeFileSync(fullPath, content, 'utf8');
    } catch (error) {
      // Skip files that can't be read as text
      console.warn(`Skipping binary file: ${fullPath}`);
    }
  }
}

function npmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const { spawn } = require('node:child_process');
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const cp = spawn(npmCmd, ['install'], {
      cwd,
      stdio: 'pipe', // Silent mode
      shell: true
    });

    let errorOutput = '';

    cp.stderr?.on('data', (data: Buffer) => {
      errorOutput += data.toString();
    });

    cp.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}: ${errorOutput}`));
      }
    });

    cp.on('error', (error: Error) => {
      reject(new Error(`Failed to spawn npm: ${error.message}`));
    });
  });
}

// Optional: Template downloading functionality
async function downloadTemplate(name: string, dest: string, templateUrl?: string) {
  const TEMPLATE_URL = templateUrl || `https://github.com/your-org/templates/archive/main.tar.gz`;

  return new Promise<void>((resolve, reject) => {
    https.get(`${TEMPLATE_URL}`, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download template: ${res.statusCode}`));
        return;
      }

      res.pipe(tar.x({
        strip: 2,
        cwd: dest
      }, [`templates-main/${name}`]))
        .on('finish', () => resolve())
        .on('error', reject);
    }).on('error', reject);
  });
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('XAGI Frontend MCP server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});