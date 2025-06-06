import fs from "fs/promises";
import { extname } from "path";

class TextController {
  async handleWordCount(path: string | null = null, text: string | null = null) {
    try {
      let content = text ?? "";
      if (path) {
        const extension = extname(path).toLowerCase();
        const binaryExtensions = [
          ".pdf",
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".zip",
          ".tar",
          ".gz",
          ".exe",
          ".dll",
          ".so",
        ];
        if (binaryExtensions.includes(extension)) {
          throw new Error("Cannot read binary file");
        }
        content = await fs.readFile(path, "utf8");
      }
      const lines = content.split(/\r?\n/).length;
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const characters = content.length;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ lines, words, characters }),
          },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error counting words: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }

  async handleSearchReplace(path: string, searchValue: string, replaceValue: string) {
    try {
      const content = await fs.readFile(path, "utf8");
      const regex = new RegExp(searchValue, "g");
      const replaced = content.replace(regex, replaceValue);
      return {
        content: [
          {
            type: "text",
            text: replaced,
          },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error performing search/replace: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }
}

export default TextController;
