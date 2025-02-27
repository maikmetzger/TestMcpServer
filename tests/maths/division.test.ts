import MathsController from '../../src/controllers/MathsController.js';

describe('Math Division Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should divide two positive numbers correctly', async () => {
    const result = await controller.handleDivision(10, 2);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('5');
  });

  it('should handle decimal results correctly', async () => {
    const result = await controller.handleDivision(10, 3);
    
    expect(result).toHaveProperty('isError', false);
    // We don't check exact decimal representation since it might vary
    expect(result.content[0].text).toContain('3.33');
  });

  it('should handle negative numbers correctly', async () => {
    const result = await controller.handleDivision(-10, 2);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('-5');
  });

  it('should handle division by zero gracefully', async () => {
    const result = await controller.handleDivision(10, 0);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Division by zero');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handleDivision('not a number', 5);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});