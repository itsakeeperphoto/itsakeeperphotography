---
version: 1
slug: "route-journal-when-to-book-senior-pictures-tri-cities"
primary_target: "route:/journal/when-to-book-senior-pictures-tri-cities"
related_targets: []
---

# Senior Timing Journal — surface brief

## Scope and visitor mode

- Primary target: `route:/journal/when-to-book-senior-pictures-tri-cities/`.
- Mode: Read, supported by Persuade. The page answers timing uncertainty for seniors and parents before handing the visitor to the Senior service and Contact paths.
- Audience: Tri-Cities seniors and parents deciding when to schedule, especially visitors worried about yearbook timing, weather, school commitments or having waited too long.
- Primary job: answer the question immediately, make the seasonal tradeoffs easy to scan and lower the pressure around booking.
- Primary action: `/contact/`; supporting paths: Senior service and the Tri-Cities locations guide.

## Editorial truth and publication state

- Definitive copy: `paginas/16-journal-senior-timing.md`, SHA-256 `e24b9829…`; the external user-supplied file is byte-identical.
- Publishable facts: Lisa's twenty years photographing seniors, summer/early fall as common windows, spring and winter as alternatives, four-to-six-week booking guidance, and golden hour as the last 60–90 minutes before sunset.
- Omit unsupported district-specific deadlines and the unconfirmed two-mini-date offer. Replace the removed district paragraph with general advice to check the school's own deadline and work backward; use `fewer school-schedule conflicts`, never the absolute `no conflicts`.
- Keep the route `draft/noindex` and outside sitemap/llms until an actual publication date is authorized. The redesign must not fabricate `datePublished`, `dateModified` or `lastModified`.
- Pending facts remain registered: district deadline research, Q54 multi-season offer, and publication date.

## Approved direction

- Approved comp: `.impeccable/mocks/senior-timing-03-contact-sheet-field-guide.png`.
- Alternatives considered: `.impeccable/mocks/senior-timing-01-season-ledger.png` and `.impeccable/mocks/senior-timing-02-season-spine.png`.
- Approval was delegated by the user on 2026-08-11 with the instruction to audit and implement without pausing. The contact-sheet field guide wins because it avoids a repeated card row, preserves image-led reading and translates cleanly to 4/2/1 responsive geometry.
- Direction: shared EditorialHero opening; short answer and yearbook guidance as an arch/prose spread; one asymmetric four-image seasonal contact sheet; paired practical essays; ruled booking and FAQ ledgers; full-bleed invitation.
- Memorable moment: four different Senior portraits meet at a single construction-line field guide, so the seasons read as one year rather than four interchangeable cards.
- Honest risk: the comp invents sample copy and season-specific photo claims. Production uses only the definitive copy, literal alt text and verified Drive/local photographs; no generated photograph is shipped.

## Geometry and implementation inventory

| Ingredient | Commitment | Medium |
|---|---|---|
| Editorial hero | Existing Seniors/Family/Newborn topology, full-bleed background, two restrained prints, centered H1/intro and one scroll button | Existing `EditorialHero` + verified Senior photography |
| Byline rail | `By Lisa Weiss · It's A Keeper Photography · Richland, WA`; no fake date | Semantic HTML/CSS |
| Short answer | Generous ivory statement immediately after hero | Semantic HTML/CSS |
| Yearbook guidance | Arch image and narrow prose column with one inline Senior link | Semantic HTML/CSS + verified portrait |
| Four seasons | One asymmetric contact sheet; four H3 entries and four literal photo alts; 4/2/1 responsive reading order | Semantic ordered list + CSS Grid + verified portraits |
| Too late | Dark, text-led statement with no ornamental card | Semantic HTML/CSS |
| Golden hour | Wide image/prose split with the supplied answer first | Semantic HTML/CSS + verified golden-hour portrait |
| Booking calendar | Ruled advisory spread with a portrait and Senior/Locations links; no invented month matrix or district dates | Semantic HTML/CSS + verified portrait |
| Quick Answers | Three native details rows, each H3 visible and derived 1:1 into FAQ schema | Semantic HTML/CSS |
| Final invitation | Full-bleed image, readable wash, H2 and Contact CTA | Semantic HTML/CSS + verified Senior photograph |

Component grammar is square-edged and flat, with 1px construction lines, no elevation, a single semicircular arch, warm paper fields and one photographic contact-sheet overlap. Display type remains the existing fine serif, body copy the existing editorial serif and utility labels the existing tracked sans. No tape, pins, splatter, arbitrary rotation, rounded cards, gradients, badges, glass or decorative shadows.

## Media contract

- Drive audit covers Senior folders for West Richland, Richland, Kennewick and Pasco. Benton City files are excluded from Kennewick evidence.
- New source: `west-richland-senior-woodpile-portrait.jpg`, derived from West Richland Drive file `010A0325copy_1.jpg`. It must be auto-oriented, converted to sRGB, stripped to safe allowlisted XMP, no larger than 2400px/700 KiB, and receive 400/640/960/1440 WebP variants.
- Reuse existing optimized Drive-derived assets for the remaining surfaces; do not duplicate bytes or delete shared files.
- Hero background and every informational image use literal visible-content alt text. Decorative hero prints and the final duplicated photographic layer use empty alt only when genuinely redundant.
- No alt may claim Class year, park, river, month or season unless the source provenance proves it.

## Content, semantic and SEO contract

- Exactly one H1: `When Should You Take Senior Pictures?`.
- Exactly eight H2 and seven H3 in definitive source order; the unverified Q54 question stays absent.
- Exactly four anchors inside `<main>`: two Senior-service links, one Locations-guide link and one Contact link. The hero control is a button scrolling to `the-short-answer`, not an anchor.
- FAQ schema derives three answers from visible content: Short Answer, Too Late and Best Time of Day. Article and Breadcrumb schema may be enriched without publication dates while draft, but must not expose invented dates, Service, Review, AggregateRating, street address or coordinates.
- OG/Twitter media uses a verified Senior photograph and literal alt; staging and release both retain noindex while the route remains draft.
- Body copy stays at least 16px, focus remains visible, native details are keyboard-operable, controls are at least 44px, reduced motion is honored and horizontal overflow is zero.
- Route CSS loads only on this article via `?url`; `.senior-timing-*` rules must not leak into other public routes.

## Responsive contract

- Above 1250px: full asymmetric composition and four-part seasonal contact sheet.
- 1051–1250px: compact desktop without changing reading order.
- 768–1050px: two-by-two season layout and balanced splits.
- 767px and below: single-column seasons, native-order media/copy and an arch no wider than about 82vw.
- QA viewports: 1440, 1200, 900 and 390px; also inspect 1728 because the reference feedback commonly arrives there.

## Unresolved decisions

- Publication date is a hard gate for ready/index and sitemap inclusion.
- District-specific deadlines and the two-mini-date offer may be added later only after explicit verification.
