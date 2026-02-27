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
