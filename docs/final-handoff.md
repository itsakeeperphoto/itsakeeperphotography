# It's A Keeper Photography — implementation and verification handoff

Verification date: 2026-07-21

## Build status

- Implemented 21 public routes: the 18 primary routes, retained `/portfolio/`, `/privacy/`, and `/thank-you/`.
- The rendered Netlify foundation remained the homepage authority. Its approved sequence and geometry were preserved while the missing homepage content, five-service treatment, city section, FAQ, full footer, real navigation, and earth-and-gold palette were added.
- The current generated output is `SITE_MODE=staging`: Netlify-origin canonicals, global `noindex,nofollow,noarchive`, an empty sitemap, and a staging-only `llms.txt` notice.
- A separate `SITE_MODE=release` build was generated and validated before returning the output to staging. It uses the custom-domain origin and indexes only manifest entries that are both ready and explicitly indexable.
- No DNS, Netlify primary-domain, or production-domain setting was changed.

## Required skills and stages

| Skill/tool | Stage used | Material effect |
| --- | --- | --- |
| `frontend-design` | Before implementation | Established the composition direction from the deployed Netlify homepage, palette image, inspiration image, and `DESIGN.md`; protected the foundation geometry. |
| `emil-design-eng` | Before implementation | Set the hierarchy, whitespace, typography, overlap, and construction-line rules for the new route families. |
| `impeccable` | Throughout implementation | Drove the tokenized spacing/color system, semantic markup, source cleanup, accessible states, and removal of temporary/fake behavior. |
| `firecrawl` | Before new page-family composition and before redirects | Studied editorial photography composition patterns; later mapped the old custom-domain URLs only for one-to-one redirect preservation. The old site did not inform design or copy. |
| `playwright-cli` | Continuously and at the final staging gate | Verified all 21 routes at 1440×1000, 1200×900, 900×900, and 390×844; produced the final 84 screenshots and a zero-failure matrix. |
| Chrome DevTools MCP | Final release audit | Ran mobile and desktop Lighthouse categories, performance traces, computed contrast/state checks, and low-brightness visual checks across all 21 routes. |

## Final Playwright evidence — 84 screenshots

All paths are relative to the repository root.

