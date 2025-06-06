import SecurityController from '../../src/controllers/SecurityController.js';
import path from 'path';

describe('Checksum Tool', () => {
  it('should verify file checksum', async () => {
    const controller = new SecurityController();
    const file = path.resolve('./tests/fixtures/security/check.txt');
    const result = await controller.handleChecksum(file, '5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03');
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBe('valid');
  });
});
