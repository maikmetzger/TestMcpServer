import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const STANDARD_DEVIATION: Tool = {
  name: "standardDeviation",
  description: "Calculate the standard deviation of an array of numbers. Returns both the population and sample standard deviation.",
  inputSchema: {
    type: "object",
    properties: {
      values: {
        type: "array",
        items: {
          type: "number"
        },
        description: "Array of numbers to calculate standard deviation of",
      },
      type: {
        type: "string",
        enum: ["population", "sample"],
        description: "Type of standard deviation to calculate. 'population' is for the entire dataset, 'sample' is for a sample of a larger population.",
        default: "population"
      }
    },
    required: ["values"]
  },
};