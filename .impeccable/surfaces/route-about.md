---
version: 1
slug: "route-about"
primary_target: "route:/about"
related_targets: []
---

# About Lisa — surface brief

## Scope and visitor mode

- Primary target: `route:/about/`.
- Mode: Persuade, supported by Read. The page establishes Lisa Weiss as the person behind the work, then turns earned trust into a session inquiry.
- Audience: Tri-Cities families, seniors, new parents and business owners deciding whether Lisa is the right photographer for a meaningful session.
- Job: understand where the work came from, how Lisa photographs, what experience supports her judgment and what to do next.
- Primary action: `/contact/`; secondary learning paths: Seniors and Investment.

## Proof and content

- Definitive body source: external `paginas/08-about.md` v2, SHA `baf6daada35ec33518f6311970bb765bb7e8605637e570b394103e03542287ab`.
- Publishable proof: 20+ years behind the camera, 14 years in business, hundreds of Tri-Cities stories, Richland home, Wisconsin origin and independently verifiable Tri-Cities MOM Magazine cover feature from August/September 2019.
- Omitted until confirmed: static review count, award name/year, Grammy session, health story, certifications, insurance, memberships and Google Business Profile URL.
- Schema: AboutPage + Person + BreadcrumbList. No Service, FAQ, Review, AggregateRating, street address or coordinates.

## Rebaselined hero

- The hero remains outside redesign scope. H1, intro, script, hash CTA, side prints and responsive geometry stay exact.
- The user explicitly approved one media override on 2026-08-10: the background is now `about-lisa-photographing-tricities.jpg`, with `object-position: 50% 24%` on desktop and mobile. The previous source remains in production for other routes and is not deleted.
- `page.hero` SHA: `89ff030fedfc6e042ffa325711f08e1b80df846634923976e3560d26cf0bdc73`.
- Effective hero props SHA: `035a9fac0a023b507ef96a3f5870c8530279ecc0570dfed609447e23eb99de81`.
- EditorialHero invocation SHA: `8ddaf0424452d0e5bab30a198a4ef545070d63cedfe7808a87f1507a615eddc3`.
- Playwright DOM SHA: `7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`.
- The protected hero inputs are now `about-lisa-photographing-tricities.jpg`, `about-origin-family-newborn-tricities.jpg` and `about-story-senior-horse-tricities.jpg`.

## Approved direction

- Approved composition: A+C.
- Comp A: `.impeccable/mocks/about-comp-a-keeper-archive.png`.
- Comp C: `.impeccable/mocks/about-comp-c-through-her-lens.png`.
- Direction: Keeper Archive geometry for the origin and name story; Through Her Lens photographic constellation and four-part method ledger.
- Memorable moment: one construction line crosses the origin arch and resolves into the name ledger; later, authority reads as an editorial record rather than a marketing badge row.
- Honest risk: photographic overlap may become scrapbook decoration. Limit it to the origin/personal compositions, keep edges square, omit tape/shadows and let whitespace do the separation.

## Component and media inventory

| Ingredient | Commitment | Medium |
|---|---|---|
| Rebaselined hero | Pixel/DOM/geometry regression lock after the user-approved background swap | Existing Astro component and protected assets |
| Origin | 12-column split, portrait arch, restrained B&W overlap, short note and crossing line | Semantic HTML/CSS + verified Lisa photographs |
| Name story | Horizontal sand ledger with large `Keepers.` payoff | Semantic HTML/CSS |
| Camera story | Dark 12-column story, action portrait beside long-form copy | Semantic HTML/CSS + verified Lisa action photograph |
| Twenty years | Three-photo contact sheet and three ruled text entries | Semantic HTML/CSS + existing verified portfolio assets |
| Belief | Large family photograph plus square editorial note; title and quote use a balanced horizontal measure instead of a one-word vertical column | Existing semantic composition |
| How I Photograph | Four ruled principles, 4/2/1 columns, no cards/icons; copy keeps a responsive inset from every divider | Semantic HTML/CSS |
| Off camera | Controlled two-print Lisa composition | Semantic HTML/CSS + verified Lisa photographs |
| Authority | Editorial ledger with Lisa identity, experience and MOM source link | Semantic HTML/CSS, external text link only |
| Final invitation | Existing framed photographic close and Contact action | Semantic HTML/CSS + existing verified image |

New Lisa source photographs come from Drive folder `It’s A keeper Photography Assets/MY NEW branding pics ( Lisa )`, downloaded 2026-08-10 at exact source hashes recorded in the asset audit. Production derivatives must be sRGB, metadata-stripped, no larger than 2400px and no larger than 700 KiB, with responsive WebP variants.

## Content and interaction contract

- One protected H1 and nine H2 in the approved source order.
- Hero retains one hash link to the origin. Body route links: Seniors, Investment and Contact. External authority link: Issuu with `rel="noopener"`, no `nofollow` and no embedded remote image/iframe.
- Body text remains at least 16px, focus is visible, controls have at least 44px targets, reduced motion is honored and no horizontal overflow is allowed.
- Breakpoints: full composition above 1250px; compact desktop 1051–1250px; tablet 768–1050px; stacked mobile at 767px and below; small-mobile refinement at 479px.
- About CSS must load only on `/about/` and must not leak through the static editorial router.

## Unresolved decisions

- None block publication. Additional awards, review counts, credentials and Google profile may be added only after explicit verification.
