# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-08 23:38 -05

**Actualizado por:** Codex / GPT-5.6

**Rama:** `main`

**Commit base al iniciar Kennewick v2:** `fca4196` —
`docs(context): record Richland publication`

**Commit funcional verificado:** `b65c3c5` —
`feat(kennewick): publish v2 city page`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al terminar:** este cierre deja `main` tres commits delante de
`origin/main`: `8a0e467`, `b65c3c5` y el commit documental que contiene este
archivo. Por instrucción expresa vigente, Codex no ejecutó push, deploy ni
cambio externo.

---

## Siguiente paso concreto

El usuario debe publicar los tres commits locales con su identidad autorizada.
Después, verificar en el dominio oficial Richland y Kennewick: status 200,
canonical `www`, meta index, ausencia de `X-Robots-Tag: noindex`, membresía de
sitemap/`llms.txt` y `lastmod 2026-08-08`. No añadir la galería Kennewick hasta
recibir sesiones con procedencia local y alt literal verificados.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Richland, Kennewick, Family Photo
  Locations y Portfolio. Thank-you es `ready/noindex`; las otras 14 rutas
  permanecen `draft/noindex`.
- `/kennewick-wa-photographer/` usa ahora el documento v2 definitivo. Se
  retiraron Columbia Park, spots exactos, headings v1 y todo placeholder.
- El argumento propio de Kennewick es el contraste de estilo: trabajo cálido,
  rico y algo moody frente al look light and airy dominante. El copy visible se
  conserva completo, incluidos sus dos énfasis editoriales.
- La galería local quedó como mejora opcional. Su sección no genera heading,
  imagen, wrapper ni whitespace mientras no tenga ítems completos y
  verificados.
- La ruta está `ready/index`, con `lastModified: 2026-08-08`; release contiene
  seis URLs en sitemap y cinco en `llms.txt`. Staging conserva sitemap vacío y
  noindex global.
- El release emite LocalBusiness, WebSite, WebPage, Service, BreadcrumbList y
  FAQPage. Las cuatro FAQ visibles coinciden 4:4 con schema; no aparecen
  `streetAddress`, Review ni AggregateRating.
- Playwright verificó 1440×1000, 1200×1000, 900×1000 y 390×844. La revisión
  independiente terminó `VERDICT: SHIP` sin defectos materiales.
- El servidor local fue restaurado y está activo en `localhost:4321`; Tina usa
  `:9000` y su API local `:4001`.

## Qué funciona hoy

### Kennewick v2

- Fuente editorial: `paginas/12-kennewick.md`; runtime:
  `content/pages/kennewick.json`.
- `KennewickPage.astro` exige las secciones v2, cinco filas de servicio
  completas y cuatro FAQ. Los fallbacks de copy, imagen y alt de v1 fueron
  eliminados.
- El hero split usa H1 y subhead exactos, una fotografía vertical completa y
  un botón nativo que desplaza/focaliza `#kennewick-final`; no consume un anchor.
- La dirección “Warm Proof / Tonal Contact Sheet” traduce las referencias a
  retícula, escala y vacío. La única firma visual es un panorama que hace
  contacto con un arco. No usa tape, papel rasgado, rotaciones, sombras,
  gradientes ni texturas inventadas.
- Las cinco fotografías ya autorizadas funcionan como portfolio general de
  Tri-Cities. Sus alt texts son literales y nunca afirman que la sesión ocurrió
  en Kennewick.
- “What Works Well in Kennewick” queda deliberadamente text-led para no usar
  portfolio genérico como prueba local.
- El directorio contiene cinco anchors de área completa hacia Senior, Family,
  Newborn, Branding y Headshots, con detalle, flecha, foco visible, hover solo
  en dispositivos finos y reduced motion explícito.
- `<main>` contiene exactamente nueve anchors: tres contextuales, cinco de
  servicio y Contact final. La galería vacía está ausente del DOM.
- FAQ usa controles nativos `<details>/<summary>`; el mismo arreglo filtrado
  alimenta el DOM y FAQPage.

### SEO, schema y publicación

- Release Kennewick: meta
  `index, follow, max-image-preview:large`, canonical
  `https://www.itsakeeperphotography.com/kennewick-wa-photographer/` y ningún
  header noindex específico.
- Sitemap release: Home, Family, Richland, Kennewick, Locations y Portfolio.
  Kennewick lleva `lastmod 2026-08-08`.
