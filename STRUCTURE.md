# Sitemap and Search Architecture

This site uses one canonical XML sitemap at `/sitemap.xml`. A sitemap index is not
needed: the site is far below the 50,000-URL protocol limit, and a single file is
clearer for Google Search Console and Bing Webmaster Tools.

## Environment behavior

| Build mode | Sitemap behavior | Canonical origin |
| --- | --- | --- |
| `SITE_MODE=staging` | Valid but empty `<urlset>` | `https://itsakeeperphotography.netlify.app` |
| `SITE_MODE=release` | Includes only approved, indexable canonical routes | `https://www.itsakeeperphotography.com` |

The release sitemap includes a route only when its manifest entry has all three
signals:

1. `contentStatus: "ready"`
2. `searchVisibility: "index"`
3. `sitemap: true`

Every included route must also declare an accurate `lastModified` date in
`YYYY-MM-DD` format. The build fails instead of publishing an incomplete sitemap
entry when that date is missing.

## Current release sitemap

| URL | Page type | Last substantial update |
| --- | --- | --- |
| `/` | Homepage | 2026-08-04 |
| `/family-photographer-tri-cities-wa/` | Service | 2026-08-04 |
| `/richland-wa-photographer/` | Service area | 2026-08-09 |
| `/kennewick-wa-photographer/` | Service area | 2026-08-09 |
| `/pasco-wa-photographer/` | Service area | 2026-08-09 |
| `/journal/family-photo-locations-tri-cities/` | Article | 2026-08-08 |
| `/portfolio/` | Portfolio | 2026-07-21 |

## Planned public architecture

### Services

- `/family-photographer-tri-cities-wa/` — ready and indexable
- `/senior-photographer-tri-cities-wa/` — draft; excluded
- `/newborn-photographer-tri-cities-wa/` — draft; excluded
- `/branding-photographer-tri-cities-wa/` — draft; excluded
- `/headshot-photographer-tri-cities-wa/` — draft; excluded

### Trust and conversion

- `/investment/` — draft; excluded
- `/about/` — draft; excluded
- `/reviews/` — draft; excluded
- `/contact/` — draft; excluded

### Service areas

- `/richland-wa-photographer/` — ready and indexable
- `/kennewick-wa-photographer/` — ready and indexable
- `/pasco-wa-photographer/` — ready and indexable

These are three distinct city pages, below the location-page quality warning
threshold. Each must retain genuinely city-specific content before it is approved.

### Journal

- `/journal/` — draft; excluded
- `/journal/family-photo-locations-tri-cities/` — ready and indexable
- `/journal/when-to-book-senior-pictures-tri-cities/` — draft; excluded
- `/journal/in-home-vs-studio-newborn-photography/` — draft; excluded
- `/journal/branding-photos-vs-headshots/` — draft; excluded

### Portfolio and utilities

- `/portfolio/` — ready and indexable
- `/privacy/` — noindex; excluded until the factual policy is approved
- `/thank-you/` — permanently noindex and excluded
- `/admin/` and `/tina-island/` — administrative routes; excluded and blocked from indexing

## Quality rules

- HTTPS canonical URLs only.
- One trailing-slash URL format; no query strings or fragments.
- No redirected, duplicate, draft, noindex, utility, or administrative URLs.
- Accurate `<lastmod>` values only; never substitute the build date.
- No `<priority>` or `<changefreq>` tags because search engines ignore them.
- Release `robots.txt` advertises the custom-domain sitemap; staging does not.
- Validation compares sitemap membership with the canonical URLs of every
  indexable release page, so a mismatch fails the build.
- Body content uses at most four internal links except the approved Richland and
  Kennewick service directories, which each use exactly nine, and Pasco, which
  uses exactly eight.

## Publishing a draft route

Before adding a route to the release sitemap:

1. Resolve every registered content and media placeholder.
2. Mark the content file and `src/lib/page-manifest.ts` entry as `ready` and `index`.
3. Add the date of the last substantial page change as `lastModified`.
4. Remove its route-specific `X-Robots-Tag` noindex rule from
   `config/netlify-headers/release`.
5. Run a release build and `SITE_MODE=release npm run validate:site`.
