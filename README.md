# taehyun.me

Personal website for Taehyun Yang.

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
