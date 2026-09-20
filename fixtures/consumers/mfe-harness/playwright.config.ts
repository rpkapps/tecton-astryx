import {defineConfig, devices} from '@playwright/test';

/**
 * The harness serves its own built `dist/host` over a static server and drives
 * it with the Chromium that is already installed — `PLAYWRIGHT_BROWSERS_PATH`
 * points at it. This project never downloads a browser.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'list' : [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4319',
    viewport: {width: 1280, height: 800},
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4319/mfe-page.html?styles=none&autoMount=0',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
