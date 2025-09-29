import { spawn } from 'child_process';

const child = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// 发送请求
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "create_frontend",
    arguments: {
      template: "react-vite",
      projectName: "test-remote-project",
      useRemote: true,
      placeholders: {
        projectName: "Test Remote Project",
        description: "A test project created from remote template"
      }
    }
  }
};

child.stdin.write(JSON.stringify(request) + '\n');
child.stdin.end();

let output = '';
let errorOutput = '';

child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

child.on('close', (code) => {
  console.log('Exit code:', code);
  console.log('Output:', output);
  console.log('Error:', errorOutput);
});
