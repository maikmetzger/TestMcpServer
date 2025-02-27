import MathsController from '../../src/controllers/MathsController.js';

describe('Math Modulo Tool', () => {
  let controller: MathsController;
  
  beforeEach(() => {
    controller = new MathsController();
  });
  
  it('should calculate modulo correctly with positive numbers', async () => {
    const result = await controller.handleModulo(10, 3);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Modulo: 1');
  });
  
  it('should calculate modulo correctly with negative dividend', async () => {
    const result = await controller.handleModulo(-10, 3);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Modulo: -1');
  });
  
  it('should calculate modulo correctly with negative divisor', async () => {
    const result = await controller.handleModulo(10, -3);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Modulo: 1');
  });
  
  it('should handle zero dividend correctly', async () => {
    const result = await controller.handleModulo(0, 5);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Modulo: 0');
  });
  
  it('should handle division by zero gracefully', async () => {
    const result = await controller.handleModulo(10, 0);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Modulo by zero is not allowed');
  });
  
  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Intentionally passing invalid type for testing
    const result = await controller.handleModulo('abc', 3);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('must be a number');
  });
});