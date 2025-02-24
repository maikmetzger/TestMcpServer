import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const HISTORY_SEARCH: Tool = {
  name: "historySearch",
  description:
    "Search git commit history for specific changes or commits in the repository",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Search query to find relevant commits (can be text in commit messages, file paths, or author names)",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of commits to return (default: 10)",
      },
      includeDiffs: {
        type: "boolean",
        description:
          "Whether to include the actual file changes (diffs) in the result",
      },
    },
    required: ["query"],
  },
};
