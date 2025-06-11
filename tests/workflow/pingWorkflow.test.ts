import WorkflowController from '../../src/controllers/WorkflowController.js';

describe('Workflow Ping', () => {
  it('should store and confirm ping result', async () => {
    const controller = new WorkflowController();
    const perform = await controller.handlePerformPing('127.0.0.1');
    expect(perform.isError).toBe(false);
    const token = perform.content[0].text;

    const confirm = await controller.handleConfirmPing(token);
    expect(confirm.isError).toBe(false);
    expect(confirm.content[0].text).toContain('1 packets');

    const again = await controller.handleConfirmPing(token);
    expect(again.isError).toBe(true);
  });
});
