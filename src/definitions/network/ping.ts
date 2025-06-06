import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const PING: Tool = {
  name: "ping",
  description: "Ping a host to check connectivity",
  inputSchema: {
    type: "object",
    properties: {
      host: { type: "string", description: "Host to ping" },
    },
    required: ["host"],
  },
};
