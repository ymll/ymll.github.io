// Playwright Test config for the portfolio end-to-end tests.
// Run: npm run test:e2e  (builds the site, serves dist/, runs the specs)
// The browser in CI/this VM has no internet access, so every external
// subresource the page requests (CDN libraries, hotlinked images) is
// served from e2e/fixtures/ — see e2e/fixtures.js. Fixtures are downloaded
// on demand by e2e/download-fixtures.js (the globalSetup below) and are
// gitignored; run `node e2e/download-fixtures.js` to fetch them by hand.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  globalSetup: require.resolve('./e2e/download-fixtures.js'),
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  // Build the production site first, then serve dist/ while the tests run.
  webServer: {
    command: 'npm run build && node e2e/serve.js',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: false,
    timeout: 180000,
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
});
