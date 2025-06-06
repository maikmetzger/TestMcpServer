import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const HASH: Tool = {
  name: "hash",
  description: "Generate hash for text or file",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "Text to hash" },
      path: { type: "string", description: "File path" },
      algorithm: { type: "string", description: "Hash algorithm" },
    },
    required: [],
  },
};
