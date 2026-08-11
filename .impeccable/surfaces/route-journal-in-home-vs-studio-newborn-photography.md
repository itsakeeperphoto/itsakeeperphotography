---
version: 1
slug: "route-journal-in-home-vs-studio-newborn-photography"
primary_target: "route:/journal/in-home-vs-studio-newborn-photography"
related_targets:
  - "route:/newborn-photographer-tri-cities-wa"
approved_mock: "../mocks/newborn-comparison-b-house-archive.png"
---

# In-home vs. studio newborn journal — surface brief

## Scope and visitor mode

- Primary target: `route:/journal/in-home-vs-studio-newborn-photography/`.
- Mode: Read, supported by Compare and Persuade. The visitor is an expecting or newly postpartum parent choosing the setting and visual character of newborn photographs.
- Primary job: answer the difference immediately, compare the practical tradeoffs without disparaging either approach, and connect visitors who prefer Lisa's in-home style to the Newborn service and Contact paths.
- Content authority: `paginas/17-journal-newborn.md`, byte-identical to the user-supplied external document at audit time, SHA-256 `bda5c204895def04a6a912265caacf21a5fc90db0b0bd06341ddc9dbef9acfed`.

## Editorial truth and publication state

- Keep the route `draft/noindex`, without publication or modification dates and outside sitemap/llms, until Lisa approves the article and supplies a real date.
- The broad in-home/lifestyle premise is corroborated by the published Newborn service. The outdoor option is also corroborated only as seasonal; the specific two-part at-home-then-golden-hour format remains unverified.
- Preserve the source's complete eight-H2 journey, including the omitted Outdoor section and Tri-Cities closing paragraph. Pending markers remain repository-only and are never rendered.
- Do not infer or claim safety certification, studio training, a Lisa studio portfolio, strict two-week rules, a guaranteed spot, client crying behavior, city provenance, nursery, bassinet or nursing unless the visible image/source proves it.
- The page may describe common studio conventions as comparative editorial context, but it must not imply that Lisa provides those conventions.

## Approved direction

- Canonical comp: `.impeccable/mocks/newborn-comparison-b-house-archive.png` (`The house as archive`).
- Alternatives: `.impeccable/mocks/newborn-comparison-a-diptych.png` and `.impeccable/mocks/newborn-comparison-c-decision-ledger.png`.
- Approval source: on 2026-08-11 the user explicitly delegated direction selection and instructed the agent to audit and continue into implementation without an approval pause.
- Selection rationale: Concept B is closest to the reference's long editorial rhythm while remaining native to the existing site. It gives verified in-home photography visual authority and turns the lack of verified studio imagery into deliberate typographic negative space.
- Memorable moment: a warm arched in-home family photograph faces a deep-umber, hairline-framed studio definition with no photograph. The contrast itself explains the article before the visitor reads the ledger.
- Generated comps govern geometry and hierarchy only. Their generated people, sample prose and invented scenes never ship.

## Visible journey and geometry

1. Existing shared `EditorialHero` topology: verified full-bleed mother/newborn background, two decorative prints, centered H1/intro and one button scrolling to the Short Answer.
2. Thin byline rail: Lisa Weiss, business name and Richland base; no date.
3. `The Short Answer`: spacious, text-led ivory manifesto in a twelve-column spread.
4. Definitions diptych: sand in-home page with one arch; deep-umber studio page with prose and one empty hairline frame, never a fake studio photograph.
5. `The Honest Comparison`: text-led, four full-width ruled rows in source order. Each retains one H3 and its full paragraph; no equal-height cards or ambiguous proof image.
6. `What About Outdoor Newborn Sessions?`: wide verified outdoor family photograph plus a narrow prose panel and the Family service link.
7. `Which One Will You Treasure More?`: centered personal essay with a two-photo archival spread and the Newborn service link.
8. `Common Questions`: three native `details` rows, first open, each H3 visible and mirrored 1:1 in FAQ schema.
9. `Planning Your Baby's First Photos in the Tri-Cities`: full-bleed verified maternity image, source paragraph and Contact CTA.

## Media contract

