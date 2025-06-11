import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CONFIRM_HTTP_REQUEST: Tool = {
  name: "confirmHttpRequest",
  description: "Request confirmation before performing an HTTP request. Returns a token to use with performHttpRequest.",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "URL to request" },
      method: { type: "string", description: "HTTP method", default: "GET" },
      body: { type: "string", description: "Request body", default: "" },
    },
    required: ["url"],
  },
};