- `llms.txt`: Home, Family, Richland, Kennewick y Locations; Portfolio sigue
  fuera de llms.
- `Service` declara `Portrait photography`, provider `/#business` y
  `areaServed` Kennewick dentro de Washington; no presenta una sede física en
  esa ciudad.
- `scripts/validate-site.mjs` valida los seis indexables, los outputs crawler,
  el schema seguro y exactamente nueve body links en Richland/Kennewick.
- `scripts/playwright-evidence.js` conserva el máximo general de cuatro links y
  reconoce únicamente las dos excepciones aprobadas de nueve.
- `config/netlify-headers/release` ya no bloquea Kennewick; mantiene los gates
  de Contact, Pasco, Journal draft, Privacy y Thank-you.

### Verificación ejecutada

```bash
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
node /Users/williammelo/.agents/skills/impeccable/scripts/detect.mjs --json src/components/pages/KennewickPage.astro src/styles/kennewick-page.css content/pages/kennewick.json
git diff --check
```

- Staging: `Validated 21 public routes in staging mode.`
- Release: `Validated 21 public routes in release mode.`
- Impeccable detector: `[]`.
- Playwright: document `scrollWidth === clientWidth` en los cuatro viewports;
  una H1; seis H2 visibles; nueve anchors; galería ausente; cinco imágenes
  completas; cero overflow y cero errores de consola.
- A 900 y 390 px el H1 tiene `scrollWidth === clientWidth` y no intersecta la
  fotografía. Targets mínimos móviles: servicios 117 px, FAQ 96 px.
- El botón hero mueve foco al cierre; la primera FAQ cierra y abre con Enter;
  los cinco destinos de servicio coinciden con las rutas canónicas.
- Artefacto release: FAQ visible/schema 4:4, sitemap y llms incluyen Kennewick,
  `_headers` no contiene su regla noindex y no existen marcadores
  `[PENDIENTE]`/`[VALIDAR]` en el HTML.
- Finish review fresco: PASS en copy/proof, responsive, craft, a11y/motion y
  SEO/release; `VERDICT: SHIP`.

## Archivos del cambio funcional

- Contenido/fuente: `content/pages/kennewick.json`,
  `paginas/12-kennewick.md`, `paginas/00-INDICE.md`.
- UI: `src/components/pages/KennewickPage.astro`,
  `src/styles/kennewick-page.css` y el brief
  `.impeccable/surfaces/route-kennewick-wa-photographer.md`.
- Publicación/schema: `src/pages/[slug].astro`, ambos `page-manifest.ts`,
  `config/netlify-headers/release`, `src/content/pending.ts`.
- QA/estructura: `scripts/validate-site.mjs`,
  `scripts/playwright-evidence.js`, `STRUCTURE.md` y
  `docs/context/10-arquitectura.md`.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado | Qué falta |
|---|---|---|
| Galería Kennewick | Mejora opcional | Añadir 6–10 sesiones verificadas con alt literal; no es gate. |
| Galería Richland | Mejora opcional | Añadir sesiones verificadas cuando el usuario las suministre. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA final. |
| Newborn / comparación | Draft | Formato, safety/handling, validación y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Pasco | Draft | Copy local especializado, hechos/media y QA. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales en Dashboard. |
| GBP summary | Código listo | Configurar OAuth/IDs y probar cache/endpoints reales. |
| Analítica | Snippets instalados | Verificar recepción y política de staging/consentimiento. |
| `README.md` | Obsoleto | Actualizar en una tarea separada. |

`src/content/pending.ts` contiene 32 entradas; ninguna corresponde a Richland,
Kennewick ni Family Photo Locations.

## Bloqueadores externos

1. **Git/deploy:** el usuario prohibió pushes desde Codex. Los tres commits
   locales todavía no están en `origin/main`; no se ejecutó
   `./scripts/handoff.sh` porque incorpora push.
2. **Producción:** el artefacto release local pasa, pero falta comprobar la
   respuesta HTTP real después del push/deploy autorizado.
3. **Netlify/GBP/analítica/legal:** permanecen las verificaciones externas del
   backlog; no se inventaron como resueltas.

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

Al cerrar, el servidor local ya está activo en `http://localhost:4321/`. Para
revalidar publicación:

```bash
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run build:local
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local
```
