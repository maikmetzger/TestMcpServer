import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const GET_COMMIT: Tool = {
  name: "getCommit",
  description:
    "Get detailed information about a specific git commit by its hash",
  inputSchema: {
    type: "object",
    properties: {
      commitHash: {
        type: "string",
        description: "The commit hash to retrieve details for",
      },
      includeDiff: {
        type: "boolean",
        description:
          "Whether to include the actual file changes (diff) in the result",
      },
    },
    required: ["commitHash"],
  },
};
