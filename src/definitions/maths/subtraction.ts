import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SUBTRACTION: Tool = {
  name: "subtraction",
  description: "Subtract two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to subtract",
      },

      b: {
        type: "number",
        description: "Second number to subtract",
      },
    },
    required: ["a", "b"],
  },
};
