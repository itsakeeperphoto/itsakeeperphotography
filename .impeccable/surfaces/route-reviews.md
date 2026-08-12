---
version: 1
slug: "route-reviews"
primary_target: "route:/reviews"
related_targets: []
---

# Client Reviews — surface brief

## Scope and visitor mode

- Primary target: `route:/reviews/`.
- Mode: Persuade, supported by Read and Experience. The page makes comfort credible through verified client language and then lets the visitor inspect the photographs behind that promise.
- Audience: Tri-Cities families, seniors, couples and business clients who value natural photographs but may feel nervous, awkward or unsure in front of a camera.
- Job: recognize that ease is intentionally created, read a representative set of real client accounts, inspect the work in an interactive format and decide whether to begin planning.
- Primary route action: `/contact/`. The hero has one in-page action to `#at-ease`; testimonial and book interactions are not route CTAs.

## Proof and truth boundaries

- Ten active, verified testimonial records are the canonical proof source. Preserve attribution, category labels and testimonial text exactly as stored; do not synthesize a Newborn category from a family-with-baby photograph.
- The Home section titled “What Tri-Cities Clients Remember” is reused as the complete primary proof composition, with its clothesline, ten photographs and flip interaction intact.
- The Portfolio journal is reused from its canonical page data and interaction controller; Reviews does not maintain a second copy of pages.
- The safe fallback statement is “100+ five-star Google reviews.” The project does not yet have a confirmed official Google Business Profile URL, so the Reviews page must not invent one or link a self-referential summary back to itself.
- Schema: WebPage + BreadcrumbList. Do not emit Review or AggregateRating without individually sourced rating/date/profile URLs; do not represent first-party LocalBusiness testimonials as review rich-result data.

## Approved direction

- Direction: “Words Become Pictures / At Ease, on Purpose.”
- Approved comp: `.impeccable/mocks/reviews-c-at-ease-purpose.png`.
- Seed: `c2ad8044`; chosen grounded structure 5 of 7, “Words Become Pictures.” Challengers based on teletext, type specimen, Merz collage, boarding pass, silk-cape product staging and cyclorama staging were rejected because they reduce audience identification or conflict with the established photographic world.
- Narrative sequence: full-viewport comfort promise → why ease is deliberate → ten clients describe what they remember → their words give way to the interactive work → quiet invitation to plan.
- Signature moment: the unchanged Home testimonial clothesline is not a decorative quote grid; it becomes the hinge between the page’s written promise and the physical journal of photographs.
- The generated comp governs topology, density, overlap and pacing. It does not shorten the protected hero below the exact EditorialHero remaining-viewport geometry, invent copy or replace real photography.

## Component grammar

- Color belongs to the existing world only: ivory paper, oatmeal sand, deep umber, muted olive and quiet gold accents. The inspiration’s wedding palette and identity are excluded.
- Geometry uses full-bleed rectangles, square white-matted prints, one deliberate portrait arch, torn seams and 1px construction hairlines. Corners stay square; no generic cards, badges, pill containers or decorative tape.
- Elevation is flat. Overlap and white mats create depth; no gradients, glass effects or soft drop shadows.
- Typography keeps the existing editorial display serif, compact sans body/UI and restrained handwritten accent. The protected hero type scale remains identical to the other editorial service pages.
- Motion is meaningful: testimonial cards flip to reveal words and the journal turns pages. Both expose accessible static/crossfade fallbacks under reduced motion.

## Composition and media inventory

| Ingredient | Visible commitment | Medium |
|---|---|---|
| Shared hero | Exact EditorialHero remaining-viewport geometry; black-and-white family embrace; two corner prints; centered script, two-line H1, intro and hash CTA; torn lower seam | Existing Astro/CSS + real production photographs |
| Comfort statement | Ivory field, left portrait arch, restrained square overlap, crossing 1px line and right editorial text block titled “At Ease, on Purpose” | Semantic HTML/CSS + existing real photographs |
| Client proof | Existing Home “What Tri-Cities Clients Remember” clothesline with all ten active records and exact photos/copy | Existing KindWords component/data/script |
| Journal transition | Dark editorial header followed by the same interactive page-turning book used by Portfolio; no duplicate H1 or duplicate journal data | Extracted reusable Astro component + existing journal CSS/controller/assets |
| Closing invitation | Full-bleed real black-and-white photograph, existing comfort-led copy and one Contact action | Semantic HTML/CSS + existing real photograph |
| Primary route action | “Start planning your session” is a conventional high-contrast text button with the established underline/arrow language | Semantic anchor and existing button grammar |

No new build-critical raster asset is required: every photographic region is covered by an existing verified production photograph. Generated comps remain design evidence only and never ship as page media.

## Content and interaction contract

- One H1 in the protected hero. Section headings follow the approved narrative and do not add a generic testimonial-card grid.
- Hero action scrolls and transfers focus to the comfort statement. The testimonial flip controls and journal controls remain keyboard-operable with visible focus and honest disabled states.
- Desktop at 1440 and 1200 preserves overlap, two-page journal spread and editorial whitespace. At 900, proof remains readable and the book may preserve a two-page spread if it fits without overflow. At 390, compositions stack, corner prints stay subordinate and the journal uses one page.
- Book assets for Reviews load only as the section approaches the viewport. The Portfolio instance keeps its current eager-first-page behavior.
- Reduced motion disables decorative transitions and page curl, preserving the same content through direct state changes/crossfades and updated interaction guidance.
- No horizontal overflow, inaccessible clipped text, tiny controls or content-dependent layout shift at 1440, 1200, 900 or 390 pixels.

## Unresolved decisions

- The official Google Business Profile URL remains unconfirmed. This does not block an indexed Reviews page, but an outbound Google-review link and individually sourced review schema remain excluded until verified.
