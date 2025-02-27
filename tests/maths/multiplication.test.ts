import MathsController from '../../src/controllers/MathsController.js';

describe('Math Multiplication Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should multiply two positive numbers correctly', async () => {
    const result = await controller.handleMultiplication(5, 4);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('20');
  });

  it('should handle negative numbers correctly', async () => {
    const result = await controller.handleMultiplication(-3, 4);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('-12');
  });

  it('should handle both negative numbers correctly', async () => {
    const result = await controller.handleMultiplication(-3, -2);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('6');
  });

  it('should handle decimal numbers correctly', async () => {
    const result = await controller.handleMultiplication(2.5, 4);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('10');
  });

  it('should handle zero correctly', async () => {
    const result = await controller.handleMultiplication(5, 0);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('0');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handleMultiplication('invalid', 5);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});