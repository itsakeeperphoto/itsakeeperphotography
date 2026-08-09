# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-08 20:44 -05

**Actualizado por:** Codex / GPT-5.6

**Rama:** `main`

**Commit base al iniciar Richland v2:** `7032ead` —
`docs(context): record locations section redesign`

**Commit de implementación Richland v2:** `f23ae47` —
`feat(richland): implement local photographer page v2`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Publicación:** al cerrar, `main` queda cuatro commits por delante de
`origin/main`: dos previos, `f23ae47` y este cierre documental. Por instrucción
expresa del usuario, Codex crea commits locales y no ejecuta pushes. No se
ejecutó deploy ni cambio de DNS.

---

## Siguiente paso concreto

Completar la única condición restante de
`/richland-wa-photographer/`: seleccionar 6–10 sesiones reales con procedencia
Richland verificada y alt text literal sin revelar el spot exacto. Solo después
se puede evaluar `ready/index`, retirar su header noindex e incluirla en
sitemap/llms con un nuevo build y QA. Hasta entonces debe permanecer
`draft/noindex`. Los agentes crean solo commits locales y no hacen push.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Family Photo Locations y Portfolio.
  Thank-you es `ready/noindex`; las otras 16 rutas permanecen
  `draft/noindex`.
- `/richland-wa-photographer/` usa ahora el copy v2 centrado en que Lisa vive en
  Richland desde 2005; retiró Howard Amon, Badger Mountain y la dirección
  privada. Conserva una sola condición editorial: la galería real de 6–10
  sesiones.
- La superficie Richland es un “light ledger” editorial: retícula de 12
  columnas, un arco, directorio de cinco servicios, ratios naturales, planning,
  FAQ y cierre fotográfico. La galería no se renderiza mientras esté vacía.
- `/journal/family-photo-locations-tri-cities/` quedó terminada para
  producción con fecha editorial `2026-08-08`, sin placeholders, en sitemap y
  en `llms.txt`.
- El build release y el build staging terminaron con
  `Validated 21 public routes`. Release publica cuatro URLs en sitemap;
  staging conserva sitemap vacío y noindex global.
- El Article schema contiene fecha de publicación/modificación, imagen,
  `mainEntityOfPage`, autor y publisher. También parsean LocalBusiness,
  WebSite, FAQPage y BreadcrumbList.
- FAQPage es verdadero y válido Schema.org, pero un sitio comercial no debe
  esperar el rich result FAQ restringido por Google.
- “Four Kinds” recibió un segundo rediseño basado en las referencias aportadas:
  contact sheet asimétrico, una sola foto arqueada y una sola impresión con mat.
  Playwright cubrió 1728×963, 1440×1000, 1200×1000, 900×1000 y 390×844 sin
  overflow, solapamientos ni errores de consola.
- La foto del cierre proviene del folder autorizado de Drive
  “Family Session - Richland”; se importó a 2400×1600 y el build genera WebP de
  400, 640, 960 y 1440 px.
- `src/content/pending.ts` contiene ahora 36 entradas; una corresponde a la
  galería Richland.

## Qué funciona hoy

### Build y publicación

- `SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local`
  valida las 21 rutas y genera los crawler outputs de producción.
- `SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local`
  valida las mismas 21 rutas con canonical Netlify, sitemap vacío y noindex
  global.
- `scripts/validate-site.mjs` comprueba la membresía exacta de sitemap/llms,
  indexabilidad por ruta y reglas noindex explícitas de los drafts de Journal.
- Los dos formularios Netlify siguen siendo detectables estáticamente.

### Family Photo Locations

- Fuente editorial: `paginas/15-journal-locations.md`.
- Contenido runtime: `content/pages/journal-family-locations.json`.
- Ruta, manifiesto principal y copia raíz del manifiesto están sincronizados en
  `ready/index` con `lastModified: 2026-08-08`.
- Los spots permanecen anónimos por criterio editorial cerrado; no existe
  pendiente de nombrar Chamna ni se añadieron datos por inferencia.
- “Four Kinds” usa una retícula editorial de 12 columnas: 01 domina a la
  izquierda, 02 se desplaza a la derecha, 03 es el único arco y 04 la única
  impresión con mat marfil. Tablet usa 2×2 y móvil conserva 01–04 en una sola
  columna con paisajes 3:2.
- Cada `article` queda asociado a su `h3` mediante `aria-labelledby`; el deep
  link de la sección reserva además el alto del header sticky.
