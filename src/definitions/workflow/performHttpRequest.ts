import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const PERFORM_HTTP_REQUEST: Tool = {
  name: "performHttpRequest",
  description: "Perform HTTP request using a confirmation token from confirmHttpRequest.",
  inputSchema: {
    type: "object",
    properties: {
      token: { type: "string", description: "Confirmation token" },
    },
    required: ["token"],
  },
};
