// Test script for browser console capture directly through the controller
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { BrowserController } from './build/controllers/BrowserController.js';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URL to our test page
const TEST_URL = `file://${__dirname}/test-console.html`;

async function testConsoleCapture() {
  console.log('Testing console capture with the browser controller...');
  console.log(`Loading test page: ${TEST_URL}`);
  
  try {
    const controller = new BrowserController();
    
    // Test with different filter levels
    const filterLevels = ['all', 'error', 'warning', 'info'];
    
    for (const level of filterLevels) {
      console.log(`\n--- Testing with filter level: ${level} ---`);
      
      const result = await controller.handleConsoleCapture({
        url: TEST_URL,
        timeout: 3000,
        filterLevel: level
      });
      
      console.log(result.content[0].text);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Start the test
testConsoleCapture();