- Se eliminaron la línea vertical junto al título de session fit y la línea que
  salía del marco de winter.
- El título y script de Seasons ya no se solapan: la medición fue 0 px en los
  cinco viewports.
- “I’ll find the light” usa `--color-deep-umber`; contraste calculado sobre
  sand: 7.10:1.
- El cierre usa la nueva foto como fondo editorial en desktop y como imagen 3:2
  completa en móvil para no recortar a la familia.

### Richland v2

- Fuente editorial: `paginas/11-richland.md`; runtime:
  `content/pages/richland.json`.
- La residencia de Lisa y su conocimiento de la luz sustituyen los spots
  nominales de v1. El copy conserva todo el documento aprobado salvo Canyon
  Street/dirección completa, omitidas por ADR-019 y ADR-032.
- La página renderiza residencia, Twenty Years, un directorio visual de cinco
  servicios, planning, cuatro FAQ y CTA. “Recent Richland Sessions” queda
  condicional y no existe en DOM sin fotografías verificadas.
- Se usan fotografías reales ya autorizadas con alt literal; ningún filename
  por sí solo se trató como prueba local. Paisajes y retratos mantienen sus
  ratios 3:2, 9:5, 3:4 y 15:19 en vez de recortes verticales arbitrarios.
- Playwright release aprobó 1440×1000, 1200×1000, 900×1000 y 390×844: overflow
  0, gaps 0, 11/11 imágenes, H1 única, controles principales ≥44 px, focus
  visible, FAQ por teclado, reduced motion y consola limpia. Tras el finish
  review, la línea “Photographer” quedó contenida a 390 px y `<main>` conserva
  exactamente cuatro anchors internos.
- Sigue `draft/noindex`; no se tocó manifiesto, header fuente, sitemap ni llms.
  El artefacto release confirma meta/header noindex y exclusión de crawlers.

### SEO y schema

- Meta robots release: `index, follow, max-image-preview:large`.
- Canonical release:
  `https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/`.
- Sitemap release: cuatro URLs en orden Home, Family, Locations, Portfolio; la
  guía lleva `lastmod 2026-08-08`.
- `llms.txt`: Home, Family y Locations; Portfolio permanece excluido.
- `config/netlify-headers/release` ya no contiene el wildcard
  `/journal/*`. Conserva noindex explícito para `/journal/` y los tres
  artículos draft canónicos.
- JSON-LD verificado: LocalBusiness, WebSite, Article, FAQPage y
  BreadcrumbList; cinco FAQs visibles y tres breadcrumbs.
- No se emiten Review/AggregateRating sin evidencia verificada.
- Richland release conserva canonical
  `https://www.itsakeeperphotography.com/richland-wa-photographer/`, meta robots
  `noindex, nofollow, noarchive` y el mismo valor en `X-Robots-Tag`.
- Sus cinco JSON-LD parsean como LocalBusiness, WebSite, WebPage,
  BreadcrumbList y FAQPage. Las cuatro FAQ visibles coinciden 4:4 con schema;
  LocalBusiness publica solo Richland/WA/US, sin `streetAddress`.

### Integraciones

- Microsoft Clarity `xyqkkqom4v` y Google tag/GA4 `G-0YW8M601L1` cargan en
  el `<head>` compartido.
- TinaCMS mantiene el modelo `finalCta.image`; la foto nueva no requirió
  cambios de types, query ni schema de contenido.
- Google Drive fue fuente manual autorizada del asset; no es dependencia de
  runtime.

## Estado de publicación por ruta

| Ruta | Estado | Sitemap release | Observación |
|---|---|---:|---|
| `/` | ready/index | Sí | Homepage, autoridad visual. |
| `/family-photographer-tri-cities-wa/` | ready/index | Sí | Servicio Family. |
| `/journal/family-photo-locations-tri-cities/` | ready/index | Sí | Fecha y QA final completos. |
| `/portfolio/` | ready/index | Sí | Excluido de llms. |
| `/thank-you/` | ready/noindex | No | Destino de formularios. |
| `/richland-wa-photographer/` | draft/noindex | No | Copy/UI v2 completos; falta galería verificada. |
| Otras 15 rutas | draft/noindex | No | Conservar gates hasta resolver hechos/media/QA. |

## Archivos cambiados en esta sesión

- Contenido/runtime: `content/pages/richland.json`,
  `src/content/pending.ts`.
