import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const HTTP_REQUEST: Tool = {
  name: "httpRequest",
  description: "Perform a simple HTTP request",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "Request URL" },
      method: { type: "string", description: "HTTP method" },
      body: { type: "string", description: "Request body" },
    },
    required: ["url"],
  },
};
