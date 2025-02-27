import ImageController from '../../src/controllers/ImageController.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

describe('Image Resize Tool', () => {
  let controller: ImageController;
  const fixtureDir = path.resolve('./tests/fixtures/image');
  const sourceImagePath = path.join(fixtureDir, 'test-image.png');
  const outputImagePath = path.join(fixtureDir, 'resized-image.jpg');
  
  // Generate a simple test image
  beforeAll(async () => {
    // Create fixture directory if it doesn't exist
    if (!fs.existsSync(fixtureDir)) {
      fs.mkdirSync(fixtureDir, { recursive: true });
    }
    
    // Create a simple 100x100 test image
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
    .png()
    .toFile(sourceImagePath);
  });
  
  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(sourceImagePath)) {
      fs.unlinkSync(sourceImagePath);
    }
    if (fs.existsSync(outputImagePath)) {
      fs.unlinkSync(outputImagePath);
    }
  });
  
  beforeEach(() => {
    controller = new ImageController();
  });
  
  afterEach(() => {
    // Clean up output file after each test
    if (fs.existsSync(outputImagePath)) {
      fs.unlinkSync(outputImagePath);
    }
  });

  it('should resize an image correctly', async () => {
    const result = await controller.handleImageResize(
      sourceImagePath,
      50,
      50,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('resized');
    
    // Verify the output file exists
    expect(fs.existsSync(outputImagePath)).toBe(true);
    
    // Verify image dimensions
    const metadata = await sharp(outputImagePath).metadata();
    expect(metadata.width).toBe(50);
    expect(metadata.height).toBe(50);
  });

  it('should handle invalid source path gracefully', async () => {
    const result = await controller.handleImageResize(
      '/path/to/nonexistent/image.png',
      50,
      50,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });

  it('should handle invalid dimensions gracefully', async () => {
    // Casting to any to bypass TypeScript checking for negative test case
    const result = await controller.handleImageResize(
      sourceImagePath,
      'invalid' as unknown as number,
      50,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });
});