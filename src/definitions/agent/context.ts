import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CONTEXT: Tool = {
  name: "context",
  description: "Analyzes the current workspace state for a specific task",
  inputSchema: {
    type: "object",
    properties: {
      task: {
        type: "string",
        description: "Task to analyze",
      },
      path: {
        type: "string",
        description: "Path to analyze (file or directory)",
      },
    },
    required: ["task", "path"],
  },
};
