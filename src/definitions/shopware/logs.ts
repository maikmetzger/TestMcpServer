import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const LOGS: Tool = {
  name: "shopwareLogs",
  description: "Read logs from a Shopware container",
  inputSchema: {
    type: "object",
    properties: {
      container: {
        type: "string",
        description: "Docker container name or ID",
      },
      logType: {
        type: "string",
        description: "Type of log to read (e.g., 'dev', 'prod', 'error', 'all')",
        enum: ["dev", "prod", "error", "all"],
      },
      lines: {
        type: "number",
        description: "Number of lines to retrieve (default: 100)",
      }
    },
    required: ["container", "logType"],
  },
};