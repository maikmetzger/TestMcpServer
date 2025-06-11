import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const PERFORM_PING: Tool = {
  name: "performPing",
  description: "Perform a ping using a confirmation token",
  inputSchema: {
    type: "object",
    properties: {
      token: { type: "string", description: "Token from confirmPing" },
    },
    required: ["token"],
  },
};