| Route | 1440×1000 | 1200×900 | 900×900 | 390×844 |
| --- | --- | --- | --- | --- |
| `/` | `artifacts/qa/home/1440x1000.png` | `artifacts/qa/home/1200x900.png` | `artifacts/qa/home/900x900.png` | `artifacts/qa/home/390x844.png` |
| `/family-photographer-tri-cities-wa/` | `artifacts/qa/family/1440x1000.png` | `artifacts/qa/family/1200x900.png` | `artifacts/qa/family/900x900.png` | `artifacts/qa/family/390x844.png` |
| `/senior-photographer-tri-cities-wa/` | `artifacts/qa/seniors/1440x1000.png` | `artifacts/qa/seniors/1200x900.png` | `artifacts/qa/seniors/900x900.png` | `artifacts/qa/seniors/390x844.png` |
| `/newborn-photographer-tri-cities-wa/` | `artifacts/qa/newborn/1440x1000.png` | `artifacts/qa/newborn/1200x900.png` | `artifacts/qa/newborn/900x900.png` | `artifacts/qa/newborn/390x844.png` |
| `/branding-photographer-tri-cities-wa/` | `artifacts/qa/branding/1440x1000.png` | `artifacts/qa/branding/1200x900.png` | `artifacts/qa/branding/900x900.png` | `artifacts/qa/branding/390x844.png` |
| `/headshot-photographer-tri-cities-wa/` | `artifacts/qa/headshots/1440x1000.png` | `artifacts/qa/headshots/1200x900.png` | `artifacts/qa/headshots/900x900.png` | `artifacts/qa/headshots/390x844.png` |
| `/investment/` | `artifacts/qa/investment/1440x1000.png` | `artifacts/qa/investment/1200x900.png` | `artifacts/qa/investment/900x900.png` | `artifacts/qa/investment/390x844.png` |
| `/about/` | `artifacts/qa/about/1440x1000.png` | `artifacts/qa/about/1200x900.png` | `artifacts/qa/about/900x900.png` | `artifacts/qa/about/390x844.png` |
| `/reviews/` | `artifacts/qa/reviews/1440x1000.png` | `artifacts/qa/reviews/1200x900.png` | `artifacts/qa/reviews/900x900.png` | `artifacts/qa/reviews/390x844.png` |
| `/contact/` | `artifacts/qa/contact/1440x1000.png` | `artifacts/qa/contact/1200x900.png` | `artifacts/qa/contact/900x900.png` | `artifacts/qa/contact/390x844.png` |
| `/richland-wa-photographer/` | `artifacts/qa/richland/1440x1000.png` | `artifacts/qa/richland/1200x900.png` | `artifacts/qa/richland/900x900.png` | `artifacts/qa/richland/390x844.png` |
| `/kennewick-wa-photographer/` | `artifacts/qa/kennewick/1440x1000.png` | `artifacts/qa/kennewick/1200x900.png` | `artifacts/qa/kennewick/900x900.png` | `artifacts/qa/kennewick/390x844.png` |
| `/pasco-wa-photographer/` | `artifacts/qa/pasco/1440x1000.png` | `artifacts/qa/pasco/1200x900.png` | `artifacts/qa/pasco/900x900.png` | `artifacts/qa/pasco/390x844.png` |
| `/journal/` | `artifacts/qa/journal/1440x1000.png` | `artifacts/qa/journal/1200x900.png` | `artifacts/qa/journal/900x900.png` | `artifacts/qa/journal/390x844.png` |
| `/journal/family-photo-locations-tri-cities/` | `artifacts/qa/journal-family-locations/1440x1000.png` | `artifacts/qa/journal-family-locations/1200x900.png` | `artifacts/qa/journal-family-locations/900x900.png` | `artifacts/qa/journal-family-locations/390x844.png` |
| `/journal/when-to-book-senior-pictures-tri-cities/` | `artifacts/qa/journal-senior-timing/1440x1000.png` | `artifacts/qa/journal-senior-timing/1200x900.png` | `artifacts/qa/journal-senior-timing/900x900.png` | `artifacts/qa/journal-senior-timing/390x844.png` |
| `/journal/in-home-vs-studio-newborn-photography/` | `artifacts/qa/journal-newborn-comparison/1440x1000.png` | `artifacts/qa/journal-newborn-comparison/1200x900.png` | `artifacts/qa/journal-newborn-comparison/900x900.png` | `artifacts/qa/journal-newborn-comparison/390x844.png` |
| `/journal/branding-photos-vs-headshots/` | `artifacts/qa/journal-branding-vs-headshots/1440x1000.png` | `artifacts/qa/journal-branding-vs-headshots/1200x900.png` | `artifacts/qa/journal-branding-vs-headshots/900x900.png` | `artifacts/qa/journal-branding-vs-headshots/390x844.png` |
| `/portfolio/` | `artifacts/qa/portfolio/1440x1000.png` | `artifacts/qa/portfolio/1200x900.png` | `artifacts/qa/portfolio/900x900.png` | `artifacts/qa/portfolio/390x844.png` |
| `/privacy/` | `artifacts/qa/privacy/1440x1000.png` | `artifacts/qa/privacy/1200x900.png` | `artifacts/qa/privacy/900x900.png` | `artifacts/qa/privacy/390x844.png` |
| `/thank-you/` | `artifacts/qa/thank-you/1440x1000.png` | `artifacts/qa/thank-you/1200x900.png` | `artifacts/qa/thank-you/900x900.png` | `artifacts/qa/thank-you/390x844.png` |

Final Playwright result: 21 routes × 4 breakpoints = 84 screenshots, 0 failures. The assertions covered HTTP status, horizontal overflow, body copy below 16 px, broken/undimensioned images, body internal-link counts above four, signature devices, staging robots, unresolved placeholder leakage, current-page navigation, menu open/outside-click/Escape/focus return, mobile scroll lock, visible keyboard focus, console errors, network failures, and reduced motion.

