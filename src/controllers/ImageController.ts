import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { constants } from "fs";

class ImageController {
  private async validateImageFile(inputPath: string): Promise<void> {
    try {
      // Check if file exists
      await fs.access(inputPath, constants.R_OK);

      // Check if file is a valid image
      const metadata = await sharp(inputPath).metadata();
      if (!metadata.format) {
        throw new Error("Invalid image file or unsupported format");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Input file is missing")
      ) {
        throw new Error(`File not found or is not accessible: ${inputPath}`);
      } else if (
        error instanceof Error &&
        error.message.includes("unsupported image format")
      ) {
        throw new Error(`Unsupported image format for file: ${inputPath}`);
      }
      throw error;
    }
  }

  private validateQuality(quality: number): void {
    if (typeof quality !== "number") {
      throw new Error("Quality must be a number");
    }
    if (quality < 1 || quality > 100) {
      throw new Error("Quality must be between 1 and 100");
    }
  }

  private async ensureOutputDirectoryExists(outputPath: string): Promise<void> {
    const outputDir = path.dirname(outputPath);
    try {
      await fs.access(outputDir, constants.W_OK);
    } catch (error) {
      // Directory doesn't exist or isn't writable, attempt to create it
      try {
        await fs.mkdir(outputDir, { recursive: true });
      } catch (mkdirError) {
        throw new Error(`Cannot create output directory: ${outputDir}`);
      }
    }
  }

  async handleImageConversion(
    inputPath: string,
    outputFormat: "webp" | "avif" | "png" | "jpeg",
    quality: number,
    outputPath?: string
  ) {
    try {
      // Validate input parameters
      if (!inputPath) {
        throw new Error("Input path is required");
      }
      if (!outputFormat) {
        throw new Error("Output format is required");
      }

      this.validateQuality(quality);
      await this.validateImageFile(inputPath);

      // Determine output path if not provided
      if (!outputPath) {
        const parsedPath = path.parse(inputPath);
        outputPath = path.join(
          parsedPath.dir,
          `${parsedPath.name}.${outputFormat}`
        );
      }

      await this.ensureOutputDirectoryExists(outputPath);

      // Process image using sharp
      const imageBuffer = await sharp(inputPath)
        .toFormat(outputFormat, { quality })
        .toBuffer();

      // Save the processed image
      await fs.writeFile(outputPath, imageBuffer);

      // Get file sizes for comparison
      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);
      const compressionRatio = (
        (1 - outputStats.size / inputStats.size) *
        100
      ).toFixed(2);

      return {
        content: [
          {
            type: "text",
            text: `Image successfully converted to ${outputFormat}!
Original size: ${(inputStats.size / 1024).toFixed(2)} KB
New size: ${(outputStats.size / 1024).toFixed(2)} KB
Reduction: ${compressionRatio}%
Saved to: ${outputPath}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error converting image: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleImageResize(
    inputPath: string,
    width: number,
    height?: number,
    outputPath?: string,
    outputFormat?: "webp" | "avif" | "png" | "jpeg",
    quality?: number
  ) {
    try {
      // Validate input parameters
      if (!inputPath) {
        throw new Error("Input path is required");
      }
      if (!width || typeof width !== "number" || width <= 0) {
        throw new Error("Width must be a positive number");
      }
      if (height !== undefined && (typeof height !== "number" || height <= 0)) {
        throw new Error("Height must be a positive number if provided");
      }
      if (quality !== undefined) {
        this.validateQuality(quality);
      }

      await this.validateImageFile(inputPath);

      // Determine output path if not provided
      if (!outputPath) {
        const parsedPath = path.parse(inputPath);
        const extension = outputFormat || parsedPath.ext.substring(1);
        outputPath = path.join(
          parsedPath.dir,
          `${parsedPath.name}_${width}x${height || "auto"}.${extension}`
        );
      }

      await this.ensureOutputDirectoryExists(outputPath);

      // Set up the Sharp pipeline
      let pipeline = sharp(inputPath).resize(width, height);

      // Apply format if specified
      if (outputFormat) {
        pipeline = pipeline.toFormat(outputFormat, { quality: quality || 80 });
      }

      // Process and save the image
      const imageBuffer = await pipeline.toBuffer();
      await fs.writeFile(outputPath, imageBuffer);

      // Get file sizes for comparison
      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);
      const sizeReductionPercent = (
        (1 - outputStats.size / inputStats.size) *
        100
      ).toFixed(2);

      return {
        content: [
          {
            type: "text",
            text: `Image successfully resized!
Original size: ${(inputStats.size / 1024).toFixed(2)} KB
New size: ${(outputStats.size / 1024).toFixed(2)} KB
Size reduction: ${sizeReductionPercent}%
Dimensions: ${width}x${height || "auto"}
Saved to: ${outputPath}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error resizing image: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default ImageController;
