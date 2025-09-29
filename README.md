# XAGI Frontend MCP Server

A Model Context Protocol (MCP) server that scaffolds frontend projects without requiring an external CLI. All template management, variable replacement, and dependency installation happens within the server.

## Features

- **No external CLI required** - Everything is handled within the MCP server
- **Built-in templates** - Includes React + Vite and Vue 3 + Vite templates
- **Variable replacement** - Supports `${{key}}` placeholder replacement in template files
- **Automatic dependency installation** - Runs `npm install` after project creation
- **Error handling** - Cleans up partial projects on failure

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Add to Claude Code:
```bash
claude mcp add xagi-frontend -- npx -y /path/to/your/xagi-frontend-mcp
```

## Usage

In Claude Code, use the `/create_frontend` tool:

```bash
/create_frontend react-vite my-app --placeholders.port 3100 --placeholders.title "My Cool Project"
```

### Available Templates

- `react-vite` - React + Vite + TypeScript + ESLint + Prettier
- `vue3-vite` - Vue 3 + Vite + TypeScript

### Placeholders

You can customize templates using placeholders in the format `${{key}}`:

- `projectName` - The project directory name
- `port` - Development server port
- `title` - Application title

## Template Structure

Templates are stored in the `templates/` directory:

```
templates/
├── react-vite/
│   ├── meta.json          # Template metadata
│   ├── package.json       # With placeholders
│   ├── vite.config.ts     # Config files
│   ├── index.html         # HTML with placeholders
│   └── src/               # Source code
└── vue3-vite/
    └── ...               # Similar structure
```

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start built server
npm start
```

## Architecture

The server handles three main operations:

1. **Template copying** - Copies template files to the target directory
2. **Variable replacement** - Replaces `${{key}}` placeholders with actual values
3. **Dependency installation** - Runs `npm install` silently

## Error Handling

- Validates template existence before starting
- Checks if target directory already exists
- Cleans up partial projects on failure
- Provides clear error messages

## License

MIT