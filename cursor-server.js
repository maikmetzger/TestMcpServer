#!/usr/bin/env node

// This is a minimal MCP server specifically for Cursor integration
// It removes all non-essential features to maximize compatibility

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getToolDefinitions, getToolHandler } from "./build/utils/toolRegistry.js";

// Disable console logging to avoid interference with the STDIO transport
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
console.log = () => {}; 
console.error = () => {};

// Only enable logging with DEBUG=true env var
if (process.env.DEBUG === 'true') {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}

// Simple error handler
process.on('uncaughtException', (err) => {
  if (process.env.DEBUG === 'true') {
    originalConsoleError('Uncaught exception:', err);
  }
});

process.on('unhandledRejection', (reason) => {
  if (process.env.DEBUG === 'true') {
    originalConsoleError('Unhandled rejection:', reason);
  }
});

async function main() {
  // Get tool definitions
  const toolDefs = getToolDefinitions();

  // Create MCP server with tools
  const server = new Server(
    {
      name: "mcp-server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: toolDefs,
      },
    }
  );

  // Register request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const flatToolsList = [
      ...toolDefs.MATHS_TOOLS,
      ...toolDefs.FILESYSTEM_TOOLS,
      ...toolDefs.IMAGE_TOOLS,
      ...toolDefs.SHOPWARE_TOOLS,
      ...toolDefs.BROWSER_TOOLS,
    ];
    
    return {
      tools: flatToolsList
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const handler = getToolHandler(request.params.name);
      if (!handler) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`,
            }
          ],
          isError: true
        };
      }
      return await handler(request.params.arguments);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error?.message || "Unknown error"}`,
          }
        ],
        isError: true
      };
    }
  });

  // Use standard STDIO transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  if (process.env.DEBUG === 'true') {
    originalConsoleError('Failed to start server:', err);
  }
  process.exit(1);
});