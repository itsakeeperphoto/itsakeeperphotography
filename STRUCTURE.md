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
| `/` | Homepage | 2026-08-17 |
| `/family-photographer-tri-cities-wa/` | Service | 2026-08-04 |
| `/newborn-photographer-tri-cities-wa/` | Service | 2026-08-17 |
| `/headshot-photographer-tri-cities-wa/` | Service | 2026-08-17 |
| `/about/` | About / trust | 2026-08-10 |
| `/reviews/` | Reviews / trust | 2026-08-12 |
| `/contact/` | Contact / conversion | 2026-08-17 |
| `/richland-wa-photographer/` | Service area | 2026-08-17 |
| `/kennewick-wa-photographer/` | Service area | 2026-08-17 |
| `/pasco-wa-photographer/` | Service area | 2026-08-17 |
| `/journal/` | Journal collection | 2026-08-14 |
| `/journal/family-photo-locations-tri-cities/` | Article | 2026-08-08 |
| `/journal/branding-photos-vs-headshots/` | Article | 2026-08-17 |

The release sitemap and `llms.txt` each contain the same 13 canonical URLs.

## Planned public architecture

### Services

- `/family-photographer-tri-cities-wa/` — ready and indexable
- `/senior-photographer-tri-cities-wa/` — draft; excluded
- `/newborn-photographer-tri-cities-wa/` — ready and indexable
- `/branding-photographer-tri-cities-wa/` — draft; excluded
- `/headshot-photographer-tri-cities-wa/` — ready and indexable; individual
  package and responsive/schema QA confirmed

### Trust and conversion

- `/investment/` — draft; excluded
- `/about/` — ready and indexable
- `/reviews/` — ready and indexable
- `/contact/` — ready and indexable

### Service areas

- `/richland-wa-photographer/` — ready and indexable
- `/kennewick-wa-photographer/` — ready and indexable
- `/pasco-wa-photographer/` — ready and indexable

These are three distinct city pages, below the location-page quality warning
threshold. Each must retain genuinely city-specific content before it is approved.

### Journal

- `/journal/` — ready and indexable as a `CollectionPage`, last modified
  `2026-08-14`
- `/journal/family-photo-locations-tri-cities/` — ready and indexable
- `/journal/when-to-book-senior-pictures-tri-cities/` — redesigned with a
  specialized article renderer; remains draft/noindex and excluded while the
  editorial date, district-specific evidence and Q54 remain pending
- `/journal/in-home-vs-studio-newborn-photography/` — redesigned with the
  specialized House Archive renderer and route-only CSS; remains draft/noindex,
  without dates and excluded from sitemap/`llms.txt` until Lisa approves the
  article, confirms the exact combined format and supplies a real date
- `/journal/branding-photos-vs-headshots/` — redesigned with the specialized
  Versus Axis renderer and route-only CSS; ready and indexable with publication
  and modification date `2026-08-11`

### Utilities

- `/privacy/` — noindex; excluded until the factual policy is approved
- `/thank-you/` — specialized post-submit confirmation; permanently noindex,
  excluded from sitemap/`llms.txt`, and still crawlable so robots can read the
  `noindex` directive
- `404.html` — host error artifact for every unknown URL; permanently noindex,
  omitted from the page manifest, sitemap and `llms.txt`, and served with an
  actual HTTP 404 instead of redirecting to Home
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
  uses exactly eight. About uses three internal route links, one protected hero
  hash and one external primary-source link to Issuu. Senior Timing uses exactly
  four route anchors — Senior twice, Locations once and Contact once — while its
  hero scroll control remains a button. Newborn Comparison uses exactly three
  route anchors — Family, Newborn and Contact, in that order — while its hero
  scroll control also remains a button. Branding vs. Headshots uses exactly
  three route anchors — Branding, Headshots and Contact, in that order — while
  its hero scroll control also remains a button. The Journal hub exposes exactly
  four route anchors — Locations Guide, Branding vs. Headshots, Reviews and
  Contact. Its Senior Timing and Newborn Comparison cards remain visible but
  non-interactive until those articles are published. Reviews exposes exactly
  two anchors inside `<main>`: the confirmed external Google review action and
  the internal Contact action, in that order. Its hero scroll remains a button,
  its Home social-proof summary is static text, and its journal adds no links.
  Thank-you exposes one Reviews anchor inside `<main>`; its hero scroll
  control remains a button and it must never add a second form or Contact CTA.
  The 404 artifact exposes exactly two recovery anchors inside `<main>`, Home
  followed by Reviews; its hero scroll remains a button.

The Reviews publication contract uses the shared service-page hero, the exact
Home `KindWords` component and the reusable six-page photo journal. It
contains 1 H1, 4 H2, 6 H3 and ten attributed testimonials, emits `WebPage` plus
`BreadcrumbList`, and deliberately omits `Review` and `AggregateRating` until
individual source URL/date/rating fields exist. It is `ready/index` with
`lastModified` `2026-08-12`; staging remains globally noindex. The shared book
uses hard-page 3D transforms for normal motion and preserves the direct
crossfade fallback under reduced motion.

The Journal hub publication contract preserves the existing overlap signature
and four-card editorial sequence. It emits exactly one canonical
`CollectionPage` and one `BreadcrumbList` Home → Journal, not an `Article` or
`Service`. No ready/index route or footer may link Senior Timing or Newborn
Comparison while either remains draft. Release includes the hub once with
`lastmod` `2026-08-14`; staging keeps the complete 20-route surface noindex and
its sitemap empty.

The Newborn Comparison release contract is intentionally stricter than its
visual completion: it renders one `Article`, one FAQ derived 1:1 from the three
visible questions and one `BreadcrumbList`, with no publication/modification
dates. Its exact 1 H1/8 H2/7 H3 hierarchy, complete ordered paragraph copy and
nine-image 7-informative/2-decorative inventory are validated, but none of those
facts authorizes indexing while `[VALIDAR CON LISA]`,
`[VALIDAR: formato exacto que ofrece Lisa]` and `[FECHA]` remain unresolved.

The Branding vs. Headshots publication contract uses Comp C / Impeccable
`Versus Axis`: one formal headshot proof faces an asymmetric branding library
across a central seam, followed by the source comparison as a semantic table.
Its exact 1 H1/8 H2/6 H3 hierarchy, three visible FAQ, five-item semantic list,
six-row table, three anchors and eleven unique images with an 8-informative /
3-decorative split are validated. It emits one `Article` dated `2026-08-11`,
one `FAQPage` derived 1:1 from the visible questions and one `BreadcrumbList`.
It does not turn editorial comparisons into `Service`, `Offer`, structured
duration or price claims. Its service destinations remain independently
`draft/noindex`.

## Publishing a draft route

Before adding a route to the release sitemap:

1. Resolve every registered content and media placeholder.
2. Mark the content file and `src/lib/page-manifest.ts` entry as `ready` and `index`.
3. Add the date of the last substantial page change as `lastModified`.
4. Remove its route-specific `X-Robots-Tag` noindex rule from
   `config/netlify-headers/release`.
5. Run a release build and `SITE_MODE=release npm run validate:site`.