| Surface | Source | Accessibility / truth |
|---|---|---|
| Hero background | `/uploads/richland-mother-newborn-at-home.jpg` | Informative alt: `A mother holding her sleeping newborn beside a bed.` |
| Hero left print | `/uploads/newborn-family-at-home-west-richland.jpg` | Decorative, empty alt |
| Hero right print | `/uploads/newborn-portrait-with-mother-richland.jpg` | Decorative, empty alt |
| In-home spread | `/uploads/family-newborn-at-home-tricities.jpg` | `Parents and an older sister holding a sleeping newborn together on a bed.` |
| Outdoor primary | `/uploads/family-newborn-sunset-tricities.jpg` | `A family gathered around a baby outdoors in warm evening light.` |
| Outdoor secondary | `/uploads/family-with-baby-golden-hour-embrace-tricities.jpg` | `Parents holding their baby close outdoors in warm evening light.` |
| Memory primary | `/uploads/family-newborn-connection-richland.jpg` | `Parents standing close with their baby in warm evening light.` |
| Memory secondary | `/uploads/family-with-baby-black-white-tricities.jpg` | `A family holding a baby together outdoors in a black-and-white portrait.` |
| Final close | `/uploads/maternity-waiting-to-welcome-tricities.jpg` | `An expecting couple standing together in warm sunset light.` |

- Exactly nine unique source paths on the route, with seven informational images and two decorative hero prints. The first three load eagerly; only the background receives `fetchpriority=high`; body images remain lazy/async.
- Use existing 400/640/960/1440 responsive WebP variants and intrinsic dimensions. Do not copy, re-encode, rename or delete shared source images in this task.
- No alt names a city, newborn age, nursery, bassinet, nursing, studio or session type unless directly established above.

## Content, semantic and schema contract

- Exactly one H1: `In-Home vs. Studio Newborn Photography`.
- Exactly eight H2 in definitive source order and seven H3: four comparison criteria plus three visible FAQs.
- Exactly three anchors in reading order: Family from the Outdoor section, Newborn from the memory/closing transition, and Contact in the final invitation. The hero action is a button, not an anchor.
- The byline is visible; no fake date appears in text or schema.
- Base emits the single Article. Enrich it with headline, `#lisa` author, `#business` publisher, verified hero image, canonical mainEntityOfPage, subject and Tri-Cities spatial coverage. Add exactly one FAQPage derived 1:1 from the visible FAQs and one BreadcrumbList: Home → Journal → article.
- Do not add a Service, Review, AggregateRating, street address, coordinates, safety credential, datePublished, dateModified or lastModified.
- Align both manifests to the definitive title while retaining `draft/noindex`; keep the release noindex header and sitemap/llms exclusion.

## Component and craft contract

- Add a specialized renderer for SSR and Tina; never fall back to `ContentPage`.
- Load one route-specific stylesheet through `?url`; every rule is scoped under `.newborn-comparison-page` or `.newborn-comparison-*` and must be absent from the other twenty public routes.
- Use semantic HTML, CSS Grid, one permitted arch, square-edged flat surfaces and 1px construction lines. No direct component CSS import, global `.tone-*`, cards, badges, tape, pins, splatter, arbitrary rotation, shadow, gradient, glass or decorative texture.
- Body text remains at least 16px with a 65–75ch maximum measure. Display type stays at or below 6rem and no tighter than `-0.04em`.
- Native summaries and CTAs provide at least 44px hit areas and explicit focus-visible states. The local hero scroll honors reduced motion and moves focus to the Short Answer.

## Responsive and QA contract

- Above 1250px: full two-page definition spread, 12-column compositions and wide ruled comparison rows.
- 1051–1250px: compact desktop with the same reading order.
- 768–1050px: balanced two-column definitions and media where copy remains readable; ledger rows may retain two comparison columns.
- 767px and below: single-column DOM order, dissolved overlaps, full-width ruled rows and imagery cropped without cutting faces.
- Required QA: 1440×1000, 1200×900, 900×900 and 390×844, plus a 1728px visual spot-check. Assert zero true horizontal overflow, no heading clipping, loaded modern images, exact DOM/schema/link/image contracts and route CSS isolation.

## Unresolved decisions

- Publication date and Lisa's final factual approval are hard gates for ready/index.
- The exact combined at-home plus later golden-hour format remains pending and must be corrected or confirmed before publication.
