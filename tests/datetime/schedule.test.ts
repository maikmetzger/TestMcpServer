import DateTimeController from '../../src/controllers/DateTimeController.js';

describe('Schedule Tool', () => {
  it('should run command after delay', async () => {
    const controller = new DateTimeController();
    const result = await controller.handleSchedule('echo scheduled', 1);
    expect(result.isError).toBe(false);
    expect(result.content[0].text.trim()).toBe('scheduled');
  });
});
