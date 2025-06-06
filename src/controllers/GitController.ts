import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class GitController {
  async handleCommitHistory(limit: number = 5) {
    try {
      const { stdout } = await execPromise(
        `git log -n ${limit} --pretty=format:%h%x20%s`
      );
      return {
        content: [
          {
            type: "text",
            text: stdout.trim() || "No commits found",
          },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting commit history: ${error?.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleDiff(fromRef: string = "HEAD", toRef: string = "") {
    try {
      const cmd = toRef ? `git diff ${fromRef} ${toRef}` : `git diff ${fromRef}`;
      const { stdout } = await execPromise(cmd);
      return {
        content: [
          {
            type: "text",
            text: stdout.trim() || "No diff",
          },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting diff: ${error?.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default GitController;
