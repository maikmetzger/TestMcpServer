import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CONFIRM_PING: Tool = {
  name: "confirmPing",
  description: "Confirm a host to ping and receive a token",
  inputSchema: {
    type: "object",
    properties: {
      host: { type: "string", description: "Host to ping" },
    },
    required: ["host"],
  },
};
