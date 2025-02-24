import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SQUARE_ROOT: Tool = {
  name: "squareRoot",
  description: "Calculate the square root of a number",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "Number to calculate square root of",
      },
    },
    required: ["a"],
  },
};
