import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SCHEDULE: Tool = {
  name: "schedule",
  description: "Run a command after a delay (max 5 seconds)",
  inputSchema: {
    type: "object",
    properties: {
      command: { type: "string", description: "Command to run" },
      delaySeconds: { type: "number", description: "Delay in seconds" },
    },
    required: ["command", "delaySeconds"],
  },
};
