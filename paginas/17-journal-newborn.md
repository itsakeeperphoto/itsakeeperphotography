# JOURNAL: NEWBORN — `/journal/in-home-vs-studio-newborn-photography/`
_Página 17 de 18 · Content engine → soporta Newborn · Segunda mayor oportunidad (cluster ≈800/mes, KD 0–1)_

> **Estado implementado:** rediseño funcional en `1dd00d3`
> (`feat(journal): redesign newborn comparison guide`). La ruta permanece
> `draft/noindex`, conserva el header release noindex y sigue fuera de sitemap y
> `llms.txt`. No muestra fecha en byline ni schema.

El bloque `COPY` preserva íntegro el texto definitivo entregado por el usuario.
En la auditoría previa a la implementación, la fuente externa y este documento
eran byte-identical, con SHA-256
`bda5c204895def04a6a912265caacf21a5fc90db0b0bd06341ddc9dbef9acfed`.
Los marcadores editoriales viven en `pending` y nunca se renderizan.

## Gates literales de publicación

1. `[VALIDAR CON LISA]`
2. `[VALIDAR: formato exacto que ofrece Lisa]`
3. `[FECHA]`

El primer gate exige aprobación factual de Lisa sobre el artículo completo. El
segundo protege específicamente la afirmación de combinar una sesión íntima en
casa con otra breve a golden hour cuando el bebé sea mayor. El tercero requiere
una fecha editorial real. Hasta resolver los tres, no se permite fabricar
`datePublished`, `dateModified`, `lastModified` ni cambiar la ruta a
`ready/index`.

---

## SEO técnico

| Campo | Valor |
|---|---|
| **URL** | `/journal/in-home-vs-studio-newborn-photography/` |
| **Keyword primaria** | in home newborn photography (390/mes, KD 1) |
| **Secundarias** | in home newborn photography near me (210, KD 0) · in home lifestyle newborn photography (90, KD 0) · newborn in home photography (90) · newborn photography in home (50) · in-home vs studio newborn photography |
| **Title** (53) | `In-Home vs. Studio Newborn Photography: How to Choose` |
| **Meta description** (159) | `In-home or studio newborn photos? An honest comparison from a Tri-Cities newborn photographer — comfort, style, timing and what each session really feels like.` |
| **Estado** | `draft/noindex`; fuera de sitemap y `llms.txt` |
| **Open Graph** | `og:type=article` |
| **Fecha** | Omitida de UI, metadata y schema hasta resolver `[FECHA]` |

### Estructura de headings

Contrato visible exacto: 1 H1, 8 H2, 7 H3 y 3 preguntas frecuentes.

```text
H1  In-Home vs. Studio Newborn Photography
 H2  The Short Answer
 H2  What Is In-Home Newborn Photography?
 H2  What Is Studio Newborn Photography?
 H2  The Honest Comparison
  H3  Comfort (yours and baby's)
  H3  Style of the photographs
  H3  Timing and flexibility
  H3  Preparation and effort
 H2  What About Outdoor Newborn Sessions?
 H2  Which One Will You Treasure More?
 H2  Common Questions
  H3  When should I book newborn photos?
  H3  Is my house too small or too dark for in-home photos?
  H3  What if we missed the two-week window?
 H2  Planning Your Baby's First Photos in the Tri-Cities
```

---

## COPY (artículo)

**H1:** In-Home vs. Studio Newborn Photography

**H2: The Short Answer**

**In-home newborn photography** happens in your own house — natural light, your nursery, your everyday life with baby. **Studio newborn photography** happens in a photographer's controlled space, usually with posed setups, props and backdrops. Neither is "better"; they're different kinds of memories. Here's the honest comparison I walk every expecting family through.

**H2: What Is In-Home Newborn Photography?**

Also called a lifestyle newborn session, an in-home session documents your baby's real first days in the place where they're happening. Baby in the nursery you spent months preparing. Feeding in your favorite chair. Big siblings peeking into the bassinet. The window light in your own bedroom.

Nothing is staged beyond gentle guidance — the photographer works with your home's light and your baby's rhythm. Pauses for feeding, soothing and diaper changes aren't interruptions; they're the session.

**H2: What Is Studio Newborn Photography?**

Studio sessions are the posed, curled-baby portraits you've seen — baby wrapped and sleeping in a basket, on a backdrop, in themed setups. They require a controlled environment, specialized safety training for posing, and typically need to happen in the first two weeks, while babies are sleepy enough to curl.

Done well, studio work is genuinely artful. It's also a different product: styled portraits of your baby, rather than documentation of your life *with* your baby.

**H2: The Honest Comparison**

