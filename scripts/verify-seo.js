const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const buildDir = path.resolve(__dirname, "../build");
const homepage = "https://taehyun.me/";
const html = fs.readFileSync(path.join(buildDir, "index.html"), "utf8");
const staticDom = new JSDOM(html, { url: homepage });
const document = staticDom.window.document;
const initialState = JSON.parse(document.getElementById("initial-state").textContent);

assert.equal(document.title, "Taehyun Yang | HAI Researcher @UMD");
assert.equal(document.querySelector('link[rel="canonical"]').href, homepage);
assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
assert(document.querySelector('meta[name="description"]').content.length > 80);
assert.equal(document.querySelectorAll("h1").length, 1);
assert.equal(document.querySelector("h1").textContent, "Taehyun Yang");
assert.match(document.querySelector("main").textContent, /University of Maryland/);
assert.match(document.querySelector("main").textContent, /human decision-making/);
assert(!document.body.textContent.includes("You need to enable JavaScript"));
assert(!document.body.textContent.includes("No publications found."));
assert(document.querySelector('a[href="#publications"]'));

for (const publication of initialState.content.publications) {
  assert(document.querySelector("#publications").textContent.includes(publication.title));
  for (const key of ["pdf", "website", "code"]) {
    if (publication[key]) {
      assert(Array.from(document.querySelectorAll("#publications a")).some((a) => a.getAttribute("href") === publication[key]));
    }
  }
}

const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  .map((script) => JSON.parse(script.textContent));
assert(structuredData.length > 0);
assert(JSON.stringify(structuredData).includes("ProfilePage"));
assert(JSON.stringify(structuredData).includes("Person"));

const sitemap = new JSDOM(fs.readFileSync(path.join(buildDir, "sitemap.xml"), "utf8"), { contentType: "text/xml" });
const sitemapUrls = Array.from(sitemap.window.document.querySelectorAll("loc"), (loc) => loc.textContent);
assert(sitemapUrls.includes(homepage));
assert(sitemapUrls.includes(`${homepage}trace-aware-workflows/`));
for (const url of sitemapUrls) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, new URL(homepage).origin);
  const page = new JSDOM(fs.readFileSync(path.join(buildDir, parsed.pathname, "index.html"), "utf8"), { url });
  assert.equal(page.window.document.querySelector('link[rel="canonical"]').href, url);
  assert(!page.window.document.querySelector('meta[name="robots"][content*="noindex"]'));
  page.window.close();
}
assert.match(fs.readFileSync(path.join(buildDir, "robots.txt"), "utf8"), /Sitemap: https:\/\/taehyun\.me\/sitemap\.xml/);

async function verifyHydration({ offline, futureDate = false, locale = "en-US" }) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", (...args) => errors.push(args.join(" ")));
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));
  const dom = new JSDOM(html, { url: `${homepage}#publications`, runScripts: "outside-only", pretendToBeVisual: true, virtualConsole });
  const { window } = dom;
  const originalHeading = window.document.querySelector("h1");
  const originalPublication = window.document.querySelector("#publications a");
  const nativeToLocaleString = window.Number.prototype.toLocaleString;
  window.Number.prototype.toLocaleString = function (requestedLocale, options) {
    return nativeToLocaleString.call(this, requestedLocale || locale, options);
  };
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
  window.HTMLMediaElement.prototype.pause = () => {};
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.fetch = async (url) => {
    const request = new URL(url, homepage);
    if (offline || request.origin !== new URL(homepage).origin) throw new Error("Network unavailable during verification");
    const text = fs.readFileSync(path.join(buildDir, request.pathname), "utf8");
    return { ok: true, text: async () => text, json: async () => JSON.parse(text) };
  };
  if (futureDate) {
    const NativeDate = window.Date;
    window.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : ["2030-01-15T12:00:00Z"])); }
      static now() { return new NativeDate("2030-01-15T12:00:00Z").getTime(); }
    };
  }

  try {
    for (const script of window.document.querySelectorAll("script[src]")) {
      const src = new URL(script.src);
      assert.equal(src.origin, new URL(homepage).origin);
      window.eval(fs.readFileSync(path.join(buildDir, src.pathname), "utf8"));
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    assert.equal(window.document.querySelector("h1"), originalHeading, "Hydration must reuse the initial HTML");
    assert.equal(window.document.querySelector("#publications a"), originalPublication);
    assert.equal(window.location.hash, "#publications");
    assert(!window.document.body.textContent.includes("No publications found."));
    if (futureDate) {
      assert.equal(window.document.documentElement.dataset.theme, "winter");
      assert.match(window.document.querySelector("#about").textContent, /fifth-year/);
    }
    const nextTheme = window.document.querySelector('.season-grid-button:not(.is-active)');
    nextTheme.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert(nextTheme.classList.contains("is-active"), "Theme controls must still work after hydration");
    assert.deepEqual(errors, [], "Browser startup must not produce hydration or runtime errors");
  } finally {
    window.close();
  }
}

(async () => {
  await verifyHydration({ offline: false });
  await verifyHydration({ offline: true, futureDate: true, locale: "de-DE" });
  console.log("SEO checks passed: readable HTML, metadata, sitemap, hydration across locales, offline content, and seasonal controls.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  staticDom.window.close();
  sitemap.window.close();
});
