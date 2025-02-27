// Simple test script for browser console capture tool
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { BrowserController } from './build/controllers/BrowserController.js';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testConsoleCaptureRaw() {
  const controller = new BrowserController();
  
  // Create file:// URL to the test HTML
  const url = `file://${__dirname}/test-console.html`;
  console.log(`Testing console capture on: ${url}`);
  
  try {
    // Call the handler with a 3 second timeout to catch the delayed log
    const result = await controller.handleConsoleCapture({
      url,
      timeout: 3000,
      filterLevel: 'all'
    });
    
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testConsoleCaptureRaw();