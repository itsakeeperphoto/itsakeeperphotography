---
version: 1
slug: "route-404"
primary_target: "route:/404"
related_targets: []
---

# Route: 404 / Not Found

## Scope and mode

- Primary target: `route:/404`
- Visitor mode: Operate
- Scope: the static fallback served for an unknown URL; it is not an editorial manifest page.

## Audience, job and actions

- Audience: a prospective client who followed an outdated, mistyped or broken link.
- Job: say what happened without blame, preserve trust and make recovery immediate.
- Primary action: return to `/`.
- Secondary action: continue to `/reviews/`.

## Audit

- At audit time, no `src/pages/404.astro`, 404 renderer or copy source existed.
- The audit found that the local preview fell back incorrectly to Homepage with status 200. The implementation now serves the generated root `404.html` with status 404, matching the static host contract.
- The 800×1596 reference contributes topology only: full-bleed hero, torn seam, two corner prints, one arch, one overlapping print and a dark footer. Its brand, copy, palette, subjects and navigation are excluded.
- Copy is recovery-only and makes no factual or commercial claim. Photography is existing, local and already optimized.

## Direction

- Chosen comp: `.impeccable/mocks/404-b-split-path.png`.
- Approval: delegated by the user's explicit instruction to continue without asking.
- Direction: `The Empty Mount / Split Path`.
- Memorable moment: the `4 — photographic arch — 4` is both the error code and the path back into the work.
- Motion: only the shared hero reveal; the recovery still-life remains static, controls remain immediate, and reduced motion removes the hero's spatial movement.

## Fidelity inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Header/footer | Existing global shell and current logo/navigation | Existing Astro components |
| Hero | Existing `EditorialHero`; two-line H1, concise intro, local scroll button, two prints and seam | Semantic Astro + existing CSS + five approved local photographs across the page |
| Recovery code | Two monumental `4` glyphs behind a photo arch; never announced to assistive technology | Semantic-neutral HTML + CSS |
| Central zero | Tall family photograph clipped as the zero/arch | Existing raster through `Picture.astro` |
| Loose print | Square-edged black-and-white print overlapping the arch | Existing raster + CSS mat/filter |
| Recovery copy | One H2, explicit 404 status, one sentence and two direct links | Semantic HTML |
| Controls | Square outline links with hover, focus and active feedback; 44px minimum | HTML/CSS |

## Geometry and system

- Shared hero keeps the service-page height contract: remaining viewport, centered copy, prints at the lower corners and torn seam.
- Recovery uses a 12-column desktop grid: left `4` across columns 1–4, arch across 4–7, copy across 8–12 and right `4` across 9–12. Photo and copy meet at grid line 8 without sharing a column; the print overlaps only the arch's lower-left edge.
- At 900px the arch stays central and copy moves below it. At 390px the digits become a quiet backdrop, then content follows arch → copy in DOM order with no horizontal overflow.
- Component grammar: open paper fields, square mats, one arch, one-pixel lines, no cards.
- Corner language: square except the single semicircular arch.
- Elevation: no generic shadow; hierarchy comes from overlap and paper contrast.
- Type ramp: shared display/body/utility/script faces; H1 2 lines, H2 compact, body at least 16px.

## SEO and constraints

- Emit `404.html`; unknown paths must receive HTTP 404.
- Meta robots: `noindex, nofollow, noarchive` in staging and release.
- No canonical, JSON-LD, manifest entry, sitemap entry, `llms.txt` entry or Tina route.
- Preserve five-image loading discipline: hero assets eager, recovery assets lazy; literal alt only for the two informative photographs and empty alt for decorative prints.
- No forms, testimonials, rating, prices, response promises, dynamic search, catch-all redirect to Home or invented proof.

## Implementation status

- Astro release produces `dist/client/404.html`; local unknown paths return HTTP 404.
- Impeccable detector: `[]`.
- Finish review: no active P1; implementation is conditional PASS. A post-fix recapture at 1440/1200/900/390 remains the sole P2 evidence item because the local Playwright quota blocked the second pass.
