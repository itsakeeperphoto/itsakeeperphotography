# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-14 12:09 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `84d07e5` —
`refactor(portfolio): retire standalone route`

**Base remota al iniciar:** `b01dbe0` —
`docs(reviews): record feedback refinements`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cierre:** la implementación está commiteada en `84d07e5`.
Este documento, la entrada final de bitácora y las últimas reconciliaciones de
fuentes documentales forman un segundo commit local de cierre; `main` queda seis
commits por delante de `origin/main` y el worktree queda limpio. Codex no hizo
push, deploy, DNS ni otra mutación externa.

---

## Siguiente paso concreto

Después del próximo deploy, comprobar que `/portfolio` y `/portfolio/`
responden con 301 directo a `/reviews/` y que Reviews termina en 200. Luego se
retoma la solicitud del usuario de auditar en detalle la accesibilidad y
editabilidad de todas las páginas desde TinaCMS, usando Homepage como patrón.

## Resumen ejecutivo

- `/portfolio/` fue retirada como ruta pública. Ya no existen su página Astro,
  componente, query, loaders, isla, wrapper, familia ni entrada de manifiesto.
- El libro aprobado no se borró: `JournalBook`, las seis fuentes en
  `content/journal-pages/`, estilos, controlador, colección Tina y `page-flip`
  permanecen activos dentro de `/reviews/`.
- Journal y Thank-you ahora enlazan `Client Reviews`; el footer conserva una
  sola entrada Reviews y no contiene Portfolio.
- `/portfolio/` y las seis galerías legacy redirigen directamente a
  `/reviews/` con 301 en ambos archivos `_redirects`.
- El sitio construye 20 rutas públicas. Release contiene 12 URLs en sitemap y
  12 entradas en `llms.txt`; Portfolio no aparece en ninguno.
- Journal conserva `ready/index` y cambia a `lastModified: 2026-08-14` por la
  modificación sustancial de navegación.
- ADR-061 supersede ADR-018 y las cláusulas concretas de ADR-057/058/059/060.

## TinaCMS

- La colección `journalPage` se conserva como `Reviews · Photo Journal Pages`;
  su router abre `/reviews/`, no la ruta retirada.
- La generación Tina release termina correctamente y no produce
  `portfolioPage` ni referencias a la isla eliminada.
- El shell estático `/admin/` carga con título `TinaCMS`, raíz presente y estado
  de espera. En el preview local de release no puede autenticarse: la build no
  tiene un app id/credenciales Tina y las llamadas `identity.tinajs.io/v2/apps/null`
  son rechazadas por CORS. Esto no se trató como regresión de Portfolio; la
  auditoría funcional autenticada del CMS es el siguiente trabajo solicitado.

## Contrato técnico verificado

- `page-manifest.ts` y `src/lib/page-manifest.ts` son idénticos y contienen 20
  entradas; los espejos de `page-types.ts` también coinciden.
- No existe `dist/client/portfolio/index.html` ni enlace activo a
  `/portfolio/`; solo quedan la regla de redirect y guardas negativas de QA.
- `scripts/validate-site.mjs` exige 20 HTML, ausencia de Portfolio, los siete
  redirects directos, sitemap/llms sin la ruta retirada y los nuevos contratos
  de Journal/Thank-you.
- `scripts/playwright-evidence.js` cubre ahora 20 rutas × 4 viewports = 80
  capturas. Las suites de Reviews y Thank-you ya no esperan una regresión
  standalone de Portfolio.
- El `validate-site.mjs` de raíz permanece como espejo legado no ejecutado por
  `package.json`: su sintaxis está validada, pero su contrato antiguo de
  redirects hostname no coincide con `public/_redirects`. El validador activo
  y autoritativo es `scripts/validate-site.mjs`.

## QA ejecutada

### Build y validadores

- Tina + Astro staging, usando puertos locales aislados — PASS.
- `SITE_MODE=staging npm run install:netlify-headers` — PASS.
- `SITE_MODE=staging npm run validate:site` — PASS, 20/20 rutas.
- Tina + Astro release con origen canónico — PASS.
- `SITE_MODE=release npm run install:netlify-headers` — PASS.
- `SITE_MODE=release npm run validate:site` — PASS, 20/20 rutas.
- `node --check` sobre ambos validadores y los tres scripts Playwright
  modificados — PASS.
- `cmp` de manifiestos y tipos espejo, JSON y `git diff --check` — PASS.

### Playwright CLI

- Reviews — PASS en 1920×963, 1440×1000, 1200×900, 900×900 y 390×844:
  seis páginas `hard`, giro 3D, crossfade reduced-motion, 10 testimonios,
  imágenes completas, controles ≥44 px, overflow 0 y sin errores runtime.
- Thank-you — PASS en 1440×1000, 1200×900, 900×900 y 390×844: único anchor
  `Read Client Reviews`, seis imágenes, foco/hover/reduced-motion y overflow 0.
- Journal — PASS manual en 1440×1000 y 390×844: anchors exactos Locations,
  Branding vs. Headshots, Reviews y Contact; footer sin Portfolio y overflow 0.
- Homepage conserva su resumen hacia `/reviews/`; crawler outputs comprobados
  en navegador: sitemap 12 y `llms.txt` 12.

## Pendientes no bloqueantes

- Smoke test post-deploy de los dos formatos de URL Portfolio y las seis URLs
  legacy; Netlify interpreta `_redirects`, pero el servidor estático local no.
- Auditoría autenticada y rediseño de la experiencia editorial de TinaCMS en
  `/admin/`, solicitada por el usuario y deliberadamente pospuesta hasta cerrar
  primero esta eliminación.
- Privacy y las rutas comerciales/editoriales draft conservan sus gates
  independientes.

## Operación Git y handoff

- Commit funcional y documental estructural: `84d07e5`.
- Este cierre actualiza estado, bitácora y las últimas fuentes documentales en
  un commit local separado.
- No se ejecutó `./scripts/handoff.sh`: termina con `git push` y el usuario
  pidió explícitamente commits locales sin push.
- Los transcripts `.handoff/sessions/*.jsonl` siguen locales e ignorados.
