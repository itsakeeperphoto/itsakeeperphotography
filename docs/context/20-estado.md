# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-08 18:36 -05

**Actualizado por:** Codex / GPT-5.6

**Rama:** `main`

**Commit base de esta sesión:** `eaa68d1` — `docs: handoff 2026-08-08 — documenta push bloqueado`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado git previo al cierre:** `main` estaba dos commits por delante de
`origin/main`; los cambios de esta sesión quedan preparados para el commit que
crea `./scripts/handoff.sh`. No se ejecutó ningún deploy ni cambio de DNS.

---

## Siguiente paso concreto

Ejecutar el handoff, publicar los commits locales con una identidad que tenga
escritura en `itsakeeperphoto/itsakeeperphotography` y comprobar en el deploy
release que:

1. la guía responde 200 y mantiene canonical `www` + `index, follow`;
2. `/sitemap.xml` contiene la guía con `lastmod 2026-08-08`;
3. el header HTTP no añade `X-Robots-Tag: noindex` a la guía;
4. Clarity y GA4 reciben una visita real sin contaminar métricas con staging.

Después, priorizar Seniors o la siguiente ruta que Lisa complete. No cambiar
otra ruta a `ready/index` mientras conserve pendientes o QA incompleto.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Family Photo Locations y Portfolio.
  Thank-you es `ready/noindex`; las otras 16 rutas permanecen
  `draft/noindex`.
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
- Las seis correcciones visuales solicitadas quedaron aplicadas. Playwright
  cubrió 1728×963, 1440×1000, 1200×1000, 900×1000 y 390×844 sin overflow ni
  errores de consola.
- La foto del cierre proviene del folder autorizado de Drive
  “Family Session - Richland”; se importó a 2400×1600 y el build genera WebP de
  400, 640, 960 y 1440 px.
- `src/content/pending.ts` contiene ahora 39 entradas; ninguna corresponde a
  esta guía.

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
- “Four Kinds” usa una retícula medida: una imagen principal y tres columnas
  iguales en desktop, dos columnas en tablet y una columna uniforme en móvil.
- Se eliminaron la línea vertical junto al título de session fit y la línea que
  salía del marco de winter.
- El título y script de Seasons ya no se solapan: la medición fue 0 px en los
  cinco viewports.
- “I’ll find the light” usa `--color-deep-umber`; contraste calculado sobre
  sand: 7.10:1.
- El cierre usa la nueva foto como fondo editorial en desktop y como imagen 3:2
  completa en móvil para no recortar a la familia.

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
| Otras 16 rutas | draft/noindex | No | Conservar gates hasta resolver hechos/media/QA. |

## Archivos cambiados en esta sesión

- Contenido/publicación: `content/pages/journal-family-locations.json`,
  `src/lib/page-manifest.ts`, `page-manifest.ts`,
  `src/content/pending.ts`.
- Render/schema: `src/pages/journal/[slug].astro`,
  `src/components/pages/LocationsGuidePage.astro`.
- Diseño: `src/styles/journal-locations-page.css`.
- Crawler gates: `config/netlify-headers/release`,
  `scripts/validate-site.mjs`.
- Fuente/docs: `paginas/15-journal-locations.md`,
  `paginas/00-INDICE.md`, `STRUCTURE.md`, `docs/context/`.
- Asset:
  `public/uploads/journal-locations-final-family-richland-tricities.jpg`;
  variantes WebP se regeneran mediante `npm run optimize:images`.

## Qué está a medias

| Archivo / módulo | Estado | Qué falta |
|---|---|---|
| `src/content/pending.ts` | 39 entradas | Resolver hechos/media de las rutas draft con Lisa. |
| Seniors y Senior timing | Draft | Número de imágenes, offer Q54, fechas/distritos y QA final. |
| Newborn y comparación | Draft | Formato, handling/safety, validación editorial y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, cantidades/duración y QA según cada ruta. |
| About/Reviews/Privacy | Draft | Hechos/permisos, reseñas autorizadas y revisión legal. |
| Richland/Kennewick/Pasco | Draft | Conocimiento local, imágenes/alt y travel confirmados. |
| Netlify Forms | Código listo | Configurar/verificar notificaciones reales en Dashboard. |
| GBP summary | Código listo | Configurar OAuth/IDs y probar cache/endpoints reales. |
| Analítica | Snippets instalados | Verificar recepción real y política de staging/consentimiento. |
| `README.md` | Obsoleto | Actualizar en una tarea separada. |
| `page-manifest.ts` raíz | Duplicado no consumido | Se sincronizó esta guía; eliminar/consolidar en refactor separado. |

## Verificación ejecutada

```bash
npm run optimize:images
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
node /Users/williammelo/.agents/skills/impeccable/scripts/detect.mjs --json \
  src/components/pages/LocationsGuidePage.astro \
  src/styles/journal-locations-page.css
git diff --check
```

- Release: `Validated 21 public routes in release mode.`
- Staging: `Validated 21 public routes in staging mode.`
- Detector Impeccable: `[]`.
- Playwright: cinco viewports, overflow horizontal 0, Seasons overlap 0,
  `fit` border-right 0, pseudo de winter `none`, consola 0 errores.
- Artefacto release: cinco JSON-LD parsean; Article y sitemap usan
  `2026-08-08`; la foto final incluye srcset 400/640/960/1440.

## Bloqueadores externos

1. **GitHub:** antes de este cierre, `main` estaba dos commits por delante de
   `origin/main`; la última sesión autenticada como `williammelo533` recibió
   HTTP 403. El usuario puede publicar con su método autorizado.
2. **Deploy:** no se lanzó producción ni se cambió DNS. La validación es sobre
   artefacto release local.
3. **Netlify:** faltan notificaciones reales de Forms y prueba end-to-end.
4. **Google/GBP:** faltan credenciales/IDs y prueba del resumen dinámico.
5. **Legal/privacidad:** Privacy requiere revisión humana, incluyendo Clarity y
   Google Analytics.

## Preguntas abiertas

- TODO(contexto): ¿qué ruta draft debe priorizarse ahora: Seniors, Investment u
  otra?
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
