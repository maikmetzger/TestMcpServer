import { getToolHandler } from '../../src/utils/toolRegistry.js';

/**
 * Helper to simulate MCP tool calls for testing
 * This simulates the actual request flow that happens in the MCP server
 */
export async function simulateMcpToolCall(toolName: string, args: any) {
  const handler = getToolHandler(toolName);
  
  if (!handler) {
    throw new Error(`Tool '${toolName}' not found`);
  }
  
  return await handler(args);
}

/**
 * Create a valid MCP request object for testing
 */
export function createMcpToolRequest(toolName: string, args: any) {
  return {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 10000),
    method: 'call_tool',
    params: {
      name: toolName,
      arguments: args
    }
  };
}