// Category filter: a room with no matching tiles is hidden entirely, and
// filtering back to All restores every room.
const { test, expect } = require('@playwright/test');
const { gotoHome, expectNoPageErrors } = require('./helpers');

test.beforeEach(async ({ page }) => {
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

const room = (name) => `.room[data-room="${name}"]`;

test('Game filter shows only the Cool and fun room', async ({ page }) => {
  await page.click('.filter[data-filter=".game"]');
  await expect(page.locator(room('proud'))).toBeHidden();
  await expect(page.locator(room('useful'))).toBeHidden();
  await expect(page.locator(room('cool-fun'))).toBeVisible();
  await expect(page.locator(`${room('cool-fun')} .mix:visible`)).toHaveCount(7);
});

test('Chatbot filter shows only the Useful room', async ({ page }) => {
  await page.click('.filter[data-filter=".chatbot"]');
  await expect(page.locator(room('proud'))).toBeHidden();
  await expect(page.locator(room('cool-fun'))).toBeHidden();
  await expect(page.locator(room('useful'))).toBeVisible();
  await expect(page.locator(`${room('useful')} .mix:visible`)).toHaveCount(2);
});

test('System filter hides the Cool and fun room but keeps Proud and Useful', async ({ page }) => {
  await page.click('.filter[data-filter=".system"]');
  await expect(page.locator(room('cool-fun'))).toBeHidden();
  await expect(page.locator(room('proud'))).toBeVisible();
  await expect(page.locator(room('useful'))).toBeVisible();
});

test('All filter restores every room', async ({ page }) => {
  await page.click('.filter[data-filter=".game"]');
  await expect(page.locator(room('proud'))).toBeHidden();
  await page.click('.filter[data-filter="all"]');
  await expect(page.locator(room('proud'))).toBeVisible();
  await expect(page.locator(room('useful'))).toBeVisible();
  await expect(page.locator(room('cool-fun'))).toBeVisible();
  await expect(page.locator('.room .mix:visible')).toHaveCount(21);
});
