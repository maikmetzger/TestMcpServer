import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const LOGARITHM: Tool = {
  name: "logarithm",
  description: "Calculate the logarithm of a number with a specified base",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "Number to calculate logarithm of",
      },
      b: {
        type: "number",
        description: "Base of the logarithm",
      },
    },
    required: ["a", "b"],
  },
};
