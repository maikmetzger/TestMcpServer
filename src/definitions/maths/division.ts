import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const DIVISION: Tool = {
  name: "division",
  description: "Divide two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number to divide",
      },

      b: {
        type: "number",
        description: "Second number to divide",
      },
    },
    required: ["a", "b"],
  },
};
