import MathsController from '../../src/controllers/MathsController.js';

describe('Math Power Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should calculate positive integers correctly', async () => {
    const result = await controller.handlePower(2, 3);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('8');
  });

  it('should handle zero exponent correctly', async () => {
    const result = await controller.handlePower(5, 0);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('1');
  });

  it('should handle negative base correctly', async () => {
    const result = await controller.handlePower(-2, 3);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('-8');
  });

  it('should handle negative exponent correctly', async () => {
    const result = await controller.handlePower(4, -2);
    
    expect(result).toHaveProperty('isError', false);
    // 4^-2 = 1/16 = 0.0625
    expect(result.content[0].text).toContain('0.0625');
  });

  it('should handle base zero correctly', async () => {
    const result = await controller.handlePower(0, 5);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('0');
  });

  it('should handle base zero with zero exponent correctly', async () => {
    const result = await controller.handlePower(0, 0);
    
    expect(result).toHaveProperty('isError', false);
    // 0^0 is mathematically indeterminate, but JavaScript returns 1
    expect(result.content[0].text).toContain('1');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handlePower('not a number', 5);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});