import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const READ: Tool = {
  name: "read",
  description: "Read the contents of a file at the specified path",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Absolute path to the file to read",
      },
      maxLines: {
        type: "number",
        description: "Maximum number of lines to read (default: 1000)",
      },
      startLine: {
        type: "number",
        description: "Line number to start reading from (0-indexed, default: 0)",
      }
    },
    required: ["path"],
  },
};