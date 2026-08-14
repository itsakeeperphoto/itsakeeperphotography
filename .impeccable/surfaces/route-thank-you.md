---
version: 1
slug: "route-thank-you"
primary_target: "route:/thank-you"
related_targets: []
---

# Thank-you surface brief

- Scope: `route:/thank-you`; mode: Operate.
- Audience: a visitor who has just submitted a session inquiry or estimate and needs immediate reassurance that the message arrived.
- Job: confirm receipt, explain the verified next step without promising a response time, and give one quiet way to keep looking.
- Conversion action: none in the hero; its local control only scrolls to the confirmation. The sole body anchor opens `/reviews/` from the photographic close.
- Truth: Lisa reads every inquiry herself, replies personally, usually asks a couple of questions, and plans details through a phone call before booking.
- Constraints: permanent `noindex,nofollow,noarchive`; absent from sitemap and `llms.txt`; no `robots.txt` disallow, analytics claim, response-time promise, booking confirmation, pricing, testimonial or second conversion form.
- Direction: “Your Message Is With Me,” option C, `.impeccable/mocks/thank-you-c-message-with-me.png`, surface seed `02ea6a91`, delegated approval. Shared Seniors/Family/Newborn hero, then a compact ivory reply composition with one Lisa arch, one overlapping B/N print and three verified next-step annotations; finish with a full-bleed photographic close containing one Reviews link.
- Memorable moment: the submitted note feels already placed in Lisa's hands, expressed through her portrait arch and the working print crossing its lower edge.
- Responsive: hero remains shared; desktop uses copy / arch / annotations across 12 columns, tablet becomes two columns, mobile orders copy → arch/print → next steps → close.
- Unresolved decisions: none for publication; the page remains a utility and never enters crawler discovery surfaces.

## Approved comp inventory

| Ingredient | Compositional commitment | Medium |
| --- | --- | --- |
| Shared hero | Full viewport after the global header; family background, centered script + two-line H1, two corner prints and torn edge | Existing `EditorialHero`, semantic HTML/CSS, existing responsive photography |
| Personal note | Left copy occupies roughly 3/12 columns; the heading is about half the visual height of the portrait | Semantic HTML/CSS |
| Lisa portrait | One central 4/12-column portrait arch; no card shell or decorative shadow | Existing raster photography in `Picture` |
| Working print | One B/N landscape mat overlaps the arch near its lower-left edge | Existing raster photography, semantic `figure`, decorative empty alt |
| Next steps | Three verified phrases in the right 3/12 columns, separated vertically by two short hairlines | Semantic ordered list and CSS rules |
| Close | Full-bleed couple landscape, shallow umber wash, one outlined Reviews anchor centered beneath the copy | Existing raster photography plus semantic anchor |
| Type | Display serif H1/H2, italic body, tiny tracked utility labels and two short script accents: the hero receipt and Lisa's signature | Existing local font tokens |
| Motion | Three route-scoped, one-shot reveals for hero, note and close; no looping motion; button press feedback; reduced-motion keeps content visible | Existing editorial motion plus CSS transform/opacity only |
