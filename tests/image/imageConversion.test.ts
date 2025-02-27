import ImageController from '../../src/controllers/ImageController.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

describe('Image Conversion Tool', () => {
  let controller: ImageController;
  const fixtureDir = path.resolve('./tests/fixtures/image');
  const sourceImagePath = path.join(fixtureDir, 'test-image-convert.png');
  const outputImagePath = path.join(fixtureDir, 'converted-image.webp');
  
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
        background: { r: 0, g: 0, b: 255, alpha: 1 }
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

  it('should convert PNG to WebP correctly', async () => {
    const result = await controller.handleImageConversion(
      sourceImagePath,
      'webp',
      85,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', false);
    expect(result.content[0].text).toContain('converted');
    
    // Verify the output file exists
    expect(fs.existsSync(outputImagePath)).toBe(true);
    
    // Verify image format
    const metadata = await sharp(outputImagePath).metadata();
    expect(metadata.format).toBe('webp');
  });

  it('should handle invalid source path gracefully', async () => {
    const result = await controller.handleImageConversion(
      '/path/to/nonexistent/image.png',
      'webp',
      85,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });

  it('should handle invalid quality value gracefully', async () => {
    // Casting to any to bypass TypeScript checking for negative test case
    const result = await controller.handleImageConversion(
      sourceImagePath,
      'webp',
      'invalid' as unknown as number,
      outputImagePath
    );
    
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0].text).toContain('Error');
  });

  it('should convert to JPEG format', async () => {
    const jpgOutputPath = path.join(fixtureDir, 'converted-image.jpg');
    
    try {
      const result = await controller.handleImageConversion(
        sourceImagePath,
        'jpeg',
        90,
        jpgOutputPath
      );
      
      expect(result).toHaveProperty('isError', false);
      
      // Verify image format
      const metadata = await sharp(jpgOutputPath).metadata();
      expect(metadata.format).toBe('jpeg');
    } finally {
      // Clean up
      if (fs.existsSync(jpgOutputPath)) {
        fs.unlinkSync(jpgOutputPath);
      }
    }
  });
});