import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const COMMIT_HISTORY: Tool = {
  name: "commitHistory",
  description: "Get recent git commit messages",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Number of commits to retrieve",
      },
    },
    required: [],
  },
};
