import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SEARCH_REPLACE: Tool = {
  name: "searchReplace",
  description: "Search and replace text in a file (returns preview)",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "File to modify" },
      searchValue: { type: "string", description: "Text to search" },
      replaceValue: { type: "string", description: "Replacement" },
    },
    required: ["path", "searchValue", "replaceValue"],
  },
};
