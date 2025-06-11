import http from 'http';
import WorkflowController from '../../src/controllers/WorkflowController.js';

describe('Workflow Proxy Tools', () => {
  it('should perform http request using token', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    });
    await new Promise<void>(resolve => server.listen(0, () => resolve()));
    const port = (server.address() as any).port;

    const controller = new WorkflowController();
    const confirm = await controller.handleConfirmHttpRequest(`http://127.0.0.1:${port}`);
    expect(confirm.isError).toBe(false);
    expect(confirm).toHaveProperty('token');

    const token = confirm.token as string;
    const result = await controller.handlePerformHttpRequest(token);
    server.close();
    expect(result.isError).toBe(false);
    const data = JSON.parse(result.content[0].text);
    expect(data.status).toBe(200);
  });

  it('should fail with invalid token', async () => {
    const controller = new WorkflowController();
    const result = await controller.handlePerformHttpRequest('invalid');
    expect(result.isError).toBe(true);
  });
});
