
import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import NetworkController from "./NetworkController.js";
const execPromise = promisify(exec);
const tokenStore = new Map<string, string>();
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

  async handlePerformPing(token: string) {
    const host = tokenStore.get(token);
    if (!host) {
      return {
        content: [{ type: "text", text: "Invalid or expired token" }],
        isError: true,
      };
    }
    tokenStore.delete(token);
    const network = new NetworkController();
    return await network.handlePing(host);
  }

  async handleConfirmPing(host: string) {
    const token = randomUUID();
    tokenStore.set(token, host);
    return { content: [{ type: "text", text: token }], isError: false };
  }

}

export default WorkflowController;