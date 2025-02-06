import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ADDITION: Tool = {
  name: "addition",
  description: "Add two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to add",
      },
      b: {
        type: "number",
        description: "Second number to add",
      },
    },
    required: ["a", "b"],
  },
};
