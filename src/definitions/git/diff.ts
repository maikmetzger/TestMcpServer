import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const DIFF: Tool = {
  name: "diff",
  description: "Show git diff between refs or working tree",
  inputSchema: {
    type: "object",
    properties: {
      fromRef: { type: "string", description: "From revision" },
      toRef: { type: "string", description: "To revision" },
    },
    required: [],
  },
};
