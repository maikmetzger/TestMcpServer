import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const IMAGE_RESIZE: Tool = {
  name: "imageResize",
  description: "Resize images while optionally converting format",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input image file",
      },
      width: {
        type: "number",
        description: "Width in pixels",
      },
      height: {
        type: "number",
        description:
          "Height in pixels (optional, maintains aspect ratio if omitted)",
      },
      outputPath: {
        type: "string",
        description: "Optional custom output path",
      },
      outputFormat: {
        type: "string",
        enum: ["webp", "avif", "png", "jpeg"],
        description: "Optional output format (webp, avif, png, jpeg)",
      },
      quality: {
        type: "number",
        minimum: 1,
        maximum: 100,
        description: "Compression quality for supported formats (1-100)",
      },
    },
    required: ["inputPath", "width"],
  },
};
