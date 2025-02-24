import { execSync } from "child_process";
import path from "path";

interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
  files: string[];
  diffs?: Record<string, string>;
}

interface CommitDetails {
  hash: string;
  author: string;
  email: string;
  date: string;
  subject: string;
  body: string;
  files: string[];
  diff?: string;
}

class GitController {
  /**
   * Search git commit history for specific changes or commits
   * @param query - Search query to find relevant commits
   * @param maxResults - Maximum number of commits to return (default: 10)
   * @param includeDiffs - Whether to include the actual file changes
   * @returns Array of commit objects matching the query
   */
  async handleHistorySearch(
    query: string,
    maxResults: number = 10,
    includeDiffs: boolean = false
  ) {
    try {
      // Ensure the current working directory is used
      const cwd = process.cwd();
      console.log(`Running git command in directory: ${cwd}`);

      // Sanitize input to prevent command injection
      if (!/^[a-zA-Z0-9\s.\-_/:*]+$/.test(query)) {
        throw new Error(
          "Invalid search query: only alphanumeric characters, spaces, and basic punctuation allowed"
        );
      }

      // First, get a list of commits that match the query
      let gitCommand = `git log --pretty=format:"%H|%an|%ad|%s" --date=iso`;

      // If the query includes specific file paths, add them to the command
      if (query.includes("/")) {
        gitCommand += ` -- ${query}`;
      } else {
        // Otherwise, search in commit messages and author names
        gitCommand += ` --grep="${query}" --all-match -i`;
      }

      gitCommand += ` -n ${maxResults}`;

      console.log(`Executing git command: ${gitCommand}`);
      const commitOutput = execSync(gitCommand, {
        encoding: "utf8",
        cwd: cwd,
      });

      if (!commitOutput.trim()) {
        return {
          content: [{ type: "text", text: JSON.stringify([], null, 2) }],
          isError: false,
        };
      }

      // Parse the commit output into structured objects
      const commits: Commit[] = commitOutput.split("\n").map((line) => {
        const [hash, author, date, message] = line.split("|");
        return { hash, author, date, message, files: [] };
      });

      // If includeDiffs is true, get the file changes for each commit
      if (includeDiffs && commits.length > 0) {
        for (const commit of commits) {
          // Get the list of files changed in this commit
          const filesOutput = execSync(
            `git show --name-only --pretty=format:"" ${commit.hash}`,
            {
              encoding: "utf8",
              cwd: cwd,
            }
          );
          const files = filesOutput.trim().split("\n").filter(Boolean);
          commit.files = files;

          // Get the actual diff for each file (limit to avoid huge payloads)
          if (files.length > 0) {
            commit.diffs = {};
            for (const file of files.slice(0, 5)) {
              // Limit to first 5 files
              try {
                const diffOutput = execSync(
                  `git show ${commit.hash} -- "${file}"`,
                  {
                    encoding: "utf8",
                    cwd: cwd,
                  }
                );
                // Limit diff size to avoid huge payloads
                commit.diffs[file] =
                  diffOutput.slice(0, 2000) +
                  (diffOutput.length > 2000 ? "\n... (truncated)" : "");
              } catch (error) {
                // Skip files that might have been deleted or renamed
                console.error(
                  `Error getting diff for ${file} in commit ${commit.hash}`
                );
              }
            }
            if (files.length > 5) {
              commit.diffs._note = `Showing diffs for first 5 files out of ${files.length} total`;
            }
          }
        }
      }

      return {
        content: [{ type: "text", text: JSON.stringify(commits, null, 2) }],
        isError: false,
      };
    } catch (error: any) {
      console.error(`Error searching git history: ${error?.message}`);
      return {
        content: [
          {
            type: "text",
            text: `Error searching git history: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get details of a specific commit by its hash
   * @param commitHash - The commit hash to retrieve
   * @param includeDiff - Whether to include the actual file changes
   * @returns Commit details
   */
  async handleGetCommit(commitHash: string, includeDiff: boolean = true) {
    try {
      // Ensure the current working directory is used
      const cwd = process.cwd();

      // Validate commit hash format
      if (!/^[0-9a-f]{7,40}$/i.test(commitHash)) {
        throw new Error("Invalid commit hash format");
      }

      // Get commit details
      const commitDetails = execSync(
        `git show --pretty=format:"%H|%an|%ae|%ad|%s|%b" --date=iso ${commitHash}`,
        {
          encoding: "utf8",
          cwd: cwd,
        }
      );

      const lines = commitDetails.split("\n");
      const commitLine = lines[0];
      const [hash, author, email, date, subject, body] = commitLine.split("|");

      const result: CommitDetails = {
        hash,
        author,
        email,
        date,
        subject,
        body: body || "",
        files: [],
      };

      // Get the list of modified files
      const filesOutput = execSync(
        `git show --name-only --pretty=format:"" ${commitHash}`,
        {
          encoding: "utf8",
          cwd: cwd,
        }
      );
      result.files = filesOutput.trim().split("\n").filter(Boolean);

      // Include the actual diff if requested
      if (includeDiff) {
        // We'll limit the diff to prevent huge payloads
        const diffOutput = execSync(`git show ${commitHash}`, {
          encoding: "utf8",
          cwd: cwd,
        });
        result.diff =
          diffOutput.slice(0, 5000) +
          (diffOutput.length > 5000 ? "\n... (truncated)" : "");
      }

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        isError: false,
      };
    } catch (error: any) {
      console.error(`Error getting commit details: ${error?.message}`);
      return {
        content: [
          {
            type: "text",
            text: `Error getting commit details: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default GitController;
