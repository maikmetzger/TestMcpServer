import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const IMAGE_CONVERSION: Tool = {
  name: "imageConversion",
  description:
    "Convert images between formats (PNG/JPG to WebP/AVIF) with compression",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input image file",
      },
      outputFormat: {
        type: "string",
        enum: ["webp", "avif", "png", "jpeg"],
        description: "Output format (webp, avif, png, jpeg)",
      },
      quality: {
        type: "number",
        minimum: 1,
        maximum: 100,
        description: "Compression quality (1-100)",
      },
      outputPath: {
        type: "string",
        description: "Optional custom output path",
      },
    },
    required: ["inputPath", "outputFormat", "quality"],
  },
};
