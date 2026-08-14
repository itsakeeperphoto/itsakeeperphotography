# REVIEWS — `/reviews/`
_Página 9 de 18 · Trust & conversion · Proof · `ready/index`_

## Estado editorial

La ruta publica el mismo inventario de diez testimonios reales y atribuidos de
`content/testimonials/*.json` que usa `KindWords` en Homepage. El PDF de Reviews
es la autoridad del copy según ADR-052; Charity Neville permanece archivada y no
se renderiza. El usuario confirmó la URL pública directa de Google Reviews; se
guarda en `settings.social.googleProfile` y alimenta un CTA explícito, mientras
el resumen visible sigue siendo texto estático.

---

## SEO técnico

| Campo | Valor |
|---|---|
| **URL** | `/reviews/` |
| **Estado** | `ready` |
| **Robots release** | `index, follow, max-image-preview:large` |
| **Title** | `Client Reviews | It's A Keeper Photography` |
| **Meta description** | `Read verified client stories from Tri-Cities families, seniors, couples and business clients photographed by Lisa Weiss.` |
| **Schema principal** | `WebPage` |
| **Last modified** | `2026-08-12` |

### Estructura visible

```text
H1  Client Reviews in the Tri-Cities
 H2  At Ease, on Purpose
 H2  What Tri-Cities Clients Remember
 H2  The Photographs Behind the Words
 H2  Leave the Nerves at Home
```

---

## Copy aprobado

### Hero

**Script:** kind words

**H1:** Client Reviews in the Tri-Cities

**Intro:** I could tell you what a session with me feels like — but the people
who’ve stood in front of my camera say it better.

**Control local:** Read their stories → `#at-ease`

### At Ease, on Purpose

The compliment I treasure most, and the one that appears again and again in my
reviews, is this: how comfortable and at ease people felt — even the ones who
normally hate being photographed. That’s not an accident. It’s the entire way
I’ve built my sessions for twenty years.

### What Tri-Cities Clients Remember

Esta sección reutiliza `KindWords.astro` y los diez registros `featured` en
orden 1–10, sin reescribir citas, autores, tipos ni alt text:

1. Gayla Worlund — Family
2. Beth Granger — Senior
3. Isabella Neville — Senior
4. Kaija Colburn — Headshot
5. Annette Christensen — Family
6. Allissa Empert — Couple
7. Lisa Griffith — Headshot
8. Julie Hrebeniuk — Branding, según la fuente testimonial
9. Christina Bergstrom — Senior
10. Hanna Lnenicka — Family

El resumen `100+ five-star Google reviews` permanece como fallback. El endpoint
GBP solo lo sustituye cuando entrega conjuntamente rating y conteo válidos. En
Reviews el resumen es texto estático con contraste 4.61:1; debajo aparece
**Leave us a review** → `https://g.page/r/CZnCWAWyBWnQEBM/review`, en una pestaña
nueva con `noopener noreferrer`.

### The Photographs Behind the Words

**Intro:** Turn the pages slowly. Every frame is part of a story that felt
worth holding on to.

La página conserva el libro interactivo como su única superficie pública y usa
la fuente única de páginas en `content/journal-pages/*.json`. Las hojas rígidas
giran en 3D desde la esquina inferior durante 1200 ms; en reduced motion
conserva una transición legible sin flip.

### Leave the Nerves at Home

If you noticed a theme — “I was so nervous, and then…” — that’s the part I want
you to hear. Almost everyone arrives a little unsure. Almost everyone leaves
saying it was actually fun. You will too.

El cierre `Leave the Nerves at Home` integra el CTA interno de ruta:
**Start planning your session** → `/contact/`.

---

## Internal links

- El control del hero es un botón de scroll local y no consume anchor.
- `KindWords` muestra el resumen como texto estático y un CTA Google externo.
- El libro no añade destinos.
- Dos anchors dentro de `<main>`, en este orden: Google Reviews externo y
  `/contact/` interno.

## Schema JSON-LD

La ruta emite un `WebPage` canónico y un `BreadcrumbList` Home → Reviews. No
emite `Review` ni `AggregateRating`: los registros disponibles no contienen una
URL, fecha, rating y procedencia estructurada individual suficientes, y no se
deben fabricar. Tampoco se copia un rating vivo de GBP al schema.

## Publicación y crawler outputs

- `contentStatus: ready`
- `searchVisibility: index`
- `sitemap: true`
- `llms: true`
- `lastModified: 2026-08-12`
- Sin regla `/reviews/*` de `X-Robots-Tag` en headers release.
- Staging conserva el `noindex` global.

## Ajustes de feedback y QA

- Se retiraron del DOM/CSS las reglas que se cruzaban en `At Ease`; la firma
  publicada ahora es `arch` y el print B/N conserva el solape.
- El CTA Google usa una animación de relleno de papel y desplazamiento de flecha;
  bajo reduced motion ambas transiciones son inmediatas.
- Se eliminó el `min-height` artificial de KindWords y se compactó el paso al
  Journal. Gap medido: 184/172.8/148/144/144 px en
  1920/1440/1200/900/390.
- Playwright aprobó los cinco viewports, el giro `matrix3d`, teclado, targets
  ≥44 px, contraste, las 30 imágenes originales/clonadas del archive, cero
  overflow/runtime y la regresión de Homepage.
