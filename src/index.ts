import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import ToolController from "./controllers/ToolController.js";
import { getToolDefinitions, getToolHandler } from "./utils/toolRegistry.js";
import http from "node:http";
import url from "node:url";

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

const toolController = new ToolController();

// Register request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  // No console.log here to avoid interfering with STDIO transport

  // Merge all tool arrays into one flat array for the response
  const flatToolsList = [
    ...toolDefs.MATHS_TOOLS,
    ...toolDefs.FILESYSTEM_TOOLS,
    ...toolDefs.IMAGE_TOOLS,
    ...toolDefs.SHOPWARE_TOOLS,
    ...toolDefs.GIT_TOOLS,
    ...toolDefs.TEXT_TOOLS,
    ...toolDefs.NETWORK_TOOLS,
    ...toolDefs.DATETIME_TOOLS,
    ...toolDefs.SECURITY_TOOLS,
    ...toolDefs.WORKFLOW_TOOLS,
  ];

  // Just return the tools without logging
  return {
    tools: flatToolsList,
  };
});

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

// Check if we should use HTTP+SSE or STDIO
const useSSE = process.argv.includes("--sse");

if (useSSE) {
  // Create and start HTTP server
  const PORT = 10021;
  const sessions = new Map();

  const httpServer = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || "", true);
    const { pathname, query } = parsedUrl;

    console.log(`Received request: ${req.method} ${pathname}`);

    // Handle SSE connection
    if (req.method === "GET" && pathname === "/sse") {
      console.log("New SSE connection");
      const sseTransport = new SSEServerTransport("/message", res);

      // Store the session
      const mcpServer = new Server(
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

      // Register the same handlers
      mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
        // Merge all tool arrays into one flat array for the response
  const flatToolsList = [
    ...toolDefs.MATHS_TOOLS,
    ...toolDefs.FILESYSTEM_TOOLS,
    ...toolDefs.IMAGE_TOOLS,
    ...toolDefs.SHOPWARE_TOOLS,
    ...toolDefs.GIT_TOOLS,
    ...toolDefs.TEXT_TOOLS,
    ...toolDefs.NETWORK_TOOLS,
    ...toolDefs.DATETIME_TOOLS,
    ...toolDefs.SECURITY_TOOLS,
    ...toolDefs.WORKFLOW_TOOLS,
  ];

        return {
          tools: flatToolsList,
        };
      });

      mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
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

      // Connect the MCP server to the SSE transport
      await mcpServer.connect(sseTransport);

      // Store the session using the transport's session ID
      sessions.set(sseTransport.sessionId, {
        transport: sseTransport,
        server: mcpServer,
      });

      // When client disconnects, clean up
      res.on("close", () => {
        console.log(`SSE connection closed: ${sseTransport.sessionId}`);
        sessions.delete(sseTransport.sessionId);
      });
    }
    // Handle incoming messages
    else if (req.method === "POST" && pathname === "/message") {
      const sessionId = query.sessionId as string;

      if (!sessionId) {
        console.log("Error: No session ID provided in POST request");
        res.writeHead(400).end("No session ID provided");
        return;
      }

      console.log(`Handling message for session ID: ${sessionId}`);
      const session = sessions.get(sessionId);

      if (!session) {
        console.log(`Error: Session not found for ID: ${sessionId}`);
        console.log(
          `Available sessions: ${Array.from(sessions.keys()).join(", ")}`
        );
        res.writeHead(404).end("Session not found");
        return;
      }

      try {
        await session.transport.handlePostMessage(req, res);
      } catch (error: any) {
        console.error(
          `Error handling message for session ${sessionId}:`,
          error
        );
        res
          .writeHead(500)
          .end(`Server error: ${error.message || "Unknown error"}`);
      }
    }
    // Handle other requests
    else {
      res.writeHead(404).end("Not found");
    }
  });

  // Start HTTP server
  httpServer.listen(PORT, () => {
    console.log(
      `MCP Server running with SSE transport on http://localhost:${PORT}/sse`
    );
    console.log(
      `Configure Cursor to connect to this URL instead of using command mode`
    );
  });
} else {
  // Use standard STDIO transport (default)
  // No console.log to avoid interfering with STDIO
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
