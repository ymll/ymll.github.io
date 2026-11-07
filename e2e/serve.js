// Tiny static server for the built site (dist/), used by the e2e tests.
// Started by playwright.config.js after `npm run build`. Serves only files
// inside dist/ on http://127.0.0.1:4173.
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'dist');
const PORT = 4173;
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(DIR, p);
  if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`e2e server: http://127.0.0.1:${PORT}/`);
});
