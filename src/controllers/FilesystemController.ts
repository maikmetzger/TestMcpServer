import fs from "fs/promises";
import path from "path";

class FilesystemController {
  async handleTree(dirPath: string) {
    try {
      // Convert relative paths to absolute using current working directory
      const absolutePath = path.isAbsolute(dirPath)
        ? dirPath
        : path.resolve(process.cwd(), dirPath);

      // Normalize the path to handle both Windows and Unix-style paths
      const normalizedPath = path.normalize(absolutePath);

      // Check if path exists
      try {
        const stats = await fs.stat(normalizedPath);
        if (!stats.isDirectory()) {
          throw new Error(`Path is not a directory: ${normalizedPath}`);
        }
        await fs.access(normalizedPath);
      } catch (error: any) {
        throw new Error(
          `Cannot access directory: ${normalizedPath} - ${
            error?.message || "Unknown error"
          }`
        );
      }

      // Recursive function to build tree
      async function buildTree(
        currentPath: string,
        depth: number = 0
      ): Promise<any[]> {
        if (depth >= 10) return []; // Max depth of 10 to prevent infinite recursion

        try {
          const files = await fs.readdir(currentPath);

          // Filter out unwanted files/directories
          const filteredFiles = files.filter(
            (file) => !file.startsWith(".") || file === ".gitignore"
          );

          // Get file stats for all files
          const fileStats = await Promise.all(
            filteredFiles.map(async (file) => {
              const filePath = path.join(currentPath, file);
              const stats = await fs.stat(filePath);
              return { file, isDirectory: stats.isDirectory() };
            })
          );

          // Sort files: directories first, then alphabetically
          const sortedStats = [...fileStats].sort(
            (
              a: { file: string; isDirectory: boolean },
              b: { file: string; isDirectory: boolean }
            ) => {
              if (a.isDirectory && !b.isDirectory) return -1;
              if (!a.isDirectory && b.isDirectory) return 1;
              return a.file.localeCompare(b.file);
            }
          );
          const sortedFiles = sortedStats.map((f: { file: string }) => f.file);

          const tree = await Promise.all(
            sortedFiles.map(async (file) => {
              const fullPath = path.join(currentPath, file);
              try {
                const stats = await fs.stat(fullPath);
                const isDir = stats.isDirectory();
                const relativePath = path.relative(normalizedPath, fullPath);

                return {
                  name: file,
                  path: relativePath,
                  type: isDir ? "directory" : "file",
                  size: stats.size,
                  children: isDir
                    ? await buildTree(fullPath, depth + 1)
                    : undefined,
                };
              } catch (error: any) {
                console.warn(
                  `Error processing ${fullPath}: ${
                    error?.message || "Unknown error"
                  }`
                );
                return null;
              }
            })
          );

          return tree.filter(Boolean); // Remove any null entries from errors
        } catch (error: any) {
          console.warn(
            `Error reading directory ${currentPath}: ${
              error?.message || "Unknown error"
            }`
          );
          return [];
        }
      }

      const tree = await buildTree(normalizedPath);
      return {
        content: [{ type: "text", text: JSON.stringify(tree, null, 2) }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading directory: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default FilesystemController;
