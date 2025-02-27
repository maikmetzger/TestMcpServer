import FilesystemController from '../../src/controllers/FilesystemController.js';
import path from 'path';
import fs from 'fs';

describe('Filesystem Search Tool', () => {
  let controller: FilesystemController;
  const fixtureDir = path.resolve('./tests/fixtures/filesystem/search');
  
  // Create test directory and files
  const testFiles = {
    'file1.txt': 'This is a text file with some content',
    'file2.js': 'function hello() { return "world"; }',
    'file3.json': '{ "name": "test", "value": 123 }',
    'subfolder/file4.txt': 'Another text file in a subfolder',
    'subfolder/file5.js': 'const searchKeyword = "found me!";'
  };
  
  beforeAll(() => {
    // Create test directories and files
    Object.entries(testFiles).forEach(([filePath, content]) => {
      const fullPath = path.join(fixtureDir, filePath);
      const dirPath = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Create file with content
      fs.writeFileSync(fullPath, content);
    });
  });
  
  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(fixtureDir)) {
      fs.rmSync(fixtureDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    controller = new FilesystemController();
  });

  it('should search by filename pattern', async () => {
    const result = await controller.handleSearch(fixtureDir, '*.txt', 'filename');
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0]).toHaveProperty('type', 'text');
    
    // Should find both text files
    expect(result.content[0].text).toContain('file1.txt');
    expect(result.content[0].text).toContain('subfolder/file4.txt');
    
    // Should not include non-matching files
    expect(result.content[0].text).not.toContain('file2.js');
  });

  it('should search by file content', async () => {
    const result = await controller.handleSearch(fixtureDir, 'searchKeyword', 'content');
    
    expect(result).toHaveProperty('isError', false);
    
    // Should find the file containing the search term
    expect(result.content[0].text).toContain('file5.js');
    
    // Should not include files without the term
    expect(result.content[0].text).not.toContain('file1.txt');
  });

  it('should combine filename and content search', async () => {
    const result = await controller.handleSearch(fixtureDir, 'function', 'content', 20);
    
    expect(result).toHaveProperty('isError', false);
    
    // Should find the JS file containing "function"
    expect(result.content[0].text).toContain('file2.js');
    
    // Should not include JS files without "function"
    expect(result.content[0].text).not.toContain('file5.js');
  });

  it('should handle non-existent directories gracefully', async () => {
    const result = await controller.handleSearch('/path/to/nonexistent/dir', '*.txt', 'name');
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});