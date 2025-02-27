import { exec, spawn, execSync } from "child_process";
import { promisify } from "util";
import * as os from "os";
import * as path from "path";

const execPromise = promisify(exec);
const DOCKER_PATH = "/usr/local/bin/docker"; // Full path to docker binary

class ShopwareController {
  /**
   * Execute a command in a Shopware container
   */
  async handleContainerExec(container: string, command: string, cwd: string = "/var/www/html") {
    try {
      // Validate inputs
      if (!container || !command) {
        throw new Error("Container and command are required");
      }
      
      // Basic security check - prevent shell escaping
      if (/[;&|`$><\\]/.test(container) || /[;&|`$><\\]/.test(cwd)) {
        throw new Error("Invalid container name or working directory - no special characters allowed");
      }
      
      // Build the Docker command with absolute path
      const bashCommand = `cd ${cwd} && ${command}`;
      console.log(`Running: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`);
      
      // Create a Promise to handle the asynchronous process
      return new Promise<any>((resolve) => {
        try {
          // Use spawn to better handle stdout/stderr
          const dockerProcess = spawn(DOCKER_PATH, [
            'exec',
            '-i',
            container,
            '/bin/bash',
            '-c',
            bashCommand
          ], {
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 60000,
            windowsHide: true,
          });
          
          let stdoutData = '';
          let stderrData = '';
          
          dockerProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
          });
          
          dockerProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
          });
          
          dockerProcess.on('close', (code) => {
            if (code !== 0) {
              resolve({
                content: [
                  {
                    type: "text",
                    text: `Error (exit code ${code}): ${stderrData || "No error details"}\n\nCommand was: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                  },
                ],
                isError: true,
              });
            } else {
              resolve({
                content: [
                  {
                    type: "text",
                    text: stdoutData || "Command executed successfully with no output",
                  },
                ],
                isError: false,
              });
            }
          });
          
          dockerProcess.on('error', (err) => {
            resolve({
              content: [
                {
                  type: "text",
                  text: `Failed to execute Docker command: ${err.message}\n\nIf you're encountering permissions issues, you may need to run this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                },
              ],
              isError: true,
            });
          });
        } catch (err) {
          console.error("Error spawning Docker process:", err);
          resolve({
            content: [
              {
                type: "text",
                text: `Failed to execute Docker command: ${(err as Error).message}\n\nYou can try running this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
              },
            ],
            isError: true,
          });
        }
      });
      
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing command in container: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
  
  /**
   * Read logs from a Shopware container
   */
  async handleLogs(container: string, logType: string, lines: number = 100) {
    try {
      // Validate inputs
      if (!container || !logType) {
        throw new Error("Container and log type are required");
      }
      
      // Basic security check
      if (/[;&|`$><\\]/.test(container)) {
        throw new Error("Invalid container name - no special characters allowed");
      }
      
      // Map log type to file path
      let logPath: string;
      switch (logType) {
        case "dev":
          logPath = "/var/www/html/var/log/dev.log";
          break;
        case "prod":
          logPath = "/var/www/html/var/log/prod.log";
          break;
        case "error":
          logPath = "/var/www/html/var/log/error.log";
          break;
        case "all":
          logPath = "/var/www/html/var/log/*.log";
          break;
        default:
          throw new Error(`Unknown log type: ${logType}`);
      }
      
      // Create the command based on log type
      const bashCommand = logType === "all" 
        ? `find /var/www/html/var/log -name '*.log' -type f -exec tail -n ${lines} {} \\;`
        : `tail -n ${lines} ${logPath}`;
      
      console.log(`Running: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`);
      
      // Create a Promise to handle the asynchronous process
      return new Promise<any>((resolve) => {
        try {
          // Use spawn to better handle stdout/stderr
          const dockerProcess = spawn(DOCKER_PATH, [
            'exec',
            '-i',
            container,
            '/bin/bash',
            '-c',
            bashCommand
          ], {
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 30000,
            windowsHide: true,
          });
          
          let stdoutData = '';
          let stderrData = '';
          
          dockerProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
          });
          
          dockerProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
          });
          
          dockerProcess.on('close', (code) => {
            if (code !== 0) {
              resolve({
                content: [
                  {
                    type: "text",
                    text: `Error reading logs (exit code ${code}): ${stderrData || "No error details"}\n\nCommand was: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                  },
                ],
                isError: true,
              });
            } else {
              resolve({
                content: [
                  {
                    type: "text",
                    text: stdoutData || "No log entries found",
                  },
                ],
                isError: false,
              });
            }
          });
          
          dockerProcess.on('error', (err) => {
            resolve({
              content: [
                {
                  type: "text",
                  text: `Failed to execute Docker command: ${err.message}\n\nIf you're encountering permissions issues, try running this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                },
              ],
              isError: true,
            });
          });
        } catch (err) {
          console.error("Error spawning Docker process:", err);
          resolve({
            content: [
              {
                type: "text",
                text: `Failed to execute Docker command: ${(err as Error).message}\n\nYou can try running this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
              },
            ],
            isError: true,
          });
        }
      });
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading logs: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
  
  /**
   * Build Shopware assets or clear cache
   */
  async handleBuild(container: string, operation: string, environment: string = "prod") {
    try {
      // Validate inputs
      if (!container || !operation) {
        throw new Error("Container and operation are required");
      }
      
      // Basic security check
      if (/[;&|`$><\\]/.test(container)) {
        throw new Error("Invalid container name - no special characters allowed");
      }
      
      // Map operation to command
      let command: string;
      switch (operation) {
        case "build":
          command = "bin/build.sh";
          break;
        case "cache:clear":
          command = `bin/console cache:clear --env=${environment}`;
          break;
        case "cache:warmup":
          command = `bin/console cache:warmup --env=${environment}`;
          break;
        case "theme:compile":
          command = `bin/console theme:compile --env=${environment}`;
          break;
        case "migrations:migrate":
        case "database:migrate":
          command = `bin/console database:migrate --all --env=${environment}`;
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      // Build the docker command
      const bashCommand = `cd /var/www/html && ${command}`;
      console.log(`Running: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`);
      
      // Create a Promise to handle the asynchronous process
      return new Promise<any>((resolve) => {
        try {
          // Use spawn to better handle stdout/stderr
          const dockerProcess = spawn(DOCKER_PATH, [
            'exec',
            '-i',
            container,
            '/bin/bash',
            '-c',
            bashCommand
          ], {
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 300000, // 5 minute timeout for builds
            windowsHide: true,
          });
          
          let stdoutData = '';
          let stderrData = '';
          
          dockerProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
          });
          
          dockerProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
          });
          
          dockerProcess.on('close', (code) => {
            if (code !== 0) {
              resolve({
                content: [
                  {
                    type: "text",
                    text: `Error performing operation (exit code ${code}): ${stderrData || "No error details"}\n\nCommand was: ${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                  },
                ],
                isError: true,
              });
            } else {
              resolve({
                content: [
                  {
                    type: "text",
                    text: stdoutData || "Operation completed successfully with no output",
                  },
                ],
                isError: false,
              });
            }
          });
          
          dockerProcess.on('error', (err) => {
            resolve({
              content: [
                {
                  type: "text",
                  text: `Failed to execute Docker command: ${err.message}\n\nIf you're encountering permissions issues, try running this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
                },
              ],
              isError: true,
            });
          });
        } catch (err) {
          console.error("Error spawning Docker process:", err);
          resolve({
            content: [
              {
                type: "text",
                text: `Failed to execute Docker command: ${(err as Error).message}\n\nYou can try running this command manually:\n${DOCKER_PATH} exec -i ${container} /bin/bash -c "${bashCommand}"`,
              },
            ],
            isError: true,
          });
        }
      });
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error performing operation: ${
              error?.message || "Unknown error"
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default ShopwareController;