- Render/schema: `src/components/pages/RichlandPage.astro`.
- Diseño: `src/styles/richland-page.css`.
- Fuente/editorial: `paginas/11-richland.md`, `paginas/00-INDICE.md`.
- Dirección de superficie:
  `.impeccable/surfaces/route-richland-wa-photographer.md`.
- Memoria: `docs/context/20-estado.md`, `30-decisiones.md`,
  `40-bitacora.md` y `50-backlog.md`.
- No cambiaron assets, routing, Tina, tipos, manifiestos, headers ni crawler
  outputs fuente.

## Qué está a medias

| Archivo / módulo | Estado | Qué falta |
|---|---|---|
| `src/content/pending.ts` | 36 entradas | Resolver hechos/media de las rutas draft con Lisa. |
| Seniors y Senior timing | Draft | Número de imágenes, offer Q54, fechas/distritos y QA final. |
| Newborn y comparación | Draft | Formato, handling/safety, validación editorial y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, cantidades/duración y QA según cada ruta. |
| About/Reviews/Privacy | Draft | Hechos/permisos, reseñas autorizadas y revisión legal. |
| Richland | Draft | Falta solo la galería verificada de 6–10 sesiones. |
| Kennewick/Pasco | Draft | Conocimiento local, imágenes/alt y travel confirmados. |
| Netlify Forms | Código listo | Configurar/verificar notificaciones reales en Dashboard. |
| GBP summary | Código listo | Configurar OAuth/IDs y probar cache/endpoints reales. |
| Analítica | Snippets instalados | Verificar recepción real y política de staging/consentimiento. |
| `README.md` | Obsoleto | Actualizar en una tarea separada. |
| `page-manifest.ts` raíz | Duplicado no consumido | Se sincronizó esta guía; eliminar/consolidar en refactor separado. |

## Verificación ejecutada

```bash
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
node /Users/williammelo/.agents/skills/impeccable/scripts/detect.mjs --json \
  --scope layout \
  src/components/pages/RichlandPage.astro \
  src/styles/richland-page.css
git diff --check
```

- Release: `Validated 21 public routes in release mode.`
- Staging: `Validated 21 public routes in staging mode.`
- Detector Impeccable: `[]`.
- Playwright release: 1440×1000, 1200×1000, 900×1000 y 390×844; overflow 0,
  gaps 0, 11/11 imágenes, una H1, seis H2 en orden, galería ausente, controles
  principales ≥44 px, H1 móvil completa y consola 0 errores/advertencias.
- `<main>` contiene exactamente cuatro anchors internos: About, Locations
  Guide, Investment y Contact final. “Plan Your Session” es un botón que
  desplaza y mueve foco a `#richland-final`.
- La segunda FAQ abre/cierra con Enter; el focus usa outline 2 px/offset 4 px;
  reduced motion reduce las transiciones a `0.01ms`.
- Artefacto Richland: cinco JSON-LD parsean; FAQ visible/schema 4:4;
  LocalBusiness sin `streetAddress`; canonical `www`; meta/header noindex; sin
  Howard Amon, Badger Mountain, Canyon Street ni “Recent Richland Sessions”.
- El primer build dentro del sandbox falló por `listen EPERM ::1:4001`; un
  proceso hijo de Tina quedó ocupando 9000. Se identificó y detuvo solo ese
  proceso, y las dos corridas autorizadas pasaron sin cambios incidentales.
- Finish reviewer fresco posterior a las correcciones: `PASS` sin hallazgos
  materiales.

## Bloqueadores externos

1. **Operación Git:** el usuario prohibió pushes desde Codex; solo se crean
   commits locales. La tarea empezó `ahead 2`; tras `f23ae47` y este cierre
   documental termina `ahead 4`.
2. **Deploy:** no se lanzó producción ni se cambió DNS. La validación es sobre
   artefacto release local.
3. **Netlify:** faltan notificaciones reales de Forms y prueba end-to-end.
4. **Google/GBP:** faltan credenciales/IDs y prueba del resumen dinámico.
5. **Legal/privacidad:** Privacy requiere revisión humana, incluyendo Clarity y
   Google Analytics.

## Preguntas abiertas

- TODO(contexto): ¿cuáles son las 6–10 sesiones con procedencia Richland
  verificable que deben formar la galería de publicación?
- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?

## Cómo levantar el proyecto

```bash
npm install
cp .env.example .env
npm run dev
```

El servidor de desarrollo se detuvo para liberar los puertos de Tina durante
los builds. Para validar publicación:

```bash
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
```
