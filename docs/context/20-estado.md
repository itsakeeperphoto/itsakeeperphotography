# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-08 22:40 -05

**Actualizado por:** Codex / GPT-5.6

**Rama:** `main`

**Commit base al iniciar Kennewick v2:** `fca4196` —
`docs(context): record Richland publication`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Publicación:** al iniciar Kennewick v2, `main` y `origin/main` coinciden en
`fca4196`; el usuario sincronizó los ocho commits anteriores fuera de Codex. Por
instrucción expresa vigente, Codex crea commits locales y no ejecuta pushes. No
se ejecutó deploy ni cambio de DNS desde esta sesión.

---

## Siguiente paso concreto

Implementar el documento Kennewick v2 como fuente definitiva, retirar el copy
v1 que publica spots exactos y conservar la galería real como mejora posterior
no bloqueante. Tras QA de contenido, diseño, schema y los cuatro viewports,
publicar `/kennewick-wa-photographer/` como `ready/index` en sitemap/llms y sin
header noindex específico. Los agentes crean solo commits locales y no hacen
push.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Richland, Family Photo Locations y
  Portfolio. Thank-you es `ready/noindex`; las otras 15 rutas permanecen
  `draft/noindex`.
- `/richland-wa-photographer/` está `ready/index` con `lastModified:
  2026-08-08`. Usa el copy v2 centrado en que Lisa vive en Richland desde 2005;
  retiró Howard Amon, Badger Mountain y la dirección privada. La galería queda
  como mejora opcional y no se renderiza mientras esté vacía.
- La superficie Richland es un “light ledger” editorial: retícula de 12
  columnas, un arco, directorio navegable de cinco servicios, ratios naturales,
  planning, FAQ y cierre fotográfico. La galería no se renderiza mientras esté
  vacía.
- `/journal/family-photo-locations-tri-cities/` quedó terminada para
  producción con fecha editorial `2026-08-08`, sin placeholders, en sitemap y
  en `llms.txt`.
- El build release y el build staging terminaron con
  `Validated 21 public routes`. Release publica cinco URLs en sitemap y cuatro
  en `llms.txt`; staging conserva sitemap vacío y noindex global.
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
- `src/content/pending.ts` contiene ahora 35 entradas y ninguna corresponde a
  Richland.

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
  como mejora condicional y no existe en DOM sin fotografías verificadas.
- Las cinco filas del directorio son anchors nativos de área completa hacia las
  rutas existentes de Senior, Family, Newborn, Branding y Headshots. Un barrido
  horizontal, el título y una flecha SVG responden en 180–220 ms; foco visible
  y movimiento reducido tienen estados explícitos.
- Se usan fotografías reales ya autorizadas con alt literal; ningún filename
  por sí solo se trató como prueba local. Paisajes y retratos mantienen sus
  ratios 3:2, 9:5, 3:4 y 15:19 en vez de recortes verticales arbitrarios.
- La matriz anterior sigue aprobada en 1440, 1200, 900 y 390 px. Para este
  cambio Playwright release confirmó 1728×963 y 390×844: cinco destinos
  exactos, filas de 1344×116 y 366×164 px, overflow 0, activación con Enter,
  focus visible y transforms anulados con reduced motion. `<main>` contiene
  nueve anchors por la excepción de ruta ADR-033.
- Está `ready/index` en contenido y ambos manifiestos, con `lastModified:
  2026-08-08`. El artefacto release confirma meta index, canonical `www`,
  membresía en sitemap/llms y ausencia del header noindex específico. Staging
  conserva canonical Netlify y noindex global.

### SEO y schema

- Meta robots release: `index, follow, max-image-preview:large`.
- Canonical release:
  `https://www.itsakeeperphotography.com/journal/family-photo-locations-tri-cities/`.
- Sitemap release: cinco URLs en orden Home, Family, Richland, Locations y
  Portfolio. Richland y Locations llevan `lastmod 2026-08-08`.
- `llms.txt`: Home, Family, Richland y Locations; Portfolio permanece excluido.
- `config/netlify-headers/release` ya no contiene el wildcard
  `/journal/*`. Conserva noindex explícito para `/journal/` y los tres
  artículos draft canónicos.
- JSON-LD verificado: LocalBusiness, WebSite, Article, FAQPage y
  BreadcrumbList; cinco FAQs visibles y tres breadcrumbs.
