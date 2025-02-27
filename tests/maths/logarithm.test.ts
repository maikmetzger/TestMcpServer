import MathsController from '../../src/controllers/MathsController.js';

describe('Math Logarithm Tool', () => {
  let controller: MathsController;
  
  beforeEach(() => {
    controller = new MathsController();
  });
  
  it('should calculate logarithm correctly for base 10', async () => {
    const result = await controller.handleLogarithm(100, 10);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Logarithm (base 10): 2');
  });
  
  it('should calculate logarithm correctly for base 2', async () => {
    const result = await controller.handleLogarithm(8, 2);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toBe('Logarithm (base 2): 3');
  });
  
  it('should calculate logarithm correctly for natural logarithm (base e)', async () => {
    const result = await controller.handleLogarithm(Math.E, Math.E);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Logarithm (base');
    expect(result.content[0].text).toContain('1');
  });
  
  it('should handle negative number gracefully', async () => {
    const result = await controller.handleLogarithm(-5, 10);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('number must be positive');
  });
  
  it('should handle zero gracefully', async () => {
    const result = await controller.handleLogarithm(0, 10);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('number must be positive');
  });
  
  it('should handle invalid base (zero) gracefully', async () => {
    const result = await controller.handleLogarithm(10, 0);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('base must be positive');
  });
  
  it('should handle invalid base (one) gracefully', async () => {
    const result = await controller.handleLogarithm(10, 1);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('not equal to 1');
  });
  
  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Intentionally passing invalid type for testing
    const result = await controller.handleLogarithm('abc', 10);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('must be a number');
  });
});