**H3: Comfort (yours and baby's)**
Recovering from birth, you may not want to pack up a days-old baby and drive anywhere. At home, everything you need is within reach — snacks, changes of clothes, your own bathroom, your own couch. Studios counter with amenities and a "handled-for-you" experience. For most postpartum parents, home wins on comfort.

**H3: Style of the photographs**
Studio: polished, styled, timeless-formal. In-home: warm, personal, documentary — photographs where you can *feel* the season of life. Ask yourself which one you'll want on the wall in twenty years; that answer differs by family, and both are valid.

**H3: Timing and flexibility**
Studio posing usually needs the first 10–14 days. In-home sessions are far more forgiving — beautiful at two weeks or two months, because they don't depend on a curled sleepy pose. If your baby is "already too old" for studio work, an in-home session isn't a consolation prize; it's arguably the more meaningful record.

**H3: Preparation and effort**
Studio: drive there, hand over the reins. In-home: no travel, but a little tidying — and only of the corners we'll actually use. (A good photographer needs one clean window, not a spotless house. Truly.)

**H2: What About Outdoor Newborn Sessions?**

In the Tri-Cities, golden-hour outdoor sessions with a newborn are possible in mild months and make especially beautiful *family* sessions — baby in arms, siblings around, the river light doing its thing. Many families combine: intimate photos at home, then a short golden-hour family set when baby is a bit older.

**H2: Which One Will You Treasure More?**

After twenty years of photographing families, here's what I've seen: the photographs families cry over a decade later are rarely the most styled ones. They're the ones with *their people in their place* — the nursery that got repainted, the house they moved away from, the way dad held the baby in that particular chair. Choose the session that preserves what you most want to remember.

**H2: Common Questions**

**H3: When should I book newborn photos?**
During your second or third trimester. Photographers hold flexible space around due dates — reaching out early means your spot is safe no matter when baby arrives.

**H3: Is my house too small or too dark for in-home photos?**
Almost never. One good window and a few honest square feet are enough — finding the light is the photographer's job, not yours.

**H3: What if we missed the two-week window?**
For in-home lifestyle photos, there's no missed window. Two months old is still brand new, still tiny, still worth documenting.

**H2: Planning Your Baby's First Photos in the Tri-Cities**

If the in-home style speaks to you, that's the heart of how I photograph newborns across Richland, Kennewick and Pasco — gentle, unhurried, baby-led.

---

## Enlaces internos implementados

El hero usa un botón local `Read the comparison` hacia `the-short-answer`; no
cuenta como anchor. Dentro de `<main>` existen exactamente tres enlaces, en este
orden:

1. `Family Photography` → `/family-photographer-tri-cities-wa/`
2. `See how my newborn sessions work` → `/newborn-photographer-tri-cities-wa/`
3. `Expecting? Let's talk early` → `/contact/`

Entrantes previstos en la arquitectura editorial: página Newborn, hub y Journal
Locations. No se consideran publicados hasta que sus fuentes realmente enlacen
esta ruta.

## Media y alt implementados

La ruta reutiliza nueve fuentes existentes: siete imágenes informativas y dos
prints decorativos con alt vacío. No se añadieron, renombraron, recodificaron ni
borraron fotografías para este rediseño.

| Superficie | Fuente | Alt / función |
|---|---|---|
| Fondo del hero | `/uploads/richland-mother-newborn-at-home.jpg` | `A mother holding her sleeping newborn beside a bed.` |
| Print izquierdo del hero | `/uploads/newborn-family-at-home-west-richland.jpg` | Decorativa, `alt=""` |
| Print derecho del hero | `/uploads/newborn-portrait-with-mother-richland.jpg` | Decorativa, `alt=""` |
| Definición in-home | `/uploads/family-newborn-at-home-tricities.jpg` | `Parents and an older sister holding a sleeping newborn together on a bed.` |
| Exterior principal | `/uploads/family-newborn-sunset-tricities.jpg` | `A family gathered around a baby outdoors in warm evening light.` |
| Exterior secundaria | `/uploads/family-with-baby-golden-hour-embrace-tricities.jpg` | `Parents holding their baby close outdoors in warm evening light.` |
| Memoria principal | `/uploads/family-newborn-connection-richland.jpg` | `Parents standing close with their baby in warm evening light.` |
| Memoria secundaria | `/uploads/family-with-baby-black-white-tricities.jpg` | `A family holding a baby together outdoors in a black-and-white portrait.` |
| Cierre | `/uploads/maternity-waiting-to-welcome-tricities.jpg` | `An expecting couple standing together in warm sunset light.` |

Las tres superficies del hero cargan eager; solo el fondo usa prioridad alta.
Las seis imágenes de cuerpo cargan lazy/async. Todas usan dimensiones
intrínsecas y las variantes WebP responsive existentes. Los alt aspiracionales
anteriores sobre nursing, nursery, bassinet y parents by the window fueron
retirados porque las fotografías locales seleccionadas no demostraban esas
escenas.

## Schema implementado

- Un solo `Article`, emitido por Base y enriquecido con headline, autor
  `#lisa`, publisher `#business`, imagen real, `mainEntityOfPage`, tema Newborn
  y cobertura Richland/Kennewick/Pasco.
- Un solo `FAQPage`, derivado 1:1 de las tres preguntas y respuestas visibles de
  `Common Questions`, en el mismo orden.
- Un solo `BreadcrumbList`: Home → Journal → In-Home vs. Studio Newborn
  Photography.
- Ningún `Service`, `Review`, `AggregateRating`, calle, coordenadas, credencial
  de seguridad, `datePublished`, `dateModified` ni `lastModified`.

## Render, dirección y QA

- Renderer especializado `NewbornComparisonPage.astro` tanto en SSR como en el
  refresh Tina; no cae en `ContentPage`.
- Dirección canónica Concept B / Impeccable, `The house as archive`, con un
  díptico de definición: fotografía in-home en arco frente a un marco vacío y
  tipográfico para Studio. Las comps A y C quedaron descartadas.
- CSS de ruta `journal-newborn-comparison-page.css` importado mediante `?url` y
  enlazado solo aquí; sus selectores permanecen bajo
  `.newborn-comparison-*`.
- El validador protege título, description, estado, tres gates, 1/8/7 headings,
  tres anchors, nueve imágenes 7/2, byline sin fecha, tres FAQ, schema y el orden
  literal de todos los párrafos definitivos.
- Staging y release aprobaron 21/21 rutas. Playwright aprobó 1440×1000,
  1200×900, 900×900 y 390×844, más una inspección puntual a 1728 px. El detector
  Impeccable final devolvió `[]`.
- El pase final corrigió crops de hero/exterior/cierre por breakpoint, restauró
  el espaciado vertical, equilibró el díptico en desktop/tablet/móvil y fijó el
  guard exacto de párrafos sin cambiar el copy.
