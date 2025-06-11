import http from 'http';
import WorkflowController from '../../src/controllers/WorkflowController.js';

describe('Workflow HTTP Request', () => {
  it('should store and confirm HTTP request result', async () => {
    const controller = new WorkflowController();
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    });
    await new Promise<void>(resolve => server.listen(0, () => resolve()));
    const port = (server.address() as any).port;
    const perform = await controller.handlePerformHttpRequest(`http://127.0.0.1:${port}`);
    server.close();
    expect(perform.isError).toBe(false);
    const token = perform.content[0].text;
    expect(typeof token).toBe('string');

    const confirm = await controller.handleConfirmHttpRequest(token);
    expect(confirm.isError).toBe(false);
    const data = JSON.parse(confirm.content[0].text);
    expect(data.status).toBe(200);

    const again = await controller.handleConfirmHttpRequest(token);
    expect(again.isError).toBe(true);
  });
});
