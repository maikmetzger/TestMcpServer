import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CHECKSUM: Tool = {
  name: "checksum",
  description: "Verify file checksum",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "File path" },
      expected: { type: "string", description: "Expected checksum" },
      algorithm: { type: "string", description: "Hash algorithm" },
    },
    required: ["path", "expected"],
  },
};
