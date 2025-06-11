import crypto from 'crypto';
import NetworkController from './NetworkController.js';

export const tokenStore = new Map<string, { url: string; method: string; body: string }>();

class WorkflowController {
  async handleConfirmHttpRequest(url: string, method: string = 'GET', body: string = '') {
    try {
      const token = crypto.randomUUID();
      tokenStore.set(token, { url, method, body });
      return {
        content: [
          {
            type: 'text',
            text: `About to perform ${method} request to ${url}. Call 'performHttpRequest' with provided token to continue.`,
          },
        ],
        token,
        nextTool: { name: 'performHttpRequest', arguments: { token } },
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: 'text', text: `Error preparing request: ${error?.message || 'Unknown error'}` },
        ],
        isError: true,
      };
    }
  }

  async handlePerformHttpRequest(token: string) {
    try {
      const data = tokenStore.get(token);
      if (!data) {
        throw new Error('Invalid or expired token');
      }
      tokenStore.delete(token);
      const network = new NetworkController();
      return await network.handleHttpRequest(data.url, data.method, data.body);
    } catch (error: any) {
      return {
        content: [
          { type: 'text', text: `Error performing request: ${error?.message || 'Unknown error'}` },
        ],
        isError: true,
      };
    }
  }
}

export default WorkflowController;
