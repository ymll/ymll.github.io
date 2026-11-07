// Shared helpers for the portfolio e2e specs.
const { expect } = require('@playwright/test');
const { routeFixtures } = require('./fixtures');

// Open the homepage with external subresources routed to local fixtures.
// Returns the navigation response and a list of page errors seen.
async function gotoHome(page) {
  await routeFixtures(page);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const response = await page.goto('/', { waitUntil: 'load' });
  // Let typed.js, MixItUp and the images settle before asserting.
  await page.waitForTimeout(1500);
  return { response, errors };
}

function expectNoPageErrors(errors) {
  expect(errors).toEqual([]);
}

// Open a Magnific Popup by clicking its tile/card anchor.
async function openPopup(page, href) {
  await page.click(`a[href="${href}"]`);
  await expect(page.locator('.mfp-content')).toBeVisible();
  await page.waitForTimeout(400);
}

async function closePopup(page) {
  await page.keyboard.press('Escape');
  await expect(page.locator('.mfp-content')).toHaveCount(0);
}

// The image inside the currently open popup (either a .popup-visual
// screenshot or an .ajcol photo column).
function popupImage(page) {
  return page.locator('.mfp-content .popup-visual img, .mfp-content .ajcol img').first();
}

// True when an <img> finished loading with real pixels (not a broken image
// and not the SVG onerror fallback, which has naturalWidth 0 for <img>).
async function isImageLoaded(img) {
  return img.evaluate((el) => el.complete && el.naturalWidth > 0);
}

module.exports = { gotoHome, expectNoPageErrors, openPopup, closePopup, popupImage, isImageLoaded };
