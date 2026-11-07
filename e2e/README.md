# End-to-end tests

Playwright Test specs for the portfolio, written as user stories: the rooms
and tiles, popups and their one CTA button, the category filter, dark mode,
contact, publications, the quotes divider, the hello-world lines, and the
mobile layout. They run against the production build served locally, on
desktop (1280px) and mobile (390px).

## Run them

```sh
npm install          # installs @playwright/test
npx playwright install chromium   # first time only, downloads the browser
npm run test:e2e
```

`npm run test:e2e` builds the site (`npm run build`), serves `dist/` on
http://127.0.0.1:4173, and runs the specs in `e2e/*.spec.js`.

## Fixtures

The test browser has no internet access, so every external subresource the
page requests (CDN libraries, hotlinked screenshots and photos) is served
from `e2e/fixtures/` and all other external requests are aborted — the
suite is hermetic. Fixtures are downloaded on demand (the Playwright
`globalSetup`, or by hand with `node e2e/download-fixtures.js`) and are
gitignored; see `e2e/fixtures.js` for the URL-to-file map. The HKCS, TWF
and FISD photos need no fixture: they are embedded in the page as base64.

## Files

- `playwright.config.js` — projects (desktop/mobile), webServer (build + serve)
- `e2e/serve.js` — static server for `dist/`
- `e2e/fixtures.js` — external URL → local fixture map + request routing
- `e2e/download-fixtures.js` — downloads missing fixtures (also globalSetup)
- `e2e/helpers.js` — open the homepage, open/close popups, image checks
- `e2e/home.spec.js` — rooms, tiles, quotes divider, hello world, publications
- `e2e/popups.spec.js` — popup images, the one CTA per popup, close behaviour
- `e2e/filter.spec.js` — category filter hides empty rooms, All restores them
- `e2e/dark-mode.spec.js` — toggle, persistence, readable popups in dark mode
- `e2e/contact.spec.js` — Email me button, no form, no FormSubmit
- `e2e/mobile.spec.js` — 390px tiles, type sizes, tappable CTA
