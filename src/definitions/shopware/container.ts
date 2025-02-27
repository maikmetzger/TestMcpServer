import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const CONTAINER_EXEC: Tool = {
  name: "shopwareExec",
  description: "Execute commands in a Shopware container",
  inputSchema: {
    type: "object",
    properties: {
      container: {
        type: "string",
        description: "Docker container name or ID",
      },
      command: {
        type: "string",
        description: "Command to execute inside the container (e.g., 'bin/console cache:clear')",
      },
      cwd: {
        type: "string",
        description: "Working directory inside the container (default: /var/www/html)",
      }
    },
    required: ["container", "command"],
  },
};