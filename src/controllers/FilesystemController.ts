import fs from "fs/promises";
import { extname, isAbsolute, normalize, resolve, join, relative } from "path";
import { glob } from "glob";
import { createReadStream } from "fs";
import { createInterface } from "readline";

class FilesystemController {
  private validatePath(dirPath: string): string {
    // Convert relative paths to absolute using current working directory
    const absolutePath = isAbsolute(dirPath)
      ? dirPath
      : resolve(process.cwd(), dirPath);

    // Normalize the path to handle both Windows and Unix-style paths
    return normalize(absolutePath);
  }
  async handleSearch(path: string, pattern: string, searchType: string, maxResults: number = 20) {
    try {
      const normalizedPath = this.validatePath(path);

      // Verify directory exists and is accessible
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

      let results: { path: string; match?: string; line?: number }[] = [];

      // Search by filename using glob pattern
      if (searchType === "filename") {
        // Use glob to find files matching the pattern
        const files = await glob(`${normalizedPath}/**/${pattern}`, {
          nodir: true,
          dot: false,
          follow: false,
        });

        results = files.map(file => ({
          path: file,
        })).slice(0, maxResults);
      } 
      // Search file contents
      else if (searchType === "content") {
        const regex = new RegExp(pattern, 'i');
        
        // Get all files in the directory and subdirectories
        const allFiles = await glob(`${normalizedPath}/**/*`, {
          nodir: true,
          dot: false,
          follow: false,
        });
        
        // Filter binary files and large files
        const textFiles: string[] = [];
        
        for (const file of allFiles) {
          try {
            const stats = await fs.stat(file);
            
            // Skip large files (> 5MB)
            if (stats.size >= 5 * 1024 * 1024) continue;
            
            // Skip binary files
            const extension = extname(file).toLowerCase();
            const binaryExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz', '.exe', '.dll', '.so'];
            if (binaryExtensions.includes(extension)) continue;
            
            textFiles.push(file);
          } catch (err) {
            // Skip files we can't access
            continue;
          }
        }
        
        // Search text in each file
        for (const file of textFiles) {
          if (!file || results.length >= maxResults) break;
          
          try {
            const fileStream = createReadStream(file, { encoding: 'utf8' });
            const rl = createInterface({
              input: fileStream,
              crlfDelay: Infinity
            });
            
            let lineNumber = 0;
            for await (const line of rl) {
              lineNumber++;
              if (regex.test(line)) {
                // Only store file paths and line numbers, not content
                results.push({
                  path: file,
                  line: lineNumber
                });
                
                if (results.length >= maxResults) {
                  rl.close();
                  break;
                }
              }
            }
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
          }
        }
      } else {
        throw new Error(`Invalid search type: ${searchType}. Must be 'filename' or 'content'`);
      }

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            results,
            count: results.length,
            hasMore: results.length >= maxResults,
            searchPath: normalizedPath,
            searchPattern: pattern,
            searchType,
            note: "This tool only returns file paths and line numbers, not file contents. Use a file reading tool to view contents."
          }, null, 2) 
        }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching directory: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
  
  async handleTree(dirPath: string) {
    try {
      const normalizedPath = this.validatePath(dirPath);

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
              const filePath = join(currentPath, file);
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
              const fullPath = join(currentPath, file);
              try {
                const stats = await fs.stat(fullPath);
                const isDir = stats.isDirectory();
                const relativePath = relative(normalizedPath, fullPath);

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
