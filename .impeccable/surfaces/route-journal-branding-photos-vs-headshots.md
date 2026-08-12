---
version: 1
slug: "route-journal-branding-photos-vs-headshots"
primary_target: "route:/journal/branding-photos-vs-headshots"
related_targets: ["route:/branding-photographer-tri-cities-wa","route:/headshot-photographer-tri-cities-wa"]
approved_mock: "../mocks/branding-headshots-comparison-c-versus-axis.png"
---

# Branding photos vs. headshots journal — surface brief

## Scope and visitor mode

- Primary target: `route:/journal/branding-photos-vs-headshots/`.
- Related service targets: Branding and Headshots.
- Mode: Read, Compare and Persuade. The visitor is a Tri-Cities business owner deciding whether one portrait or a broader image library will support the next season of the business.
- Primary job: answer the difference immediately, make the visual distinction obvious, help the visitor choose a starting point and offer the correct service path without turning editorial estimates into package promises.
- Content authority: `paginas/18-journal-branding-vs-headshots.md`, byte-identical to the user-supplied external document at audit time, SHA-256 `0cc9381ed962f4c91a7e43f6f2a2d25aec45fd87e2cdef3757bd51da3fd6f5e2`.

## Editorial truth and publication state

- Publish the route as `ready/index` on `2026-08-11`, the first indexable release and a substantial redesign explicitly authorized by the user. Use that date for `datePublished`, `dateModified` and manifest `lastModified`.
- Remove this article's `[FECHA]` pending marker and release noindex header. Include it in sitemap and `llms.txt`; staging remains globally noindex with an empty sitemap.
- Preserve all definitive visible copy and restore its intended strong/emphasis semantics. Do not convert editorial comparisons such as `1–3 portraits` or `half a day, typically` into package promises, Service schema or structured duration.
- FAQ schema mirrors only the three visible Common Questions, never the contradictory sample questions in the source's implementation notes.

## Approved direction

- Canonical comp: `.impeccable/mocks/branding-headshots-comparison-c-versus-axis.png` (`Versus axis`).
- Alternatives: `.impeccable/mocks/branding-headshots-comparison-a-proofbook.png` and `.impeccable/mocks/branding-headshots-comparison-b-dossier.png`.
- Approval source: on 2026-08-11 the user explicitly delegated direction selection and instructed the agent to audit and continue into implementation without an approval pause.
- Selection rationale: Concept C makes the article's answer visible before the comparison table: one disciplined portrait faces a small library of person, process and place across a single central seam.
- Memorable moment: the `VS` seam is not a badge. It is the construction line that joins the formal headshot proof to the wider branding contact sheet, then continues into the ruled comparison below.
- Generated comps govern geometry, density and hierarchy only. Generated people, sample prose and invented scenes never ship; production uses the verified project photographs listed below.

## Visible journey and geometry

1. Existing shared `EditorialHero`: verified chef-at-work background, two decorative portrait prints, centered H1/intro and one button scrolling to the Short Answer.
2. Thin byline rail: Lisa Weiss, business name and Richland base, plus the authorized publication date.
3. `The Short Answer`: an ivory manifesto bridge with the two definitive contrast statements and their intended emphasis.
4. `What Are Branding Photos?`: one arch plus an asymmetrical three-image library and the five-item semantic checklist.
5. `What Is a Headshot?`: narrow text column with one disciplined formal portrait proof.
6. `Side by Side`: the approved central VS seam, followed by a semantic three-column comparison table with six source rows.
7. `Which Does Your Business Need First?`: a deep-umber three-item ruled ledger followed by Branding and Headshots service links in source order.
8. `What Happens in a Branding Session?`: workplace action/prose split with a process detail; no equal-card grid.
9. `Common Questions`: three native `details` rows with visible H3 questions and answers mirrored 1:1 in FAQ schema.
10. `Show Them Who You Are`: full-bleed team image, definitive closing copy and Contact CTA.

## Media contract

| Surface | Source | Accessibility / truth |
|---|---|---|
| Hero background | `/uploads/branding-chef-kitchen-richland-wa.jpg` | `Chef smiling while stirring vegetables in a modern kitchen during a Richland branding session.` |
| Hero left print | `/uploads/professional-headshot-woman-neutral-backdrop.jpg` | Decorative, empty alt |
| Hero right print | `/uploads/pianist-creative-branding-portrait-richland-wa.jpg` | Decorative, empty alt |
| Branding work | `/uploads/business-professional-working-laptop-richland-wa.jpg` | `Business professional working at a laptop during a Richland branding session.` |
| Branding environment | `/uploads/personal-branding-portrait-kitchen-west-richland-wa.jpg` | `Business owner standing beside a kitchen island during a West Richland branding session.` |
| Branding process | `/uploads/businesswoman-working-desk-richland-wa.jpg` | `Business owner writing at her desk during a Richland workplace branding session.` |
| Branding detail | `/uploads/chef-saute-pan-branding-detail-richland-wa.jpg` | `Chef stirring vegetables in a pan during a close-up Richland branding photograph.` |
| Headshot proof one | `/uploads/professional-headshot-man-blue-shirt-kennewick-wa.jpg` | `Smiling man in a blue shirt photographed against a warm stone backdrop in Kennewick.` |
| Headshot proof two | `/uploads/professional-headshot-woman-black-top-kennewick-wa.jpg` | `Smiling woman in a black top photographed during a Kennewick team headshot session.` |
| Team proof | `/uploads/business-partners-office-portrait-richland-wa.jpg` | `Two business professionals posing together in their Richland office.` |
| Final close | `/uploads/business-team-meeting-richland-wa.jpg` | Decorative support for the CTA, empty alt |

