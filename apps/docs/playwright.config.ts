import {defineConfig, devices} from '@playwright/test';

/**
 * The tests run against the static export, served the way a host would serve
 * it — not against a development server. What they exercise is therefore the
 * artefact that ships: the prerendered HTML, the example modules the browser
 * fetches after hydration, and the exported search index.
 *
 * Chromium is already installed and `PLAYWRIGHT_BROWSERS_PATH` points at it.
 * This project never downloads a browser.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    viewport: {width: 1440, height: 900},
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
