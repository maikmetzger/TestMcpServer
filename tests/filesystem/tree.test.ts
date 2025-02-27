import FilesystemController from '../../src/controllers/FilesystemController.js';
import path from 'path';
import { dirname, resolve } from 'path';

describe('Filesystem Tree Tool', () => {
  let controller: FilesystemController;
  const fixtureDir = path.resolve('./tests/fixtures/filesystem');

  beforeEach(() => {
    controller = new FilesystemController();
  });

  it('should retrieve the directory tree structure', async () => {
    const result = await controller.handleTree(fixtureDir);
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    
    const treeText = result.content[0].text;
    
    // Check for expected files and directories
    expect(treeText).toContain('file1.txt');
    expect(treeText).toContain('file2.json');
    expect(treeText).toContain('dir1');
    expect(treeText).toContain('file3.md');
    expect(treeText).toContain('dir2');
    expect(treeText).toContain('file4.js');
  });

  it('should handle non-existent directories gracefully', async () => {
    const nonExistentDir = path.join(fixtureDir, 'non-existent-directory');
    const result = await controller.handleTree(nonExistentDir);
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});