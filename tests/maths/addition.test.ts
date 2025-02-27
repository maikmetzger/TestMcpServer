import MathsController from '../../src/controllers/MathsController.js';

describe('Math Addition Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should add two positive numbers correctly', async () => {
    const result = await controller.handleAddition(5, 7);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('12');
  });

  it('should handle negative numbers correctly', async () => {
    const result = await controller.handleAddition(-3, -8);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('-11');
  });

  it('should handle decimal numbers correctly', async () => {
    const result = await controller.handleAddition(2.5, 3.25);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('5.75');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handleAddition('not a number', 5);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});