import { z } from 'zod';

export const consoleCapture = {
  name: 'consoleCapture',
  description: 'Capture console logs from a browser session. Opens the specified URL and collects all console output.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL to open in the browser'),
    timeout: z.number().min(1000).max(60000).optional().describe('Maximum time to capture logs in milliseconds (1-60 seconds). Default: 5000'),
    browserPath: z.string().optional().describe('Optional path to Chrome/Chromium executable'),
    filterLevel: z.enum(['all', 'error', 'warning', 'info', 'log']).optional().describe('Filter logs by minimum level. Default: all')
  }),
};