- Exactly eleven unique source paths. The first three load eagerly; only the hero background receives `fetchpriority=high`; body images remain lazy/async.
- Use existing 400/640/960/1440 responsive WebP variants, intrinsic dimensions and truthful metadata. Do not rename, re-encode, overwrite or delete shared source images.
- Do not infer a city, business role, studio setting or session promise beyond the verified filenames/metadata and literal approved alts.

## Content, semantic and schema contract

- Exactly one H1: `Branding Photos vs. Headshots: What's the Difference?`.
- Exactly eight H2 including the final invitation, and six H3: three decision headings plus three visible FAQ questions. Comparison column labels are table headers, not headings.
- Render the five branding examples as a semantic unordered list and the six comparisons as one accessible table with `Headshot` and `Branding photos` column headers.
- Exactly three anchors in reading order: Branding, Headshots and Contact. The hero action is a button, not an anchor.
- Base emits the single Article. Enrich it with headline, `#lisa` author, `#business` publisher, authorized dates, verified hero image, canonical mainEntityOfPage, subject and Tri-Cities spatial coverage. Add one FAQPage derived 1:1 from visible questions and one BreadcrumbList: Home → Journal → article.
- Do not add Service, Offer, Review, AggregateRating, structured package duration, street address or coordinates.
- The Journal hub card links to the published article. Both manifests remain byte-aligned and release crawler surfaces include this URL exactly once.

## Component grammar and craft contract

- Add a specialized SSR/Tina renderer and one route-specific stylesheet loaded through `?url`; no direct component CSS import and no leakage to the other twenty routes.
- Grammar: broad editorial spreads, narrow proof captions, a single asymmetric contact sheet, full-width ruled ledgers and one native table. Avoid equal-size card scaffolds.
- Corner language: square. The sole earned curve is the branding arch. Native controls keep browser semantics but receive square, minimum-44px focusable surfaces.
- Line weight: 1px construction rules in muted umber/ivory. The central seam may change tone across light and dark surfaces but not thickness.
- Elevation: flat; no shadows. Overlaps are produced by grid placement and z-index alone.
- Type ramp: shared display serif, maximum `6rem` and tracking no tighter than `-0.04em`; body at least `1rem`, 65–75ch; small metadata in the site's uppercase sans. No extra eyebrow labels above headings.
- Motion: one restrained editorial reveal for the VS seam only, default content already visible and disabled under reduced motion. No repeated section entrance animation.
- No gradients, glass, badges, tape, pins, splatter, decorative grain, arbitrary rotation, rounded cards, fake texture or copied reference identity.

## Ingredient and medium inventory

| Ingredient / commitment | Medium |
|---|---|
| Shared site navigation and EditorialHero | Existing semantic Astro component and CSS |
| Hero background and two prints | Existing verified project raster assets |
| Central VS seam and continuation rules | Semantic HTML + authored CSS geometry |
| Singular headshot proof | Existing verified project raster asset |
| Three-image branding library | Existing verified project raster assets in CSS Grid |
| Five branding examples | Semantic `<ul>` |
| Six-row comparison | Semantic `<table>` |
| Three decision entries | Semantic text ledger with 1px rules |
| FAQ | Native `<details>/<summary>` |
| Final primary action | Existing button/link language on a verified full-bleed raster |
| Reference paper/tape/splatter/logo | Accepted omission; incompatible with the site's world and user prohibition |

## Responsive and QA contract

- Above 1250px: full shared hero, 12-column spreads, headshot/library pair and uninterrupted central seam.
- 1051–1250px: compact desktop retaining the comparison axis and table.
- 768–1050px: balanced two-column proof spread, wider text measures and non-overlapping prints.
- 767px and below: single-column reading order; comparison photos stack before the table; the seam becomes a horizontal rule; table uses fixed percentages and wrapping with no minimum-width overflow.
- Required QA: 1440×1000, 1200×900, 900×900 and 390×844, plus a 1728px visual spot-check. Assert no true horizontal overflow, no heading/image clipping, modern responsive sources, exact DOM/schema/link/image contracts, keyboard focus, reduced-motion behavior and route CSS isolation.

## Direction contract

- Concept seed: `0b682e5d`, grounded challenger index 5. Only its comparison-axis topology carries forward; no boxing-poster identity or artwork ships.
- Within seconds a visitor must understand: a headshot identifies one person, branding photos build a wider visual library, and the next action is to choose the relevant service or start planning.
- The implementation succeeds only if the VS seam, singular-versus-library contrast and semantic table remain a single compositional thought rather than three unrelated sections.
