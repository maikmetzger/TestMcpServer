import MathsController from '../../src/controllers/MathsController.js';

describe('Math Subtraction Tool', () => {
  let controller: MathsController;

  beforeEach(() => {
    controller = new MathsController();
  });

  it('should subtract two positive numbers correctly', async () => {
    const result = await controller.handleSubtraction(10, 4);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('6');
  });

  it('should handle negative result correctly', async () => {
    const result = await controller.handleSubtraction(5, 10);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('-5');
  });

  it('should handle decimal numbers correctly', async () => {
    const result = await controller.handleSubtraction(5.5, 2.25);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('3.25');
  });

  it('should handle invalid inputs gracefully', async () => {
    // @ts-ignore: Testing with invalid input
    const result = await controller.handleSubtraction('not a number', 5);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});