import TextController from '../../src/controllers/TextController.js';
import path from 'path';

describe('Search Replace Tool', () => {
  it('should replace text in a file (preview only)', async () => {
    const controller = new TextController();
    const file = path.resolve('./tests/fixtures/text/sample.txt');
    const result = await controller.handleSearchReplace(file, 'test', 'sample');
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('This is a sample file.');
  });
});
