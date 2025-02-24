import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const MODULO: Tool = {
  name: "modulo",
  description: "Calculate the remainder when dividing one number by another",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "Dividend (number to be divided)",
      },
      b: {
        type: "number",
        description: "Divisor (number to divide by)",
      },
    },
    required: ["a", "b"],
  },
};
