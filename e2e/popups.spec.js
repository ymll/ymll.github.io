// Popups: every tile/card opens a popup with a loaded image and exactly
// one real CTA button, and closes cleanly.
const { test, expect } = require('@playwright/test');
const { gotoHome, expectNoPageErrors, openPopup, closePopup, popupImage, isImageLoaded } = require('./helpers');

test.beforeEach(async ({ page }) => {
  const { response, errors } = await gotoHome(page);
  expect(response.status()).toBe(200);
  expectNoPageErrors(errors);
});

test('every tile and award card image loads (no broken images, no SVG fallback)', async ({ page }) => {
  const imgs = page.locator('a.work-popup img, .award-photo img');
  const count = await imgs.count();
  expect(count).toBeGreaterThan(20);
  for (let i = 0; i < count; i++) {
    const img = imgs.nth(i);
    const src = (await img.getAttribute('src')) || '';
    expect(await isImageLoaded(img), `image ${i} loaded: ${src.slice(0, 80)}`).toBe(true);
    expect(src, `image ${i} is a real image, not the SVG fallback`).not.toMatch(/^data:image\/svg\+xml/);
  }
});

test('real screenshots load on the new tiles, real photos on the award cards', async ({ page }) => {
  const tileSrc = async (href) =>
    page.locator(`a[href="${href}"] img`).first().getAttribute('src');
  expect(await tileSrc('#project-freeaicommand-popup')).toContain('iad.microlink.io');
  expect(await tileSrc('#project-maze-game-popup')).toContain('iad.microlink.io');
  expect(await tileSrc('#project-excuse-gen-popup')).toContain('iad.microlink.io');
  expect(await tileSrc('#project-gender-reveal-popup')).toContain('iad.microlink.io');
  expect(await tileSrc('#project-2048-popup')).toMatch(/\.webp$/);

  const awardSrc = async (label) =>
    page.evaluate((label) => {
      const card = [...document.querySelectorAll('.award-card')].find((c) => c.textContent.includes(label));
      return card ? card.querySelector('.award-photo img').getAttribute('src') : null;
    }, label);
  expect(await awardSrc('Super Girl')).toMatch(/^data:image\/jpeg;base64/);
  expect(await awardSrc('Girls Go Tech')).toMatch(/^data:image\/jpeg;base64/);
  expect(await awardSrc('FISD')).toMatch(/^data:image\/jpeg;base64/);
  expect(await awardSrc('iGEM')).toContain('546b100280f59.jpg');
  expect(await awardSrc('HKIE')).toContain('n2.jpg');
});

// Spot-checked popups: image loaded, exactly one CTA with the right label
// and destination, close button visible, Escape closes cleanly.
const POPUP_CASES = [
  { href: '#project-2048-popup', cta: 'Try this now', ctaHref: 'https://ymll.github.io/2048/' },
  { href: '#project-freeaicommand-popup', cta: 'Try this now', ctaHref: 'https://freeaicommand.com' },
  { href: '#project-maze-game-popup', cta: 'Try this now', ctaHref: 'https://ymll.github.io/maze-game' },
  { href: '#project-excuse-gen-popup', cta: 'Try this now', ctaHref: 'https://ymll.github.io/100-WFH-Reasons/' },
  { href: '#project-gender-reveal-popup', cta: 'Try this now', ctaHref: 'https://theannounce.com' },
  { href: '#award-hkcs-popup', cta: 'More details on the official site', ctaHref: 'https://www.hkcs.org.hk/wp-content/uploads/Publication/Press_Release/20151209_HKCS-45th-Anniversay-Awards-Presentation-Ceremony_Press-Release_Eng.pdf' },
  { href: '#award-twf-popup', cta: 'More details on the official site', ctaHref: 'https://twfhk.org/wp-content/uploads/2024/08/twf_2021_ggt_stem_competition_march_13_english-1.pdf' },
  { href: '#award-fisd-popup', cta: 'More details on the official site', ctaHref: 'https://fisd.net/events/fisd-hong-kong/' },
  { href: '#award-igem-popup', cta: 'More details on the official site', ctaHref: 'https://www.cpr.cuhk.edu.hk/en/press/cuhk-genetic-engineering-team-won-gold-award-in-boston/' },
  { href: '#award-hkie-popup', cta: 'More details on the official site', ctaHref: 'https://www.erg.cuhk.edu.hk/erg/node/36' },
];

for (const c of POPUP_CASES) {
  test(`popup ${c.href} has a loaded image, one CTA (${c.cta}) and closes`, async ({ page }) => {
    await openPopup(page, c.href);
    const img = popupImage(page);
    await expect(img).toBeVisible();
    expect(await isImageLoaded(img)).toBe(true);
    const ctas = page.locator('.mfp-content .popup-cta');
    await expect(ctas).toHaveCount(1);
    await expect(ctas.first()).toHaveText(c.cta);
    await expect(ctas.first()).toHaveAttribute('href', c.ctaHref);
    await expect(page.locator('.mfp-close')).toBeVisible();
    await closePopup(page);
  });
}

test('every popup on the page has exactly one CTA button', async ({ page }) => {
  const counts = await page.evaluate(() =>
    [...document.querySelectorAll('.work-items-popup')].map((p) => ({
      id: p.id,
      ctas: p.querySelectorAll('.popup-cta').length,
    }))
  );
  expect(counts.length).toBeGreaterThan(20);
  for (const { id, ctas } of counts) {
    expect(ctas, `popup #${id} has exactly one CTA`).toBe(1);
  }
});
