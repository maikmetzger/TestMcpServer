import TextController from '../../src/controllers/TextController.js';
import path from 'path';

describe('Word Count Tool', () => {
  it('should count words in a file', async () => {
    const controller = new TextController();
    const file = path.resolve('./tests/fixtures/text/sample.txt');
    const result = await controller.handleWordCount(file, null);
    expect(result.isError).toBe(false);
    const counts = JSON.parse(result.content[0].text);
    expect(counts.words).toBe(7);
  });
});
