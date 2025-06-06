import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const WORD_COUNT: Tool = {
  name: "wordCount",
  description: "Count words, lines, and characters in text or file",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Path to text file" },
      text: { type: "string", description: "Text to count" },
    },
    required: [],
  },
};
