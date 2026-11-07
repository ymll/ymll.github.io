// Dark mode: the moon toggle switches the theme, the choice persists in
// localStorage across reloads, and a popup stays readable in dark mode
// (dark popup surface, dark image column, screenshot colours untouched).
const { test, expect } = require('@playwright/test');
const { gotoHome, expectNoPageErrors, openPopup, closePopup, popupImage, isImageLoaded } = require('./helpers');

test.beforeEach(async ({ page }) => {
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

test('dark mode toggle switches theme and persists across reload', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark-mode/);
  await page.click('#dark-mode-toggle');
  await expect(html).toHaveClass(/dark-mode/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
  await expect(page.locator('#dark-mode-toggle')).toHaveAttribute('aria-pressed', 'true');

  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(800);
  await expect(html).toHaveClass(/dark-mode/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

  await page.click('#dark-mode-toggle');
  await expect(html).not.toHaveClass(/dark-mode/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
});

test('popup image column stays dark and readable in dark mode', async ({ page }) => {
  await page.click('#dark-mode-toggle');
  await expect(page.locator('html')).toHaveClass(/dark-mode/);
  await openPopup(page, '#project-2048-popup');
  const img = popupImage(page);
  expect(await isImageLoaded(img)).toBe(true);
  const colours = await page.evaluate(() => {
    const popup = document.querySelector('.mfp-content .work-items-popup');
    const col = document.querySelector('.mfp-content .ajcol');
    return {
      popupBg: getComputedStyle(popup).backgroundColor,
      colBg: getComputedStyle(col).backgroundColor,
      popupText: getComputedStyle(popup).color,
    };
  });
  // Dark surfaces on both sides of the popup — no white half.
  expect(colours.popupBg).toBe('rgb(30, 30, 30)');
  expect(colours.colBg).toBe('rgb(30, 30, 30)');
  expect(colours.popupText).not.toBe('rgb(30, 30, 30)');
  await closePopup(page);
});
