import SecurityController from '../../src/controllers/SecurityController.js';

describe('Hash Tool', () => {
  it('should hash text using sha256', async () => {
    const controller = new SecurityController();
    const result = await controller.handleHash('hello');
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});
