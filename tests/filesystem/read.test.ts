import FilesystemController from '../../src/controllers/FilesystemController.js';
import path from 'path';
import fs from 'fs';

describe('Filesystem Read Tool', () => {
  let controller: FilesystemController;
  const fixtureDir = path.resolve('./tests/fixtures/filesystem');
  
  // Create test file with known content
  const testFilePath = path.join(fixtureDir, 'test-read.txt');
  const testFileContent = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\n';
  
  beforeAll(() => {
    // Ensure test directory exists
    if (!fs.existsSync(fixtureDir)) {
      fs.mkdirSync(fixtureDir, { recursive: true });
    }
    
    // Create test file
    fs.writeFileSync(testFilePath, testFileContent);
  });
  
  afterAll(() => {
    // Clean up
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  beforeEach(() => {
    controller = new FilesystemController();
  });

  it('should read the entire file when no limit specified', async () => {
    const result = await controller.handleRead(testFilePath);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toContain('Line 1');
    expect(result.content[0].text).toContain('Line 5');
  });

  it('should respect line limit when specified', async () => {
    const result = await controller.handleRead(testFilePath, 2);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('Line 1');
    expect(result.content[0].text).toContain('Line 2');
    // Should not contain lines beyond the limit
    expect(result.content[0].text).not.toContain('Line 3');
  });

  it('should handle offset correctly', async () => {
    const result = await controller.handleRead(testFilePath, 2, 2);
    
    expect(result).toHaveProperty('isError', false);
    // Should start from Line 3 (0-indexed, so offset 2 is third line)
    expect(result.content[0].text).toContain('Line 3');
    expect(result.content[0].text).toContain('Line 4');
    // Should not contain lines outside the range
    expect(result.content[0].text).not.toContain('Line 1');
    expect(result.content[0].text).not.toContain('Line 5');
  });

  it('should handle non-existent files gracefully', async () => {
    const result = await controller.handleRead('/path/to/nonexistent/file.txt');
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});