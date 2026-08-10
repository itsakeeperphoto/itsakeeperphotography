---
version: 1
slug: "route-newborn-photographer-tri-cities-wa"
primary_target: "route:/newborn-photographer-tri-cities-wa"
related_targets:
  - "route:/family-photographer-tri-cities-wa"
  - "route:/journal/in-home-vs-studio-newborn-photography"
approved_mock: "../mocks/newborn-option-a-storybook-ledger.png"
approved_donor_mock: "../mocks/newborn-option-c-archival-proofbook.png"
---

# Newborn — storybook ledger with archival booking proof

## Approval and authority

- User approval: 2026-08-10, **A as the composition base plus C's “No hard deadline” spread and master-detail FAQ**.
- The approved mocks define geometry, rhythm and hierarchy only. Their placeholder copy and photo blocks are not production authority.
- The repository's definitive content authority is `paginas/04-newborn.md`: it records the shipped hybrid copy and the two protected production regions exactly. Its external v2 provenance is `/Users/williammelo/Documents/Claude/Projects/Its A Keeper Photography/paginas/04-newborn.md`; that external file is provenance, not a competing current authority.
- Production photography must be a verified Lisa Weiss repository asset or a Drive original audited in `It’s A Keeper Photography Assets`. Generated people never ship.

## Protected regions

- Keep the complete shared `EditorialHero` invocation, its content object, assets, CTA, H1 line logic, positions and effective geometry unchanged.
- Keep the complete `What Your Newborn Session Looks Like` content subtree, DOM, SVG arc, images, copy, order and effective geometry unchanged.
- Add validator fingerprints for both protected content subtrees and browser geometry checks at 1440, 1200, 900 and 390 px.

## Direction contract

The page continues below the unchanged hero as a calm, long-form service narrative. A direct answer establishes the in-home, baby-led position immediately. A second ivory chapter uses one tall arch to carry Lisa's personal reason for photographing these days. The unchanged process remains the central practical proof. After it, a large serif “No hard deadline” statement interrupts the rhythm and resolves the late-booking objection without a card or promotional badge. The twenty-year chapter darkens to olive-walnut and treats returning families as an archival record, not a testimonial claim. FAQ becomes a flat master-detail ledger: eight native disclosures remain readable and keyboard-operable, with no boxed accordion styling. The final maternity image closes the journey at full width. Arches, long hairlines, square crops and controlled overlaps carry the reference geometry; tape, splatter, copied branding and fabricated photography do not.

## Visible journey

1. Protected EditorialHero, unchanged.
2. `The Short Answer: I Come to You`: direct-answer split with a verified in-home mother/newborn photograph.
3. `These Days Go So Fast`: tall arched verified family/newborn photograph and Lisa's definitive personal copy.
4. Protected `What Your Newborn Session Looks Like`, unchanged.
5. `When to Book — and Why It's Probably Not Too Late`: ivory/sand typographic spread led by `No hard deadline`, one verified detail photograph and the comparison-article link.
6. `Twenty Years of Watching Them Grow Up`: dark archival chapter with two existing family photographs and the Family service link.
7. `Newborn Session Questions`: eight native `details` rows in a master-detail ledger; one open by default.
8. `Expecting? Let's Talk Early`: full-width existing maternity photograph, concise copy and one Contact CTA.

## Ingredient inventory

| ID | Role | Medium | Source / implementation | Status |
|---|---|---|---|---|
| protected-hero | Opening hierarchy | Semantic Astro/CSS + existing raster | `EditorialHero` and current hero assets; byte/geometry frozen | direct |
| short-answer-photo | In-home positioning proof | Existing raster | `richland-mother-newborn-at-home.jpg`; literal mother/newborn at home | direct |
| these-days-photo | Personal family chapter | New verified raster | Drive `Family/Baby Session - West Richland/010A9895 copy.jpg`, optimized and renamed | direct |
| protected-process | Three-step practical proof | Semantic Astro/CSS + existing raster | Current process subtree and assets; byte/geometry frozen | direct |
| booking-photo | Late-window supporting image | Existing raster | `newborn-portrait-with-mother-richland.jpg` | direct |
| booking-statement | “No hard deadline” signature moment | Semantic H3/CSS | Large serif type, maximum 6rem; responsive wrap | semantic |
| twenty-years-media | Returning-family archive | Existing raster | `family-with-baby-golden-hour-embrace-tricities.jpg` and `family-with-baby-black-white-tricities.jpg` | direct |
| faq-ledger | Eight disclosures | Native HTML/CSS | `details/summary`, one open, two-column master-detail on desktop | semantic |
| final-photo | Expecting CTA | Existing raster | `maternity-waiting-to-welcome-tricities.jpg` | direct |
| actions | Four approved anchors | Semantic HTML/CSS | Hero Contact, comparison, Family, final Contact | semantic |

### Asset-producer manifest

- `produce`: empty. Image generation is inappropriate for documentary family proof and no mock crop may ship.
- `direct`: one audited Drive original requires rename, source optimization and responsive WebP generation; all other photographs already meet the repository pipeline.
- `semantic`: section grids, arch clipping, hairlines, statement typography, FAQ disclosures and CTA treatment stay in HTML/CSS.
- Execution order: copy the single verified Drive original, optimize source, generate variants, verify dimensions/hashes, then implement layout.
- Blockers: none.
- Assumption: folder provenance establishes West Richland for the new photograph, but visible alt text remains literal and does not claim a city.

## Content, SEO and schema contract

- Release state: `ready/index`, included in sitemap and `llms.txt`; staging remains noindex.
- Preserve exact H1 `Newborn Photographer in the Tri-Cities, WA`.
- Preserve seven H2 headings in this order: Short Answer, These Days, protected Process, When to Book, Twenty Years, Questions, final CTA.
- Publish exactly eight visible FAQ questions and exactly eight matching `Question` schema entities.
- Publish one detailed `Service`, one `BreadcrumbList`, one `FAQPage` and the route WebPage graph.
- Keep exactly four anchors inside `<main>`: hero Contact, comparison article, Family service and final Contact.
- Do not add an Investment or Reviews anchor.
- Do not claim safety certification or training. Do not add a strict two-week requirement. Do not add city-specific alt text unsupported by photo provenance.

## Responsive, interaction and craft contract

- Verify 1440, 1200, 900 and 390 px, plus protected-region baselines at 320/767 where useful.
- Desktop uses asymmetric editorial splits; 900 px preserves deliberate two-column layouts where readable; 390 px follows DOM order with overlaps dissolved.
- No true horizontal overflow, clipped H2, min-content FAQ expansion or off-canvas decorative script.
- Body copy stays within 65–75ch; display type remains at or below 6rem with tracking no tighter than -0.04em.
- Native disclosure hit areas remain at least 44px, focus-visible is explicit, and reduced motion removes nonessential transitions.
- No new eyebrow labels, rounded cards, pills, gradients, shadows, generated textures or copied reference ornaments.
