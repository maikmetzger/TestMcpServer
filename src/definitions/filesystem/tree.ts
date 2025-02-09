import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TREE: Tool = {
  name: "tree",
  description: "Get the tree of a directory",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The path to get the tree of",
      },
    },
    required: ["path"],
  },
};