- No se emiten Review/AggregateRating sin evidencia verificada.
- Richland release conserva canonical
  `https://www.itsakeeperphotography.com/richland-wa-photographer/`, meta robots
  `index, follow, max-image-preview:large` y no recibe `X-Robots-Tag: noindex`.
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
| `/richland-wa-photographer/` | ready/index | Sí | Galería posterior opcional; copy/UI/schema completos. |
| `/journal/family-photo-locations-tri-cities/` | ready/index | Sí | Fecha y QA final completos. |
| `/portfolio/` | ready/index | Sí | Excluido de llms. |
| `/thank-you/` | ready/noindex | No | Destino de formularios. |
| Otras 15 rutas | draft/noindex | No | Conservar gates hasta resolver hechos/media/QA. |

## Archivos cambiados en esta sesión

- Publicación: `content/pages/richland.json`, `src/lib/page-manifest.ts` y la
  copia raíz `page-manifest.ts`.
- Gates: `config/netlify-headers/release`, `scripts/validate-site.mjs`,
  `src/content/pending.ts` y `src/components/pages/RichlandPage.astro`.
- Arquitectura/editorial: `STRUCTURE.md`, `paginas/00-INDICE.md`,
  `paginas/11-richland.md` y el brief de superficie Richland.
- Memoria: `docs/context/10-arquitectura.md`, `20-estado.md`,
  `30-decisiones.md`, `40-bitacora.md` y `50-backlog.md`.
- No cambiaron copy visible, fotografías, CSS, routing, Tina, tipos ni schema.

## Qué está a medias

| Archivo / módulo | Estado | Qué falta |
|---|---|---|
| `src/content/pending.ts` | 35 entradas | Resolver hechos/media de las rutas draft con Lisa. |
| Seniors y Senior timing | Draft | Número de imágenes, offer Q54, fechas/distritos y QA final. |
| Newborn y comparación | Draft | Formato, handling/safety, validación editorial y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, cantidades/duración y QA según cada ruta. |
| About/Reviews/Privacy | Draft | Hechos/permisos, reseñas autorizadas y revisión legal. |
| Galería Richland | Mejora opcional | Añadir 6–10 sesiones verificadas cuando el usuario las suministre. |
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
git diff --check
```

- Release: `Validated 21 public routes in release mode.`
- Staging: `Validated 21 public routes in staging mode.`
- Release Richland: meta `index, follow, max-image-preview:large`, canonical
  `www`, `data-content-status="ready"`, sin header noindex ni placeholders.
- Sitemap release: cinco canonicals; Richland ocupa la tercera posición con
  `lastmod 2026-08-08`. `llms.txt` contiene cuatro páginas y robots anuncia el
  sitemap `www`.
- Staging Richland: meta `noindex, nofollow, noarchive`, canonical Netlify,
  sitemap vacío, `llms.txt` de preview y header global noindex.
- JSON-LD release: LocalBusiness, WebSite, WebPage, BreadcrumbList y FAQPage
  parseables; FAQ 4:4, breadcrumb 2 ítems, sin `streetAddress`, Review ni
  AggregateRating.
- Playwright release: 1728×963 y 390×844; cinco anchors `<a>` con hrefs exactos,
  targets 1344×116 y 366×164 px, overflow 0 y navegación con Enter al servicio
  Senior. Foco: outline 2 px; reduced motion: `0.01ms` y transform `none`.
- Hover desktop: barrido `scaleX(0→1)`, título `translateX(5.6px)` y flecha
  `translate(2px,-2px)` en 180–220 ms.
- La revisión independiente detectó contraste 2.43:1 en `01–05`; se cambió a
  Warm Ivory y la confirmación calculó 4.61:1 sobre Muted Olive en ambos
  viewports.
- La única consola externa fue un 400 de Microsoft Clarity en localhost; no
  hubo errores de la aplicación.
- El dev server existente se detuvo temporalmente para liberar Tina durante los
  builds; release y staging pasaron sin cambios incidentales y `npm run dev` se
  restauró en `http://localhost:4321/` al cierre.

## Bloqueadores externos

1. **Operación Git:** el usuario prohibió pushes desde Codex; solo se crean
   commits locales. Kennewick v2 empieza sincronizada en `fca4196`. No se
   ejecuta `./scripts/handoff.sh` porque su protocolo incluye push y contradice
   esa orden explícita.
2. **Deploy:** no se lanzó producción ni se cambió DNS. La validación es sobre
   artefacto release local.
3. **Netlify:** faltan notificaciones reales de Forms y prueba end-to-end.
4. **Google/GBP:** faltan credenciales/IDs y prueba del resumen dinámico.
5. **Legal/privacidad:** Privacy requiere revisión humana, incluyendo Clarity y
   Google Analytics.

## Preguntas abiertas

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

El servidor de desarrollo y Tina están activos en `localhost:4321` y `:9000`.
Para validar publicación:

```bash
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
```
