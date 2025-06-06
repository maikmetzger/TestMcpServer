import DateTimeController from '../../src/controllers/DateTimeController.js';

describe('Timestamp Convert Tool', () => {
  it('should convert timestamp to date', async () => {
    const controller = new DateTimeController();
    const result = await controller.handleTimestampConvert(0);
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe('1970-01-01T00:00:00.000Z');
  });
});
