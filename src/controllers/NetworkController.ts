import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class NetworkController {
  async handleHttpRequest(url: string, method: string = "GET", body: string = "") {
    try {
      const options: any = { method };
      if (method !== "GET" && body) {
        options.body = body;
      }
      const response = await fetch(url, options);
      const text = await response.text();
      return {
        content: [
          { type: "text", text: JSON.stringify({ status: response.status, body: text }) },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error performing request: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }

  async handlePing(host: string) {
    try {
      const { stdout } = await execPromise(`ping -c 1 ${host}`);
      return {
        content: [
          { type: "text", text: stdout.trim() },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error pinging host: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }
}

export default NetworkController;
