#!/usr/bin/env node

// This script tests the tools registration from the MCP server
// It doesn't rely on STDIO which can be problematic for debugging

import { getToolDefinitions } from './build/utils/toolRegistry.js';

// Get the tools
const tools = getToolDefinitions();

// Count total tools
const mathsTools = tools.MATHS_TOOLS.length;
const filesystemTools = tools.FILESYSTEM_TOOLS.length;
const imageTools = tools.IMAGE_TOOLS.length;
const shopwareTools = tools.SHOPWARE_TOOLS.length;
const browserTools = tools.BROWSER_TOOLS.length;

const totalTools = mathsTools + filesystemTools + imageTools + shopwareTools + browserTools;

console.log("Tool Registration Test");
console.log("=====================\n");
console.log(`Total Tools Registered: ${totalTools}`);
console.log(`- Math Tools: ${mathsTools}`);
console.log(`- Filesystem Tools: ${filesystemTools}`);
console.log(`- Image Tools: ${imageTools}`);
console.log(`- Shopware Tools: ${shopwareTools}`);
console.log(`- Browser Tools: ${browserTools}`);
console.log("\nTool Listings:");

// List all tools
function listTools(toolArray, category) {
  console.log(`\n${category} Tools:`);
  toolArray.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description.substr(0, 60)}${tool.description.length > 60 ? '...' : ''}`);
  });
}

listTools(tools.MATHS_TOOLS, "Math");
listTools(tools.FILESYSTEM_TOOLS, "Filesystem");
listTools(tools.IMAGE_TOOLS, "Image");
listTools(tools.BROWSER_TOOLS, "Browser");