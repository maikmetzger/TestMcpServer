import MathsController from '../../src/controllers/MathsController.js';

describe('Math Tools Validation Edge Cases', () => {
  let controller: MathsController;
  
  beforeEach(() => {
    controller = new MathsController();
  });
  
  describe('Input validation edge cases', () => {
    it('should detect missing parameters (null)', async () => {
      // @ts-ignore: Intentionally passing null for testing
      const result = await controller.handleAddition(5, null);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('Parameter at position 2 is missing');
    });
    
    it('should detect missing parameters (undefined)', async () => {
      // @ts-ignore: Intentionally passing undefined for testing
      const result = await controller.handleAddition(undefined, 10);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('Parameter at position 1 is missing');
    });
    
    it('should detect non-finite numbers (Infinity)', async () => {
      const result = await controller.handleAddition(Infinity, 5);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('must be a finite number');
    });
    
    it('should detect non-finite numbers (NaN)', async () => {
      const result = await controller.handleAddition(NaN, 5);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('must be a finite number');
    });
  });
  
  describe('Overflow and result edge cases', () => {
    it('should detect potential overflow in addition', async () => {
      const almostMax = Number.MAX_VALUE * 0.9;
      const result = await controller.handleAddition(Number.MAX_VALUE, almostMax);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('too large');
    });
    
    it('should detect potential overflow in multiplication', async () => {
      const result = await controller.handleMultiplication(Number.MAX_VALUE, 2);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('too large');
    });
    
    it('should detect potential overflow in division', async () => {
      // Division that produces an infinite result
      const result = await controller.handleDivision(1, Number.MIN_VALUE * 0.1);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('Error calculating quotient');
    });
    
    it('should detect potential overflow in power calculation', async () => {
      const result = await controller.handlePower(1000, 1000);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('too large');
    });
    
    it('should block extremely large exponents', async () => {
      const result = await controller.handlePower(2, 1001);
      
      expect(result).toHaveProperty('isError', true);
      expect(result.content[0].text).toContain('too large');
    });
  });
  
  describe('Multiple validation failures', () => {
    it('should handle multiple invalid inputs correctly', async () => {
      // @ts-ignore: Intentionally passing invalid types for testing
      const result = await controller.handleMultiplication('abc', NaN);
      
      expect(result).toHaveProperty('isError', true);
      // Only the first error should be reported
      expect(result.content[0].text).toContain('Parameter at position 1');
    });
  });
});