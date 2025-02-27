import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const SEARCH: Tool = {
  name: "search",
  description: "Search for files in a directory by name or content pattern (does NOT return file contents)",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Absolute path to the directory to search in",
      },
      pattern: {
        type: "string",
        description: "Search pattern (glob pattern for filenames like '*.js' or regex for content like 'function')",
      },
      searchType: {
        type: "string",
        enum: ["filename", "content"],
        description: "Type of search to perform: 'filename' to match file names only, 'content' to find files containing text pattern",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results to return (default: 20)",
      },
    },
    required: ["path", "pattern", "searchType"],
  },
};