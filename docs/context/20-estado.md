# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-14 13:52 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `334281a` —
`feat(cms): simplify Tina visual editing`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Base remota actual:** `f341a15` — `404 page`

**Estado Git:** `main` queda dos commits por delante de `origin/main`: la mejora
Tina en `334281a` y este cierre documental. El worktree conserva sin stage
evidencia Impeccable del rollout 404 concurrente. Codex no hizo push, deploy,
DNS ni mutaciones externas.

---

## Siguiente paso concreto

Cuando vuelva la cuota local, recapturar el 404 corregido en 1440×1000,
1200×900, 900×900 y 390×844 y cerrar su review. En el próximo deploy, hacer un smoke autenticado TinaCloud:
abrir Homepage y una muestra de cada familia, guardar/revertir una edición en
una página draft y confirmar permisos, preview y CSP/headers. Continúa también
pendiente el smoke HTTP Portfolio → Reviews.

## Resumen ejecutivo

- Tina expone cinco colecciones y 38 documentos con nombres editoriales. Las 19
  Website Pages abren en su ruta canónica mediante filename, no mediante el
  campo `route` editable.
- Filenames, acciones destructivas, rutas, gates de publicación, schema, firma,
  IDs, composición y tonos están protegidos. Copy, media, secciones, ítems y CTA
  siguen editables.
- Los 19 contratos de página y `EditorialHero` tienen quick edit sin cambios de
  JSON de contenido, copy, CSS, clases o composición pública.
- `EditorialPageRouter` es el dispatcher único para SSR y refresh. Family Photo
  Locations ya no degrada a `ContentPage` después de una edición.
- Las queries se dividen en Basic (17 rutas), Contact (+Settings) y Site/Reviews
  (+Homepage, Settings, Testimonials y Photo Journal), usando tipos generados.
- Menú/inquiry, hero scroll, calculadora, resumen GBP y JournalBook se
  reinicializan de forma idempotente después de un reemplazo de isla.
- `validate:tina` fija 5 colecciones, 38 documentos, 20 rutas y 19 renderers y
  se ejecuta antes de `dev`, `build:local` y `build`.
- El rollout paralelo 404 permanece como artefacto real noindex fuera de
  manifest/sitemap/llms. Su implementación está completa; falta recaptura
  visual post-fix por la misma cuota externa.

## TinaCMS verificado

- El esquema final recompiló, reindexó y regeneró `tina-lock` sin errores.
- `/admin/` local mostró las cinco colecciones; Website Pages listó las 19
  páginas por título humano y Testimonials quedó identificado por nombre.
- Abrir Family Photo Locations llevó a su URL exacta y conservó
  `.locations-guide-page`; se observaron 29 markers Tina, nueve de sección,
  hero enlazado y cero overflow horizontal.
- Seleccionar la sección “The four kinds of locations…” enfocó su grupo exacto
  en el panel sin exponer ID, kind o tone.
- About, Contact, Family e Investment refrescaron con markers y sin overflow.
  Branding y Headshots revelaron un contrato nullable de GraphQL: listas
  opcionales omitidas llegaban como `null`; la isla ahora las normaliza sin
  clonar `_content_source`, ambos helpers usan `links ?? []` y el gate impide
  regresión.
- Settings/Home abren `/`; Photo Journal y Testimonials abren `/reviews/`.
  La autenticación y el guardado TinaCloud no se pueden certificar localmente
  sin client id, token y rol Editor reales.

## QA ejecutada

### Tina, build y contratos

- `npm run validate:tina` — PASS: 5/38/20/19.
- Rebuild/index del servidor Tina local aislado — PASS después de la
  configuración final.
- Parser `@astrojs/compiler` — PASS en 40 componentes Astro.
- `npm run build:scripts` — PASS.
- `SITE_MODE=release PUBLICATION_MODE=release
  SITE_ORIGIN=https://www.itsakeeperphotography.com npx astro build` — PASS;
  20 rutas editoriales más `404.html`.
- `SITE_MODE=release npm run install:netlify-headers` — PASS.
- `SITE_MODE=release npm run validate:site` — PASS, 20/20 rutas.
- `git diff --check` — PASS.
- `npx tsc --noEmit` conserva solo errores baseline: imports de espejos raíz y
  declaraciones de módulos `.astro` en `src/lib/tina/islands.ts`; no reportó
  errores nuevos de schema, route map, queries o componentes modificados.

### Playwright/editor local

- Se verificaron navegación del admin, inventario, títulos, ruta/renderer de
  Locations Guide, click-to-focus y una muestra de páginas antes de agotarse la
  cuota local.
- La cuota bloqueó repetir la matriz completa después del fix nullable y la
  recaptura 404 post-fix; no se fabricó evidencia. El validador determinista,
  recompilación Tina y build release cubren el cierre local disponible.

## Archivos Tina del rollout ADR-063

- `tina/config.ts`, `tina/tina-lock.json`,
  `tina/content-page-routes.ts` y queries `contentPageBasic/Contact/Site`.
- `src/lib/tina/data.ts`, `src/content/page-types.ts`,
  `src/components/pages/EditorialPageRouter.astro` y
  `src/pages/journal/[slug].astro`.
- Los 19 renderers bajo `src/components/pages/`, `EditorialHero.astro`,
  `JournalBook.astro`, `KindWords.astro` y `SessionPriceCalculator.astro`.
- `public/scripts/site.js`, `package.json`,
  `scripts/validate-tina-editor.mjs`. El marker/observer compartido de
  `EditorialHero` y el digest About de `scripts/validate-site.mjs` quedaron en
  `f341a15` porque el commit 404 concurrente cerró primero esos dos archivos.
- Documentación vigente en `10-arquitectura.md`, ADR-063,
  `40-bitacora.md` y `50-backlog.md`.

## Bloqueadores y pendientes

- Recaptura 404 post-fix y review visual absoluto cuando vuelva la cuota.
- Smoke autenticado de TinaCloud/guardado/permisos/CSP después del deploy.
- Confirmar que secretos Tina existen solo en Netlify/TinaCloud; nunca en git.
- Smoke post-deploy de `/portfolio` y `/portfolio/` hacia `/reviews/`.
- Publicar los commits locales solo cuando el usuario lo decida; Codex mantiene
  la prohibición de push.

## Operación Git y handoff

- No se ejecutó `./scripts/handoff.sh` porque termina con `git push` y el usuario
  autorizó commits locales, no pushes.
- No se prepararon transcripts `.handoff/sessions/*.jsonl` para commit.
- Implementación Tina en `334281a`; los dos hunks compartidos quedaron en
  `f341a15`. Este cierre documental se commitea por separado. La evidencia 404
  que continúa untracked se preserva sin añadirla ni borrarla.
