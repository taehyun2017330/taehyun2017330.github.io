# taehyun.me

Personal website for Taehyun Yang.

## Search visibility and production builds

Run `npm run build` to produce the complete deployable site in `build/`.
The postbuild step renders the actual React homepage into HTML, including the
biography, publications, news, and links. It reads the same YAML content used by
the browser, so edits do not need to be duplicated in a static fallback.
React hydrates this HTML to enable the seasonal controls and other interactions.
The server renderer uses the Webpack/Babel tooling bundled with `react-scripts`.

`npm run verify:seo` checks the built HTML, canonical URLs, structured data,
sitemap, and React hydration, including unavailable content requests, another
browser locale, and a later season. It runs automatically after every build.
The development server remains client-rendered; inspect `build/index.html` when
checking the HTML available to crawlers.

- Edit homepage search/social metadata and profile JSON-LD in `public/index.html`.
- Add new public page URLs to `public/sitemap.xml`, and give each page its own canonical URL.
- Rebuild and publish after changing YAML or source files, so the initial HTML stays current.
- Keep `CNAME`, `.nojekyll`, `robots.txt`, and `sitemap.xml` when copying the build to GitHub Pages.

The public repository is
[taehyun2017330/taehyun2017330.github.io](https://github.com/taehyun2017330/taehyun2017330.github.io).
Its `main` branch contains both source files and deployed root assets. GitHub
Pages deploys the repository root from `main`. To publish from a Git checkout,
build the site, copy the contents of `build/` to the repository root, review and
commit the source and generated changes, and push `main`. Preserve source files,
other project pages, and older hashed assets that cached pages may still request.
The existing `npm run deploy` command targets a `gh-pages` branch and does not
match this repository's current Pages setup. When working from a local folder
without `.git`, apply the changes in a fresh clone of the repository before pushing.

After publishing:

1. Add or select `taehyun.me` in [Google Search Console](https://search.google.com/search-console)
   and verify ownership if needed. A Domain property uses a DNS TXT record;
   a URL-prefix property for `https://taehyun.me/` can use Google's HTML file/tag.
   Keep any supplied verification HTML file in `public/`, or its meta tag in `public/index.html`.
2. Inspect `https://taehyun.me/`. Check indexing status, Google's selected canonical,
   and the rendered HTML. Run **Test live URL**, then **Request indexing**.
3. Submit `https://taehyun.me/sitemap.xml` in the Sitemaps report.
4. Track impressions and clicks for your name in Search Console's Performance report.
5. Ensure Scholar, GitHub, LinkedIn, your lab profile, and paper/project author links
   point to `https://taehyun.me/`. UMD already links there. Over time, add research
   pages with a readable title, authors, short abstract, and paper/code links.

Google says recrawling may take days to weeks, and neither a crawl request nor
these changes guarantee indexing or a particular ranking:
[requesting recrawls](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl),
[JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## Content Management (YAML)

All core site content is editable in YAML files under `public/content`:

- `public/content/publications.yml`
- `public/content/news.yml`
- `public/content/travel.yml`
- `public/content/travel-routes.yml`
- `public/content/content-index.yml` (maintenance index for content owners)

For publications, set `year` explicitly to control grouping and ordering.

## Asset Organization

Static files are organized under `public/assets`:

- `public/assets/images/logos` (institution/company logos)
- `public/assets/images/profile` (avatar, profile, profile-base SVG)
- `public/assets/images/misc` (small decorative/support images)
- `public/assets/images/illustrations` (map/illustration SVGs)
- `public/assets/audio` (name pronunciation audio, etc.)
- `public/assets/docs` (CV and downloadable docs)

Keep YAML references as absolute public paths, e.g.:

- `/assets/images/logos/adobe.png`
- `/assets/audio/name.m4a`
- `/assets/docs/Taehyun_CV.pdf`

## Visitor Counter

The footer supports a GoatCounter-based visitor count, which works on GitHub Pages.

1. Create a GoatCounter site.
2. Set your GoatCounter site code in `src/config/analytics.js`:

```js
export const GOATCOUNTER_CODE = "your-site-code";
```

3. In GoatCounter settings, enable `Allow adding visitor counts on your website`.

If `GOATCOUNTER_CODE` is left blank, the footer shows `Visitors: --`.
