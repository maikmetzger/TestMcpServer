import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const AVERAGE: Tool = {
  name: "average",
  description: "Calculate the arithmetic mean of two numbers",
  inputSchema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number",
      },
      b: {
        type: "number",
        description: "Second number",
      },
    },
    required: ["a", "b"],
  },
};
