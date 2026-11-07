// Mobile (390px): tiles two-across, readable type, tappable CTA buttons.
const { test, expect } = require('@playwright/test');
const { gotoHome, expectNoPageErrors, openPopup, closePopup, isImageLoaded } = require('./helpers');

test.beforeEach(async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'mobile viewport only');
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

test('tiles sit two-across at 390px', async ({ page }) => {
  const widths = await page.locator('.work-items .item').evaluateAll((items) =>
    items.slice(0, 4).map((el) => Math.round(el.getBoundingClientRect().width))
  );
  for (const w of widths) {
    expect(w, `tile width ${w}px`).toBeGreaterThanOrEqual(150);
    expect(w, `tile width ${w}px`).toBeLessThanOrEqual(185);
  }
});

test('body text is readable at 390px', async ({ page }) => {
  const sizes = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontSize,
    roomHeading: getComputedStyle(document.querySelector('#work h3')).fontSize,
    tileLabel: getComputedStyle(document.querySelector('.work-items .overlay span')).fontSize,
    popupText: (() => {
      const el = document.querySelector('.work-items-popup p');
      return el ? getComputedStyle(el).fontSize : null;
    })(),
  }));
  expect(sizes.body).toBe('16px');
  expect(sizes.roomHeading).toBe('20px');
  expect(sizes.tileLabel).toBe('18px');
  expect(sizes.popupText).toBe('16px');
});

test('popup CTA is a 50px tappable button at 390px', async ({ page }) => {
  await openPopup(page, '#project-2048-popup');
  const cta = page.locator('.mfp-content .popup-cta');
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box.height, `CTA height ${box.height}px`).toBeGreaterThanOrEqual(48);
  expect(box.height, `CTA height ${box.height}px`).toBeLessThanOrEqual(52);
  await expect(page.locator('.mfp-content .popup-visual img, .mfp-content .ajcol img').first()).toBeVisible();
  await closePopup(page);
});

test('award photos load at 390px', async ({ page }) => {
  const imgs = page.locator('.award-photo img');
  for (let i = 0; i < (await imgs.count()); i++) {
    expect(await isImageLoaded(imgs.nth(i))).toBe(true);
  }
});
