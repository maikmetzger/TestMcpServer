import { randomUUID } from "crypto";
import NetworkController from "./NetworkController.js";

const tokenStore = new Map<string, string>();

class WorkflowController {
  async handleConfirmPing(host: string) {
    const token = randomUUID();
    tokenStore.set(token, host);
    return { content: [{ type: "text", text: token }], isError: false };
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
}

export default WorkflowController;
