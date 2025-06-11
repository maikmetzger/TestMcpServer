import WorkflowController from '../../src/controllers/WorkflowController.js';

describe('Ping Proxy Workflow', () => {
  it('performs ping with confirmation token', async () => {
    const controller = new WorkflowController();
    const confirm = await controller.handleConfirmPing('127.0.0.1');
    expect(confirm.isError).toBe(false);
    const token = confirm.content[0].text;
    expect(typeof token).toBe('string');

    const perform = await controller.handlePerformPing(token);
    expect(perform.isError).toBe(false);
    expect(perform.content[0].text).toContain('1 packets');

    const reused = await controller.handlePerformPing(token);
    expect(reused.isError).toBe(true);
  });
});
