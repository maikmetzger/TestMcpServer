import NetworkController from '../../src/controllers/NetworkController.js';

describe('Ping Tool', () => {
  it('should ping localhost', async () => {
    const controller = new NetworkController();
    const result = await controller.handlePing('127.0.0.1');
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('1 packets');
  });
});
