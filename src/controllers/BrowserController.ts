import puppeteer from 'puppeteer';
import type { Browser, Page, LaunchOptions } from 'puppeteer';

interface ConsoleMessage {
  type: 'error' | 'warning' | 'info' | 'log';
  text: string;
  timestamp: string;
}

export class BrowserController {
  private browser: Browser | null = null;

  private async launchBrowser(browserPath?: string): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    const launchOptions: LaunchOptions = {
      headless: true,
    };

    if (browserPath) {
      launchOptions.executablePath = browserPath;
    }

    this.browser = await puppeteer.launch(launchOptions);
    return this.browser;
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private getLevelPriority(level: string): number {
    const priorities: Record<string, number> = {
      'error': 4,
      'warning': 3,
      'info': 2,
      'log': 1,
      'all': 0
    };
    return priorities[level] || 0;
  }

  private shouldCaptureMessage(messageType: string, filterLevel: string): boolean {
    if (filterLevel === 'all') return true;
    
    const messagePriority = this.getLevelPriority(messageType);
    const filterPriority = this.getLevelPriority(filterLevel);
    
    return messagePriority >= filterPriority;
  }

  async handleConsoleCapture(params: {
    url: string;
    timeout?: number;
    browserPath?: string;
    filterLevel?: string;
  }): Promise<{ content: { type: string; text: string }[]; isError: boolean }> {
    const { url, timeout = 5000, browserPath, filterLevel = 'all' } = params;
    const messages: ConsoleMessage[] = [];

    try {
      const browser = await this.launchBrowser(browserPath);
      const page = await browser.newPage();

      // Set up console message listener
      page.on('console', (message) => {
        const type = message.type() as 'error' | 'warning' | 'info' | 'log';
        
        if (this.shouldCaptureMessage(type, filterLevel)) {
          messages.push({
            type,
            text: message.text(),
            timestamp: new Date().toISOString()
          });
        }
      });

      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Wait for specified timeout
      await new Promise(resolve => setTimeout(resolve, timeout));

      // Close the page
      await page.close();
      await this.closeBrowser();

      // Format messages
      let resultText = `Captured ${messages.length} console messages from ${url}:\n\n`;
      if (messages.length === 0) {
        resultText += 'No console messages were captured during the session.';
      } else {
        messages.forEach((msg) => {
          resultText += `[${msg.timestamp}] [${msg.type.toUpperCase()}] ${msg.text}\n`;
        });
      }

      return {
        content: [{ type: 'text', text: resultText }],
        isError: false
      };

    } catch (error) {
      // Close the browser in case of error
      await this.closeBrowser();
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error capturing console logs: ${errorMessage}` }],
        isError: true
      };
    }
  }
}