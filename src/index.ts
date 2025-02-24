import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import ToolController from "./controllers/ToolController.js";
import { getToolDefinitions, getToolHandler } from "./utils/toolRegistry.js";

const server = new Server(
  {
    name: "mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: getToolDefinitions(),
    },
  }
);

const toolController = new ToolController();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    ...getToolDefinitions().MATHS_TOOLS,
    ...getToolDefinitions().FILESYSTEM_TOOLS,
    ...getToolDefinitions().IMAGE_TOOLS,
    ...getToolDefinitions().GIT_TOOLS,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const handler = getToolHandler(request.params.name);

    if (!handler) {
      return toolController.getUnknownToolResponse(request.params.name);
    }

    return await handler(request.params.arguments);
  } catch (error) {
    return toolController.getErrorResponse(error);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
