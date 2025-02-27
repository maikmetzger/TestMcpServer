import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const BUILD: Tool = {
  name: "shopwareBuild",
  description: "Build Shopware assets or clear cache in a container",
  inputSchema: {
    type: "object",
    properties: {
      container: {
        type: "string",
        description: "Docker container name or ID",
      },
      operation: {
        type: "string",
        description: "Build operation to perform",
        enum: ["build", "cache:clear", "cache:warmup", "theme:compile", "migrations:migrate", "database:migrate"],
      },
      environment: {
        type: "string",
        description: "Environment to use (default: prod)",
        enum: ["prod", "dev"],
      }
    },
    required: ["container", "operation"],
  },
};