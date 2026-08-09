---
version: 2
slug: "route-kennewick-wa-photographer"
primary_target: "route:/kennewick-wa-photographer"
related_targets:
  - "route:/senior-photographer-tri-cities-wa"
  - "route:/newborn-photographer-tri-cities-wa"
  - "route:/family-photographer-tri-cities-wa"
approved_mock_manifest: "../mocks/kennewick-approved-manifest.json"
---

# Kennewick v3 — Editorial local-service journey

## Scope and authority

- Route: `/kennewick-wa-photographer/`.
- Mode: persuade, with a read-heavy editorial middle and an explicit final conversion moment.
- Brand authority: the current It's A Keeper Photography system and the approved Seniors, Newborn, and Family service-page heroes.
- Reference-image authority: geometry, layering, proportion, and pacing only. Do not copy the reference brand, logo, colors, copy, decorative splatter, tape, or photographic content.
- The seven files registered in `kennewick-approved-manifest.json` are the approved and canonical visual previews for this redesign. Earlier `kennewick-comp-*` explorations remain historical and rejected.
- Production must render real repository or verified Kennewick photographs. Generated preview imagery is a composition guide, never a production asset or documentary claim.

## Audience, job, and primary action

- Audience: a Kennewick client comparing portrait photographers, often against a predominantly light-and-airy market.
- Job: communicate Lisa's warm, rich, moodier alternative; prove local proximity; explain which portrait services are available; and answer practical questions without diluting the service-page SEO intent.
- Primary action: use the hero button to scroll to the final invitation, then follow the final Contact anchor to start planning a session.

## Binding content and SEO contract

- Preserve the approved page copy verbatim. The visual previews may abbreviate body text only for layout illustration; they are not copy authority.
- Preserve the SEO title: `Kennewick WA Photographer | It's A Keeper Photography`.
- Preserve the meta description: `Warm, golden-toned portrait photography in Kennewick — seniors, families, newborns and branding. A richer, moodier alternative to light and airy, from Lisa.`
- Preserve the exact H1 `Kennewick, WA Photographer`, visually split over two lines where needed without changing the accessible text.
- Preserve the H2 sequence exactly:
  1. `Ten Minutes From My Front Door`
  2. `If Light and Airy Isn't What You Pictured`
  3. `What Works Well in Kennewick`
  4. `What I Photograph in Kennewick`
  5. `Kennewick Questions`
  6. `Let's Plan Yours`
- Preserve exactly nine anchors inside `<main>`: three contextual prose links, five service-directory links, and the final Contact CTA.
- The hero action remains a native button, not an anchor, and scrolls to the final section. Do not introduce navigation links in the hero.
- Preserve the four approved FAQ questions in both visible DOM and FAQ schema, with one-to-one parity.
- Preserve a single service schema and the route's canonical/indexation behavior.

## Approved visual journey

### 01 — Editorial hero

- Use the same `EditorialHero` grammar as the Seniors, Newborn, and Family pages: full-bleed golden photographic field, restrained tonal wash, centered two-line H1, concise intro, outlined action, two edge prints, and the existing paper-edge transition.
- No script phrase and no placeholder space for one.
- The H1 and action are the first-viewport hierarchy. Prints support the scene and must not compete with the heading or crop essential faces.
- The action scrolls to the final section and transfers focus there.

### 02 — Proximity introduction

- Weathered-Sand editorial section with Lisa's existing portrait in a tall arch at left.
- A single vertical hairline mediates the transition from portrait to copy.
- Place `Ten Minutes From My Front Door` and its approved copy at right with ample negative space. The contextual About link remains in the following style section where the approved phrase occurs.
- At narrow widths, lead with heading/copy and then show the portrait. Do not use absolute overlap.

### 03 — Style differentiation

- Keep `If Light and Airy Isn't What You Pictured` and its copy text-led on the left.
- Use one restrained collage on the right: one dominant framed landscape plus one smaller portrait crossing its lower edge. This is the only controlled photographic overlap in the page body.
- Square edges, one-pixel rules, and flat tonal surfaces only. No tape, shadows, gradients, texture overlays, or arbitrary rotation.
- On mobile, dissolve the overlap into a clean vertical sequence with natural image ratios.

### 04 — Kennewick setting

- Render `What Works Well in Kennewick` as a text-led tonal field, not an image card or photo gallery.
- Use an overscale or sticky-feeling heading on the left and the three approved copy blocks on the right, separated by hairlines.
- Photography must not displace the local explanatory copy. The section's proof is specificity and readable hierarchy.

### 05 — Service directory

- Render `What I Photograph in Kennewick` as an editorial ledger crossed or anchored by one tall verified photograph.
- Preserve five whole-row native links, their labels, supporting copy, and arrow affordances. Decorative numbering from the preview is optional and is omitted when it adds no semantic sequence.
- The photograph is not an additional link. It balances the ledger and supplies a single signature gesture, not a card.
- Every row remains at least 44px high and has explicit hover, focus-visible, active, and reduced-motion behavior.

### 06 — FAQ ledger

- Use a flat Walnut/Umber field with the H2 as the left-side anchor and four native disclosure rows on the right.
- One question may be open in the visual preview to establish answer rhythm; runtime semantics must remain native `<details>/<summary>` and keyboard operable.
- Hairlines and typography carry the hierarchy. No decorative media is required.

### 07 — Final invitation

- Use a full-bleed verified Kennewick photograph with a controlled deep wash and centered approved H2, copy, and single Contact CTA.
- Keep the CTA visually distinct and keyboard-visible. Do not add a second conversion link.
- This section is the destination of the hero scroll button and therefore remains focusable without entering the normal tab order.

## Photography and proof limits

- Verified Google Drive sources are `Couples - Kennewick` and `Senior Session - Kennewick`; use selected, optimized photographs only where their literal subject and provenance support the section.
- Do not present editorial selections as six or more distinct sessions when they are not.
- The `Recent Kennewick Sessions` gallery remains entirely absent from the DOM until 6–10 distinct Kennewick sessions are verified. Do not render a fallback heading, empty wrapper, placeholder, or whitespace block.
- Do not use or delete production photographs merely because they are absent from this route.

## Responsive and interaction constraints

- Preserve the shared system breakpoints around 1250px, 1050px, and 767px, with targeted protection at 390px.
- Desktop uses a twelve-column editorial grid with generous section rhythm; 900px uses intentional two-column composition where space permits; 390px follows one-column DOM order.
- The complete H1 must fit at 390px on two deliberate lines. Directory headings, rows, and arrows must remain inside the viewport.
- No absolute body collage at mobile widths, no horizontal overflow, no clipped copy, and no transformed essential hit targets.
- Motion is limited to purposeful opacity/transform changes, uses explicit properties instead of `transition: all`, and is removed or simplified under `prefers-reduced-motion`.
- Maintain visible focus states, adequate contrast, native semantics, and logical keyboard order across all widths.

## Canonical preview set

1. `kennewick-01-editorial-hero.png`
2. `kennewick-02-proximity-intro.png`
3. `kennewick-03-style-collage.png`
4. `kennewick-04-setting-text-led.png`
5. `kennewick-05-services-ledger.png`
6. `kennewick-06-faq-ledger.png`
7. `kennewick-07-final-full-bleed.png`

Interpret these previews section by section. Preserve their geometry and visual hierarchy while using the approved copy, shared components, real photographs, responsive behavior, and accessibility contract of the production site.
