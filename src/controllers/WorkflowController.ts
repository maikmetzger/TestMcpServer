import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Controller handling simple workflow-based operations where a first
 * action returns a token that must be confirmed later to retrieve the
 * result. The token store is generic so it can hold any workflow data.
 */
class WorkflowController {
  private tokenStore: Map<string, { type: string; data: any }> = new Map();

  private generateToken() {
    return Math.random().toString(36).slice(2);
  }

  async handlePerformHttpRequest(url: string, method: string = "GET", body: string = "") {
    try {
      const options: any = { method };
      if (method !== "GET" && body) {
        options.body = body;
      }
      const response = await fetch(url, options);
      const text = await response.text();
      const token = this.generateToken();
      this.tokenStore.set(token, { type: "httpRequest", data: { status: response.status, body: text } });
      return {
        content: [{ type: "text", text: token }],
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

  async handleConfirmHttpRequest(token: string) {
    const entry = this.tokenStore.get(token);
    if (!entry || entry.type !== "httpRequest") {
      return {
        content: [{ type: "text", text: "Invalid or expired token" }],
        isError: true,
      };
    }
    this.tokenStore.delete(token);
    return {
      content: [{ type: "text", text: JSON.stringify(entry.data) }],
      isError: false,
    };
  }

  async handlePerformPing(host: string) {
    try {
      const { stdout } = await execPromise(`ping -c 1 ${host}`);
      const token = this.generateToken();
      this.tokenStore.set(token, { type: "ping", data: stdout.trim() });
      return {
        content: [{ type: "text", text: token }],
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

  async handleConfirmPing(token: string) {
    const entry = this.tokenStore.get(token);
    if (!entry || entry.type !== "ping") {
      return {
        content: [{ type: "text", text: "Invalid or expired token" }],
        isError: true,
      };
    }
    this.tokenStore.delete(token);
    return {
      content: [{ type: "text", text: entry.data }],
      isError: false,
    };
  }
}

export default WorkflowController;
