// Contact: a single Email me button, no form, no third-party form service.
const { test, expect } = require('@playwright/test');
const { gotoHome, expectNoPageErrors } = require('./helpers');

test.beforeEach(async ({ page }) => {
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

test('contact section has the Email me button and nothing else to fill in', async ({ page }) => {
  const contact = page.locator('#contact');
  await expect(contact).toBeVisible();
  const button = contact.locator('a.popup-cta');
  await expect(button).toHaveCount(1);
  await expect(button).toHaveText('Email me');
  await expect(button).toHaveAttribute('href', 'mailto:yml.lily@gmail.com');
});

test('no form anywhere on the page, no FormSubmit', async ({ page }) => {
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('input, textarea, select')).toHaveCount(0);
  const html = await page.content();
  expect(html).not.toMatch(/formsubmit/i);
});
