// Downloads any missing test fixtures (see fixtures.js) into e2e/fixtures/.
// Run by hand: `node e2e/download-fixtures.js`
// Also used as the Playwright globalSetup, so `npm run test:e2e` fetches
// whatever is missing on first run and skips what is already there.
const fs = require('fs');
const path = require('path');
const https = require('https');
const { FIXTURES, FIXTURES_DIR } = require('./fixtures');

function download(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'Accept-Encoding': 'identity', 'User-Agent': 'portfolio-e2e-fixtures' } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
          res.resume();
          return resolve(download(new URL(res.headers.location, url).toString(), dest, redirects - 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`${url} -> HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks);
          if (body.length === 0) return reject(new Error(`${url} -> empty response`));
          fs.writeFileSync(dest, body);
          resolve(body.length);
        });
        res.on('error', reject);
      }
    );
    req.setTimeout(30000, () => req.destroy(new Error(`${url} -> timed out`)));
    req.on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  const missing = Object.entries(FIXTURES).filter(
    ([, v]) => !fs.existsSync(path.join(FIXTURES_DIR, v.file))
  );
  if (missing.length === 0) {
    console.log('fixtures: all present');
    return;
  }
  for (const [url, v] of missing) {
    const bytes = await download(url, path.join(FIXTURES_DIR, v.file));
    console.log(`fixtures: downloaded ${v.file} (${bytes} bytes)`);
  }
}

module.exports = main;

if (require.main === module) {
  main().catch((e) => {
    console.error('fixtures: FAILED —', e.message);
    process.exit(1);
  });
}
