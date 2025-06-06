import { createHash } from "crypto";
import fs from "fs/promises";

class SecurityController {
  async handleHash(text: string | null = null, path: string | null = null, algorithm: string = "sha256") {
    try {
      const data = text ?? (path ? await fs.readFile(path) : "");
      const hash = createHash(algorithm).update(data).digest("hex");
      return {
        content: [{ type: "text", text: hash }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error generating hash: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }

  async handleChecksum(path: string, expected: string, algorithm: string = "sha256") {
    try {
      const data = await fs.readFile(path);
      const hash = createHash(algorithm).update(data).digest("hex");
      const match = hash === expected;
      return {
        content: [{ type: "text", text: match ? "valid" : "invalid" }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error verifying checksum: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }
}

export default SecurityController;
