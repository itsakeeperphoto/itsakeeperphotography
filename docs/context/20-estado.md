# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 11:21 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `c9befdc` —
`feat(seo): publish headshots and harden site signals`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Base remota al inicio:** `a792e17` — `TinaCMS content update`

**Estado Git:** antes del commit documental, `main` está tres commits por
delante de `origin/main`. No se hizo push, deploy, Search Console ni otra
mutación externa.

---

## Siguiente paso concreto

William publica los commits cuando lo decida. Después se verifica en el dominio
oficial que Headshots responde 200/index, aparece una vez en sitemap y
`llms.txt`, y registra una visita controlada en Realtime de GA4 y Clarity. Con
ese deploy confirmado se envía
`https://www.itsakeeperphotography.com/sitemap.xml` a Search Console.

## Resultado funcional

- `/headshot-photographer-tri-cities-wa/` está `ready/index`, fechado
  `2026-08-17`, sin header release noindex y dentro de sitemap/`llms.txt`.
- Conserva el paquete confirmado de `$175 + tax`, 20–30 minutos, una descarga
  digital high-resolution con commercial usage y galería online. Equipos siguen
  en cotización personalizada, sin tarifa inventada.
- `Base.astro` usa un único `LocalBusiness` canónico `#business`, enlaza el
  perfil Google Business verificado por `sameAs` y no inventa un Knowledge
  Graph MID. No expone calle, código postal ni coordenadas privadas.
- Home ahora emite su `WebPage`; las 13 URLs indexables tienen tipo principal,
  `WebSite`, `LocalBusiness`, breadcrumbs y referencias Service/Article
  coherentes con el contenido visible. No se añadieron Review/AggregateRating.
- `llms.txt` sigue la estructura v2, agrupa las 13 fuentes citables y excluye
  drafts y utilidades noindex.
- GA4 `G-0YW8M601L1` y Clarity `xyqkkqom4v` cargan una sola vez en release;
  staging y desarrollo no envían telemetría.

## SEO e indexación

- Release contiene 20 rutas públicas y sitemap/`llms.txt` con 13 URLs
  `ready/index`.
- Candidatas pendientes: Seniors, Branding, Investment, Senior Timing y Newborn
  Comparison. Privacy requiere aprobación legal y no es una landing de ranking;
  Thank-you es `ready/noindex` permanente.
- Seniors espera outfits por paquete y regla del outfit adicional; Branding,
  duración/cantidad/entregables; Investment, alcance y duración por oferta;
  Senior Timing, oferta Q54 y fecha editorial; Newborn Comparison, aprobación,
  formato exacto y fecha.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  renderers.
- `npm run optimize:images` — PASS: 47 variantes responsive.
- Tina/Astro release con puertos alternos — PASS: 20 rutas.
- Headers release + `SITE_MODE=release npm run validate:site` — PASS 20/20.
- Tina/Astro staging + validator — PASS 20/20, sitemap vacío, noindex global y
  cero GA4/Clarity.
- Playwright CLI sobre Headshots release local — PASS: un único request
  interceptado `page_view` a GA4 con `tid=G-0YW8M601L1`, un loader, Clarity
  inicializada, canonical/robots correctos y schemas LocalBusiness, WebSite,
  WebPage, Service, FAQPage y BreadcrumbList; consola 0/0.
- `node --check scripts/validate-site.mjs`, manifests espejo y
  `git diff --check` — PASS.

## Bloqueadores y pendientes operativos

- `SITE_MODE=release npm run build:local` se detiene antes de Astro por siete
  JPEG preexistentes que incumplen el gate fuente de 2400 px/700 KiB:
  `010A0319copy-2.jpg`, `1.jpg`, `11.jpg`, `14.jpg`, `5.jpg`, `6.jpg` y `7.jpg`.
  No se recomprimieron porque son assets ajenos a este alcance. El build
  Tina/Astro directo y ambos validadores sí pasan.
- Realtime de GA4/Clarity, canonicals/headers del deploy y Search Console solo
  pueden verificarse después de publicar.
- Smoke autenticado TinaCloud y recaptura final del 404 siguen como tareas
  operativas independientes.

## Operación Git

- Commit funcional: `c9befdc`.
- Este archivo, arquitectura, ADR-065, backlog, STRUCTURE, DESIGN y bitácora
  forman el commit documental de cierre.
- No se ejecuta `./scripts/handoff.sh` porque hace push y el usuario autorizó
  commits locales, no pushes.
- No se prepararon transcripts `.handoff/sessions/*.jsonl` para commit.
