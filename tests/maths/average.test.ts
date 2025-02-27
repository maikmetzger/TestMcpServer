import MathsController from '../../src/controllers/MathsController.js';

describe('Math Average Tool', () => {
  let controller: MathsController;
  
  beforeEach(() => {
    controller = new MathsController();
  });
  
  it('should calculate average of two positive numbers correctly', async () => {
    const result = await controller.handleAverage(10, 20);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Average: 15');
  });
  
  it('should calculate average of a positive and negative number correctly', async () => {
    const result = await controller.handleAverage(-10, 10);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Average: 0');
  });
  
  it('should calculate average of two negative numbers correctly', async () => {
    const result = await controller.handleAverage(-10, -20);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Average: -15');
  });
  
  it('should handle decimal numbers correctly', async () => {
    const result = await controller.handleAverage(10.5, 20.5);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Average: 15.5');
  });
  
  it('should handle zero values correctly', async () => {
    const result = await controller.handleAverage(0, 0);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Average: 0');
  });
  
  it('should handle very large numbers gracefully', async () => {
    const result = await controller.handleAverage(Number.MAX_VALUE, Number.MAX_VALUE);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('too large');
  });
  
  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Intentionally passing invalid type for testing
    const result = await controller.handleAverage('abc', 20);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('must be a number');
  });
});