// Every external subresource the built site requests, mapped to a local
// fixture file in e2e/fixtures/.
//
// The test browser has no internet access, so the specs route each of these
// URLs to its fixture (see routeFixtures) and abort every other external
// request — the suite is hermetic and does not depend on the network at run
// time. Fixtures are downloaded on demand by download-fixtures.js and are
// gitignored; they are not committed to the repo.
const path = require('path');
const fs = require('fs');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

// CDN libraries the page loads (Bootstrap, jQuery, MixItUp, Magnific
// Popup, typed.js, Waypoints, FontAwesome).
const CDN = {
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css': { file: 'bootstrap.min.css', type: 'text/css' },
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css': { file: 'normalize.min.css', type: 'text/css' },
  'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css': { file: 'magnific-popup.min.css', type: 'text/css' },
  'https://use.fontawesome.com/817d2cd824.css': { file: 'fontawesome.css', type: 'text/css' },
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js': { file: 'jquery.min.js', type: 'application/javascript' },
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js': { file: 'bootstrap.min.js', type: 'application/javascript' },
  'https://cdnjs.cloudflare.com/ajax/libs/mixitup/2.1.11/jquery.mixitup.min.js': { file: 'mixitup.min.js', type: 'application/javascript' },
  'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js': { file: 'magnific-popup.min.js', type: 'application/javascript' },
  'https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.min.js': { file: 'waypoints.min.js', type: 'application/javascript' },
  'https://cdnjs.cloudflare.com/ajax/libs/typed.js/1.1.4/typed.min.js': { file: 'typed.min.js', type: 'application/javascript' },
};

// Hotlinked images (tile screenshots, award photos, logos). The HKCS, TWF
// and FISD photos are embedded in the page as base64 data URIs, so they
// need no fixture.
const IMAGES = {
  'https://iad.microlink.io/Cc4sCRm_d49Eyg1W8c-iMXRB-JEPBJmnhkCPODHGC-hJXV6a0MUzHn_n4K1AoB4UzZ5QN6hUrh_PmY6ykd099A.png': { file: 'screenshot-flashcard.png', type: 'image/png' },
  'https://iad.microlink.io/UUHF6AHqduKfEWw2FT6MpXQGFT8DUi6S9ZkHdkzJsQy1lkkTUIVbqdXrW2AsZ_rJekrthfPS5CVEhb4FrF26YA.png': { file: 'screenshot-freeaicommand.png', type: 'image/png' },
  'https://iad.microlink.io/ZRVTd0BdDPIu12GPRc5JegzcYUXUeEGx85_wE9jKgHbPL1D7Dio7IVuoDFJ4Viu879_afFqn6_TWSKfYmxC4aw.png': { file: 'screenshot-100-reasons.png', type: 'image/png' },
  'https://iad.microlink.io/bAUt-iTSb4MIKZqsy9nkf1P-sGtvE9NDfMY4WV5EPrXYpW0KauxPyPVM3gJFGIRrnKecka2hU1yM4Z1nfHnqEg.png': { file: 'screenshot-gender-reveal.png', type: 'image/png' },
  'https://iad.microlink.io/p8Kb0SF141p1Lc_27KLpixCXmqi0Y4G4jjJxYes6vo-sd-xpV_DJf-d5ybESr_T8BxxURWCTbNLlOyNsEgmA4A.png': { file: 'screenshot-maze.png', type: 'image/png' },
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEig1uqhX7jhhIAxI1fh84xySSbohcDp5_6kp4c1cN22fjJbtNKzt3Y7xULCRcuaodJhkwRnDEgBs1A8aYbl6pjCOMV5P2xzUaso8QRC8m9lkjR4gGoWqN8x8-P64r_x0Ar2rcM_Oq_jlZQ/s1600/Logo_cardboard_small.png?as=webp': { file: 'cardboard-logo.png', type: 'image/png' },
  'https://github.com/ymll/Andriod-App-World-Best-Airport/blob/master/app/src/main/res/drawable/airline.jpg?raw=true': { file: 'airline.jpg', type: 'image/jpeg' },
  'https://i0.wp.com/idsc.miami.edu/wp-content/uploads/2016/05/Hadoop-Map-Reduce-940x530-1.jpg?resize=940%2C530&ssl=1': { file: 'hadoop.jpg', type: 'image/jpeg' },
  'https://symphony.com/wp-content/uploads/2022/01/SYM-logo-640.png?as=webp': { file: 'symphony-logo.png', type: 'image/png' },
  'https://www.cpr.cuhk.edu.hk/wp-content/upload/resources/press/photo/546b100280f59.jpg': { file: 'igem-team.jpg', type: 'image/jpeg' },
  'https://www.cse.cuhk.edu.hk/wp-content/uploads/achievement/poster2.jpg': { file: 'hkie-poster.jpg', type: 'image/jpeg' },
  'https://www.erg.cuhk.edu.hk/erg/sites/default/files/n2.jpg': { file: 'hkie-trophy.jpg', type: 'image/jpeg' },
  'https://ymll.github.io/icon.png': { file: 'icon.png', type: 'image/png' },
  'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F57142317%2F244293980670%2F1%2Foriginal.20190220-190755?h=200&w=450&auto=compress&rect=0%2C40%2C3600%2C1800&s=87e55032808ce7aaf06a7eff8a80bb15': { file: 'kyc-hackathon.jpg', type: 'image/jpeg' },
};

const FIXTURES = { ...CDN, ...IMAGES };

// Route every external request the page makes to its local fixture, and
// abort anything else external (analytics, fonts) so a flaky network can
// never fail — or silently pass — a test. Local requests to the test
// server pass through untouched.
async function routeFixtures(page) {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1:4173')) return route.continue();
    const hit = FIXTURES[url];
    if (hit) {
      return route.fulfill({
        contentType: hit.type,
        body: fs.readFileSync(path.join(FIXTURES_DIR, hit.file)),
      });
    }
    return route.abort();
  });
}

module.exports = { FIXTURES, FIXTURES_DIR, routeFixtures };
