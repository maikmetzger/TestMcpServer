import MathsController from '../../src/controllers/MathsController.js';

describe('Math Square Root Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should calculate square root of a perfect square correctly', async () => {
    const result = await controller.handleSquareRoot(16);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('4');
  });

  it('should handle decimal results correctly', async () => {
    const result = await controller.handleSquareRoot(2);
    
    expect(result).toHaveProperty('isError', false);
    // We don't check exact decimal representation since it might vary
    expect(result.content[0].text).toContain('1.414');
  });

  it('should handle zero correctly', async () => {
    const result = await controller.handleSquareRoot(0);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('0');
  });

  it('should handle negative numbers gracefully', async () => {
    const result = await controller.handleSquareRoot(-4);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('negative');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handleSquareRoot('not a number');
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});