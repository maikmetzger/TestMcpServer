import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const MULTIPLICATION: Tool = {
  name: "multiplication",
  description: "Multiply two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to multiply",
      },

      b: {
        type: "number",
        description: "Second number to multiply",
      },
    },
    required: ["a", "b"],
  },
};
