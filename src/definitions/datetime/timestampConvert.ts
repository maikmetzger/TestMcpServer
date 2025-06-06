import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TIMESTAMP_CONVERT: Tool = {
  name: "timestampConvert",
  description: "Convert between timestamp and human date",
  inputSchema: {
    type: "object",
    properties: {
      value: { type: "string", description: "Date string or timestamp" },
    },
    required: ["value"],
  },
};
