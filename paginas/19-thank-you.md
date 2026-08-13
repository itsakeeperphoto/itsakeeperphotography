# Página 19 — Thank-you

## Estado y SEO técnico

- **URL:** `/thank-you/`
- **Familia:** utility
- **Estado editorial:** `ready`
- **Visibilidad:** `noindex` permanente
- **Schema:** un `WebPage`; sin BreadcrumbList, Review, AggregateRating u Offer
- **Crawler surfaces:** `sitemap: false`, `llms: false`, `primaryRoute: false`
- **Title:** `Thank You | It's A Keeper Photography`
- **Meta description:** `Your photography inquiry is with Lisa. She reads every message herself and replies personally.`
- **Canonical:** self-referencing según entorno
- **Robots release:** `noindex, nofollow, noarchive` por meta y X-Robots-Tag

La URL permanece accesible a crawlers; no se añade a `robots.txt`, porque el
bot necesita leer el `noindex`. Tampoco declara `lastModified`, ya que nunca
entra en sitemap.

## Hero

- **Script:** `message received`
- **H1:** `Thank You for Reaching Out`
- **Intro:** `Your message is with me. I read every inquiry myself and will write back personally.`
- **Botón local:** `What happens next` → `#your-message-is-with-me`
- **Fondo:** `/uploads/family-golden-hour-columbia-basin.jpg`
- **Alt:** `A family held close in warm golden-hour light in the Tri-Cities`
- **Print izquierdo decorativo:** `/uploads/newborn-family-at-home-west-richland.jpg`
- **Print derecho decorativo:** `/uploads/review-isabella-senior-golden-hour-tricities.jpg`

## H2 — Your Message Is With Me

> I read every inquiry myself. I’ll write back personally, usually with a
> couple of questions so I can understand what you’re hoping for before I start
> suggesting things.

> From there, we can set up a phone call and talk through dates, locations,
> wardrobe and timing together.

- **Firma:** `— Lisa`
- **Retrato:** `/uploads/investment-lisa-studio-portrait-camera.jpg`
- **Alt:** `Lisa Weiss smiling with her camera in her Richland studio`
- **Print B/N decorativo:** `/uploads/lisa-photographer-at-work-black-white.jpg`

## H2 — What Happens Next

### H3 — Read with Care

`I take in what you shared before I start suggesting anything.`

### H3 — A Personal Reply

`You’ll hear from me, not an assistant — usually with a couple of questions.`

### H3 — Plan Together

`If it feels like a fit, we’ll set up a phone call and talk through the details.`

## H2 — A Little More Light, While You Wait

`The portfolio is here whenever you want to spend a little more time with the work.`

- **Imagen:** `/uploads/kennewick-couple-open-field-golden-hour.jpg`
- **Alt:** `A couple walking together through a field at golden hour in Kennewick`
- **Único anchor en `<main>`:** `View the Portfolio` → `/portfolio/`

## Contrato de experiencia

- 1 H1, 3 H2 y 3 H3.
- Seis imágenes: tres informativas y tres decorativas.
- Un botón de desplazamiento y un solo anchor de cuerpo.
- Sin formulario, Contact CTA, precio, rating, testimonial, fecha de respuesta
  o afirmación de booking.
- Responsive verificado en 1440, 1200, 900 y 390 px.
- Reduced motion conserva todos los contenidos visibles y sin transformaciones.