## Lighthouse and performance scores

Chrome DevTools MCP's Lighthouse integration supplied Accessibility, Best Practices, SEO, and Agentic Browsing. It excludes the Performance category, so Lighthouse CLI 13.4.1 supplied Performance. Performance was measured through `scripts/serve-dist.mjs`, which applies Brotli/Gzip like Netlify; Astro's uncompressed preview otherwise transfers approximately 121–124 KB of raw inline HTML and produces a deployment-unrepresentative LCP penalty.

Each cell is `Performance / LCP / CLS`.

| Route | Mobile | Desktop | A11y / Best Practices / SEO, both devices |
| --- | ---: | ---: | ---: |
| `/` | 98 / 2.261s / 0.026 | 100 / 0.483s / 0.015 | 100 / 100 / 100 |
| `/family-photographer-tri-cities-wa/` | 100 / 1.652s / 0.000 | 100 / 0.363s / 0.004 | 100 / 100 / 69* |
| `/senior-photographer-tri-cities-wa/` | 100 / 1.653s / 0.013 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/newborn-photographer-tri-cities-wa/` | 100 / 1.652s / 0.012 | 100 / 0.362s / 0.004 | 100 / 100 / 69* |
| `/branding-photographer-tri-cities-wa/` | 100 / 1.652s / 0.011 | 100 / 0.363s / 0.001 | 100 / 100 / 69* |
| `/headshot-photographer-tri-cities-wa/` | 100 / 1.652s / 0.012 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/investment/` | 100 / 1.651s / 0.012 | 100 / 0.361s / 0.001 | 100 / 100 / 69* |
| `/about/` | 100 / 1.653s / 0.000 | 100 / 0.370s / 0.011 | 100 / 100 / 69* |
| `/reviews/` | 100 / 1.652s / 0.000 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/contact/` | 99 / 2.187s / 0.009 | 100 / 0.477s / 0.006 | 100 / 100 / 69* |
| `/richland-wa-photographer/` | 100 / 1.652s / 0.010 | 100 / 0.361s / 0.011 | 100 / 100 / 69* |
| `/kennewick-wa-photographer/` | 100 / 1.655s / 0.010 | 100 / 0.362s / 0.011 | 100 / 100 / 69* |
| `/pasco-wa-photographer/` | 100 / 1.651s / 0.009 | 100 / 0.362s / 0.006 | 100 / 100 / 69* |
| `/journal/` | 100 / 1.659s / 0.018 | 100 / 0.361s / 0.001 | 100 / 100 / 69* |
| `/journal/family-photo-locations-tri-cities/` | 100 / 1.502s / 0.049 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/journal/when-to-book-senior-pictures-tri-cities/` | 100 / 1.502s / 0.000 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/journal/in-home-vs-studio-newborn-photography/` | 100 / 1.502s / 0.000 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/journal/branding-photos-vs-headshots/` | 100 / 1.652s / 0.000 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/portfolio/` | 98 / 2.255s / 0.001 | 100 / 0.508s / 0.002 | 100 / 100 / 100 |
| `/privacy/` | 100 / 1.503s / 0.005 | 100 / 0.362s / 0.001 | 100 / 100 / 69* |
| `/thank-you/` | 100 / 1.502s / 0.006 | 100 / 0.370s / 0.001 | 100 / 100 / 69* |

`*` The only scored SEO failure is `is-crawlable`, caused by the intentional release-mode `noindex,nofollow,noarchive` gate. This warning is expected until that route's content status changes to ready; `/thank-you/` remains noindex permanently. Agentic Browsing was 100 for every route/device.

All Performance targets pass. The homepage's optimized 640 px mobile AVIF produced a second confirmation run of 99 Performance / 1.953s LCP. The recorded report above is the more conservative passing run.

Chrome DevTools traces recorded observed mobile LCP values from approximately 0.417s to 1.240s. Computed visible text passed WCAG AA; the weakest accepted text pair is 4.61:1. Tested normal, hover, keyboard focus, invalid, and error states pass, including 6.86:1 form-error text on warm earth, 7.50:1 invalid borders on ivory, and a 13.48:1 focus ring on light controls. Every 30–35% brightness capture remained legible.

## Composition-device ledger

The manifest retains the intended future signature for each route. Where verified route-specific photography is missing, the module that would require it is unrendered and the present composition uses a visible 1 px crossing construction line. That preserves an art-directed composition without inventing or reusing false-location media.

| Route | Manifest signature | Visible final-staging device |
| --- | --- | --- |
| `/` | overlap | Layered arch/rectangular photography and crossing construction lines |
| `/family-photographer-tri-cities-wa/` | overlap | Crossing 1 px construction lines; overlap waits for verified family media |
| `/senior-photographer-tri-cities-wa/` | arch | Crossing 1 px construction lines; arch waits for verified senior media |
| `/newborn-photographer-tri-cities-wa/` | crossing-line | Crossing 1 px construction lines |
| `/branding-photographer-tri-cities-wa/` | overlap | Crossing 1 px construction lines; overlap waits for verified branding media |
| `/headshot-photographer-tri-cities-wa/` | arch | Crossing 1 px construction lines; arch waits for verified headshot media |
| `/investment/` | crossing-line | Crossing 1 px construction lines |
| `/about/` | arch | Crossing 1 px construction lines; arch waits for approved personal media |
| `/reviews/` | crossing-line | Crossing 1 px construction lines |
| `/contact/` | overlap | Crossing 1 px construction lines plus the preserved photographic inquiry print |
| `/richland-wa-photographer/` | arch | Crossing 1 px construction lines; arch waits for verified Richland media |
| `/kennewick-wa-photographer/` | overlap | Crossing 1 px construction lines; overlap waits for verified Kennewick media |
| `/pasco-wa-photographer/` | crossing-line | Crossing 1 px construction lines |
| `/journal/` | overlap | Crossing 1 px construction lines; guide imagery remains gated |
| `/journal/family-photo-locations-tri-cities/` | arch | Crossing 1 px comparison/location ledger; arch waits for verified location media |
| `/journal/when-to-book-senior-pictures-tri-cities/` | crossing-line | Crossing 1 px construction lines |
| `/journal/in-home-vs-studio-newborn-photography/` | overlap | Crossing 1 px comparison ledger; overlap waits for verified newborn-format media |
| `/journal/branding-photos-vs-headshots/` | crossing-line | Crossing 1 px comparison ledger |
| `/portfolio/` | overlap | Layered page-turning paper, overlapping prints, and visible book edges |
| `/privacy/` | crossing-line | Crossing 1 px construction lines |
| `/thank-you/` | arch | Crossing 1 px construction lines; no invented confirmation photograph |

No route lacks all three qualifying devices. Therefore there is no page requiring an exception for having no overlap, crossing hairline, or arch.

## Draft and unresolved-content registry

Exact unresolved placeholders are preserved as 58 `CONTENT PENDING` comments in `src/content/pending.ts`; none render into HTML. Counts by route:

| Route | Pending comments |
| --- | ---: |
| `/` | 2 |
| `/about/` | 6 |
| `/branding-photographer-tri-cities-wa/` | 2 |
| `/contact/` | 2 |
| `/family-photographer-tri-cities-wa/` | 1 |
| `/headshot-photographer-tri-cities-wa/` | 1 |
| `/investment/` | 9 |
| `/journal/branding-photos-vs-headshots/` | 1 |
| `/journal/family-photo-locations-tri-cities/` | 6 |
| `/journal/in-home-vs-studio-newborn-photography/` | 3 |
| `/journal/when-to-book-senior-pictures-tri-cities/` | 3 |
| `/kennewick-wa-photographer/` | 3 |
| `/newborn-photographer-tri-cities-wa/` | 1 |
| `/pasco-wa-photographer/` | 3 |
| `/privacy/` | 1 |
| `/reviews/` | 8 |
| `/richland-wa-photographer/` | 4 |
| `/senior-photographer-tri-cities-wa/` | 2 |

The unresolved groups are: approved personal/credential details; current review-count freshness, attributed reviews, and Google links; exact packages, deliverables, turnaround, retainer, rescheduling, travel, and product policies; newborn/branding/headshot formats and licensing; verified local spots, access/permit facts, district dates, and first-hand details; route-specific real city imagery and alt text; article dates; and approved legal privacy copy. `/journal/` has no literal placeholder but remains draft while its linked guides are gated.

Manifest state is 18 draft/noindex routes, two ready/index routes (`/` and `/portfolio/`), and one ready/permanent-noindex utility (`/thank-you/`). The homepage's supplied “96” copy is preserved exactly, but its freshness check is registered for cutover. No `Review` or `AggregateRating` schema is emitted.

## Netlify Forms

The fake `/api/inquiry`, simulated success behavior, and PII console logging were removed. Both the homepage planner and `/contact/` contain a statically detectable form with:

- Homepage planner: `name="session-inquiry"`
- Contact price estimator: `name="session-estimate"`
- `method="post"`
- `action="/thank-you/"`
- `data-netlify="true"`
- `netlify-honeypot="bot-field"`
- matching hidden `form-name` value for each form
- `session_type`, `season`, `location_preference`, `story`, `name`, `email`, and `phone`

The build validator and no-JavaScript HTML inspection both pass. With JavaScript disabled, every field remains visible and submittable.

External dashboard proof is not complete: this checkout has no `NETLIFY_AUTH_TOKEN` and no `.netlify/state.json` site link, so a deploy-preview submission cannot be made or verified in the client's Netlify Forms dashboard from this workspace. This is an account-access gate, not an implementation fallback. Once the repository is linked/authenticated, submit clearly labeled QA entries on a deploy preview and confirm they appear under `session-inquiry` and `session-estimate` before launch.

## Redirects

`public/_redirects` contains 27 intent-matched 301 redirects based on the Firecrawl legacy-URL map. There is no catch-all homepage redirect. The source mapping and the two intentionally unmapped low-confidence archives are documented in `docs/legacy-redirect-inventory.md`.

## Crawler-output membership

### Current staging output

- Canonical origin: `https://itsakeeperphotography.netlify.app`
- HTML robots: `noindex,nofollow,noarchive` on every public route
- Netlify `X-Robots-Tag`: global noindex plus no-store rules for Admin/Tina endpoints
- `sitemap.xml`: valid empty URL set
- `robots.txt`: allows crawling so page-level noindex can be observed; does not advertise a release sitemap
- `llms.txt`: staging notice only; no page membership

### Release-mode output

- Canonical origin: `https://www.itsakeeperphotography.com`
- `sitemap.xml`: `/` and `/portfolio/` only
- `llms.txt`: `/` only
- `robots.txt`: allows public crawling, disallows `/admin/` and `/tina-island/`, and advertises the custom-domain sitemap
- Drafts, `/privacy/`, and `/thank-you/`: excluded from sitemap/`llms.txt` and protected by metadata plus route-specific `X-Robots-Tag`
- Versioned Astro/font/vendor assets: one-year immutable cache
- Mutable uploads: one-day cache with seven-day stale-while-revalidate

Use `SITE_MODE=staging` until the content registry is resolved. At authorized cutover, use `SITE_MODE=release`, verify the custom domain as Netlify's primary domain, confirm every canonical, regenerate the three crawler files, enable only newly ready routes, and only then redirect the Netlify subdomain to the custom primary domain.

## Verification commands

- `SITE_MODE=release npm run build:local` — passed, 21 public routes validated.
- `SITE_MODE=staging npm run build:local` — passed, 21 public routes validated; this is the current output.
- `playwright-cli ... scripts/playwright-evidence.js` — 84 screenshots, 0 failures.
- `git diff --check` — passed.
