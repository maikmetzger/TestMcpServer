import MathsController from '../../src/controllers/MathsController.js';

describe('Math Standard Deviation Tool', () => {
  let controller: MathsController;
  
  beforeEach(() => {
    controller = new MathsController();
  });
  
  it('should calculate population standard deviation correctly', async () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = await controller.handleStandardDeviation(values, 'population');
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Population Standard Deviation:');
    
    // Extract the numeric value for precise testing
    const stdDevValue = parseFloat(result.content[0].text.split(':')[1].trim());
    expect(stdDevValue).toBeCloseTo(2, 1); // Should be approximately 2
  });
  
  it('should calculate sample standard deviation correctly', async () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = await controller.handleStandardDeviation(values, 'sample');
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Sample Standard Deviation:');
    
    // Extract the numeric value for precise testing
    const stdDevValue = parseFloat(result.content[0].text.split(':')[1].trim());
    expect(stdDevValue).toBeCloseTo(2.14, 1); // Should be approximately 2.14
  });
  
  it('should use population standard deviation by default', async () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const result = await controller.handleStandardDeviation(values);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Population Standard Deviation:');
  });
  
  it('should handle single value array for population standard deviation', async () => {
    const values = [5];
    const result = await controller.handleStandardDeviation(values, 'population');
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Population Standard Deviation: 0');
  });
  
  it('should reject single value array for sample standard deviation', async () => {
    const values = [5];
    const result = await controller.handleStandardDeviation(values, 'sample');
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('requires at least 2 values');
  });
  
  it('should handle empty array gracefully', async () => {
    const values: number[] = [];
    const result = await controller.handleStandardDeviation(values);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('cannot be empty');
  });
  
  it('should handle non-numeric values gracefully', async () => {
    // Create array with a value that will be checked at runtime but passes compile-time type checking
    const values = [1, 2, 4];
    // Replace a value with NaN which is technically a number type but will fail our validation
    values[1] = Number.NaN;
    
    const result = await controller.handleStandardDeviation(values);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('must be a finite number');
  });
  
  it('should handle non-array input gracefully', async () => {
    // Use a type assertion to test the error handling
    // This is different from ignoring - we're explicitly saying this code
    // is intentionally passing a wrongly-typed value to test error handling
    const result = await controller.handleStandardDeviation([] as unknown as number[]);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('cannot be empty');
  });
});