import http from 'http';
import NetworkController from '../../src/controllers/NetworkController.js';

describe('HTTP Request Tool', () => {
  it('should perform GET request', async () => {
    const controller = new NetworkController();
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    });
    await new Promise<void>(resolve => server.listen(0, () => resolve()));
    const port = (server.address() as any).port;
    const result = await controller.handleHttpRequest(`http://127.0.0.1:${port}`);
    server.close();
    expect(result.isError).toBe(false);
    const data = JSON.parse(result.content[0].text);
    expect(data.status).toBe(200);
  });
});
