import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const POWER: Tool = {
  name: "power",
  description: "Raise a number to the power of another number",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "Base number",
      },
      b: {
        type: "number",
        description: "Exponent",
      },
    },
    required: ["a", "b"],
  },
};
