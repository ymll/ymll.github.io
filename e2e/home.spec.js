// Homepage structure: rooms in order, tile membership, quotes divider,
// hello-world lines, publications, and the standing content rules
// (no Historical section, no full legal name).
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { gotoHome, expectNoPageErrors } = require('./helpers');

const HELLO_WORLD_LINES = [
  'print("Hello World!")',
  'System.out.println("Hello World!");',
  'printf("Hello World!\\\\n");',
  'echo "Hello World!"',
  'cout << "Hello World!" << endl;',
  'console.log("Hello World!");',
  'Write-Output "Hello World!"',
  'Console.WriteLine("Hello World!");',
  "?- write('Hello World!'), nl.",
  "disp('Hello World!')",
  "SELECT 'Hello World!';",
];

test.beforeEach(async ({ page }) => {
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

test('homepage loads with HTTP 200', async ({ page }) => {
  await expect(page).toHaveTitle(/Lily Yung/);
});

test('three rooms render in order: Proud, Useful, Cool and fun', async ({ page }) => {
  const headings = await page.locator('.room > .row h3').allTextContents();
  expect(headings).toEqual([
    'My proud projects and experience',
    'Useful things I built',
    'Cool and fun things I built',
  ]);
});

test('rooms contain the right tiles, in order', async ({ page }) => {
  const tilesIn = (room) => page.locator(`.room[data-room="${room}"] .overlay span`).allTextContents();
  expect(await tilesIn('proud')).toEqual([
    'Virtual Gender Reveal',
    'VPS (Visually-impaired Positioning System)',
  ]);
  expect(await tilesIn('useful')).toEqual([
    'freeaicommand.com',
    'Simple Flashcard Reviewer',
    'Personalised Countdown Timer',
    'P2P Karaoke System',
    'Symphony Trading Bot',
    'Symphony KYC Onboarding Bot',
    'Hadoop In-mapper Combiner',
    'Airport & Airline Award App',
  ]);
  expect(await tilesIn('cool-fun')).toEqual([
    'CUHK 2048',
    'Oculus-Room-Escape-Game',
    'Maze Game',
    'Google Cardboard Game Demo',
    "Pikachu's Dodgeball Adventure",
    'Train World Animation',
    'OpenGL Car Driving Game',
    'Snowing Animation',
    '100 Reasons Not to Go to Work',
    'ASCII Art Generator',
    'Adobe Design Tools self-learning materials',
  ]);
  await expect(page.locator('.room .mix')).toHaveCount(21);
});

test('no Historical section and no full legal name anywhere', async ({ page }) => {
  // Check the whole page source: hidden popups count too.
  const html = await page.content();
  expect(html).not.toMatch(/historical/i);
  expect(html).not.toMatch(/Yung Man Lee/);
  expect(html).toMatch(/Lily Yung/);
});

test('quotes are a slim divider, not a Favourite quotes section', async ({ page }) => {
  const divider = page.locator('.quote-divider');
  await expect(divider).toBeVisible();
  await expect(divider).toContainText('violent psychopath');
  await expect(divider).toContainText('John F. Woods');
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/favourite quotes/i);
});

test('hero positions Lily as an engineer and independent builder', async ({ page }) => {
  await expect(page.locator('.hero-eyebrow')).toHaveText('SOFTWARE ENGINEER · INDEPENDENT BUILDER');
  await expect(page.locator('.hero-greeting')).toHaveText("Hi, I'm Lily Yung.");
  await expect(page.locator('.hero-welcome')).toHaveText('Engineer by profession. Maker by curiosity.');
  await expect(page.locator('.hero-description')).toBeVisible();
  await expect(page.locator('.hero-actions a')).toHaveCount(3);

  // The introduction appears before the animated hello-world line.
  const order = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.hero-eyebrow, .hero-greeting, .hero-welcome, .hero-description, .hero-actions, .hello-world')];
    return els.map((el) => el.className);
  });
  expect(order).toEqual([
    'hero-eyebrow',
    'hero-greeting',
    'hero-welcome',
    'hero-description',
    'hero-actions',
    'hello-world',
  ]);
});

test('featured products and engineering experience are linked and visible', async ({ page }) => {
  const products = page.locator('#featured-work .featured-card');
  await expect(products).toHaveCount(2);
  await expect(products.nth(0)).toContainText('TheAnnounce');
  await expect(products.nth(0).locator('a.featured-link')).toHaveAttribute('href', 'https://theannounce.com');
  await expect(products.nth(1)).toContainText('FreeAICommand');
  await expect(products.nth(1).locator('a.featured-link')).toHaveAttribute('href', 'https://freeaicommand.com');

  const experience = page.locator('#experience .experience-item');
  await expect(experience).toHaveCount(3);
  await expect(experience.nth(0)).toContainText('Goldman Sachs');
  await expect(experience.nth(1)).toContainText('Amazon');
  await expect(experience.nth(2)).toContainText('Independent builder');
});

test('hello world: all 11 lines in the built bundle and typing on the page', async ({ page }) => {
  const bundle = fs.readFileSync(path.join(__dirname, '..', 'dist', 'app.js'), 'utf8');
  for (const line of HELLO_WORLD_LINES) {
    expect(bundle, `bundle contains ${line}`).toContain(line);
  }
  // typed.js cycles through the lines; wait until one is on screen.
  await expect(page.locator('.typejs')).toContainText('Hello World', { timeout: 20000 });
});

test('publications sit under Awards, each with a Read the paper link', async ({ page }) => {
  const sectionIds = await page.evaluate(() =>
    [...document.querySelectorAll('section[id]')].map((s) => s.id)
  );
  expect(sectionIds.indexOf('awards')).toBeGreaterThan(-1);
  expect(sectionIds.indexOf('publications')).toBeGreaterThan(sectionIds.indexOf('awards'));
  const pubs = page.locator('#publications .publication');
  await expect(pubs).toHaveCount(2);
  await expect(pubs.nth(0).locator('.pub-link')).toHaveText(/Read the paper/);
  await expect(pubs.nth(0).locator('.pub-link')).toHaveAttribute('href', 'https://doi.org/10.1109/ISIT.2016.7541719');
  await expect(pubs.nth(1).locator('.pub-link')).toHaveText(/Read the paper/);
  await expect(pubs.nth(1).locator('.pub-link')).toHaveAttribute('href', 'https://doi.org/10.3390/e25071054');
});
