# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-12 12:19 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `8e79a40` —
`fix(reviews): refine proof actions and page turn`

**Base remota al iniciar:** `0e13801` —
`docs(journal): record hub publication and Lisa checklist`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** tras este commit documental, `main` queda cuatro
commits por delante de `origin/main` y el worktree queda limpio. No se hizo
push, deploy, DNS ni otra mutación externa.

---

## Siguiente paso concreto

El usuario puede revisar y subir los cuatro commits locales. Después del deploy
release, ejecutar un smoke test de `/reviews/`, `/portfolio/` y Homepage en el
dominio final: status 200, canonical/index, ausencia de header noindex,
membresía única en sitemap/`llms.txt`, las diez fotografías de KindWords, CTA
Google, giro 3D del libro y CTA Contact.

## Resumen ejecutivo

- `/reviews/` continúa `ready/index`, fechado `2026-08-12`, dentro de sitemap
  13 y `llms.txt` 12.
- El usuario confirmó el destino directo
  `https://g.page/r/CZnCWAWyBWnQEBM/review`. Está en
  `content/settings/index.json`; Reviews presenta `Leave us a review` como
  anchor externo seguro y mantiene el resumen social como texto estático.
- El resumen cambió a marfil sobre oliva y alcanza 4.61:1. El CTA usa relleno de
  papel y desplazamiento de flecha; reduced motion elimina las transiciones.
- `At Ease` ya no contiene las reglas cruzadas. La firma de Reviews es `arch` y
  el arco con print B/N superpuesto permanece.
- Se retiró el `min-height` artificial de KindWords y se redujo el padding del
  Journal. El gap CTA→Journal mide 184/172.8/148/144/144 px en
  1920/1440/1200/900/390.
- `JournalBook` compartido usa hojas `hard`, giro desde la esquina inferior de
  1200 ms y sombra máxima `0.50`. En movimiento normal PageFlip produce caras
  `matrix3d`; reduced motion conserva crossfade.
- La revisión independiente encontró un P2 de imágenes lazy vacías en dos
  clones visibles. Se resolvió primando originales y clones, con prioridad baja,
  solo cuando KindWords entra en viewport. El revisor confirmó el fix y no dejó
  hallazgos adicionales.

## Contrato visible y técnico

- 1 H1, 4 H2, 6 H3, diez testimonios originales y seis páginas del libro.
- Dos anchors dentro de `<main>`, en orden: Google externo y Contact interno.
  Hero y libro continúan usando botones; el resumen no se enlaza a sí mismo.
- Reviews conserva sus imágenes de Journal lazy en SSR; Portfolio conserva la
  primera página eager/high. La activación runtime del archive no ocurre hasta
  que esa sección se aproxima al viewport.
- Schema permanece en `WebPage` + `BreadcrumbList`; no se añadió
  `Review`/`AggregateRating` porque la URL global no aporta rating, fecha y
  procedencia individual por testimonio.
- `src/pages/[slug].astro`, el contrato de dirección, contenido y ambos
  manifiestos describen arco + print superpuesto; los manifiestos son idénticos.

## QA ejecutada

### Build y validadores

- Build Astro staging — PASS.
- Headers + `scripts/validate-site.mjs` staging — PASS, 21/21 rutas.
- Build Astro release restaurado — PASS.
- Headers + `scripts/validate-site.mjs` release — PASS, 21/21 rutas.
- `node --check public/scripts/site.js` — PASS.
- `node --check scripts/playwright-reviews.js` — PASS.
- `git diff --check` — PASS.
- `cmp page-manifest.ts src/lib/page-manifest.ts` — PASS.

### Playwright CLI

`scripts/playwright-reviews.js` aprobó en una sesión Chromium limpia:

- 1920×963, 1440×1000, 1200×900, 900×900 y 390×844;
- alturas exactas del hero: 845/882/782/688/656 px;
- CTA Google exacto, `target="_blank"`, `noopener noreferrer`, hover animado y
  target de 70 px;
- contraste 4.61:1, gap máximo 184 px y cero reglas cruzadas;
- diez testimonios fuente y carga real de las 30 imágenes del archive
  —originales y clones— mediante `currentSrc`, `complete` y `naturalWidth > 0`;
- seis páginas `hard`, estado `flipping`, caras `matrix3d`, sombra rígida y
  avance de página en los cinco anchos;
- crossfade e instrucciones específicas bajo reduced motion;
- cero overflow, imágenes rotas, errores runtime o fallos locales de red;
- regresión de Portfolio y Homepage, sitemap 13 y `llms.txt` 12.

Las capturas finales y el giro intermedio permanecen ignorados en
`.artifacts/reviews-2026-08-12/`.

### Impeccable y revisión independiente

- Detector Impeccable batched sobre los archivos visuales: `[]`.
- Revisión final del follow-up: un P2 de lazy/clones detectado, corregido y
  confirmado como resuelto; no quedan P1/P2.
- La implementación usa StPageFlip ya instalado para la física 3D; GSAP no se
  añadió al libro y sigue limitado al reveal/scroll editorial existente.

## Pendientes no bloqueantes

- Ejecutar el smoke test post-deploy después del push administrado por el
  usuario.
- Configurar y verificar las credenciales/Blobs de GBP para actualizar
  dinámicamente conteo y rating; el CTA directo y el fallback editorial no
  dependen de ese flujo.
- Privacy y las rutas comerciales aún draft conservan sus gates propios.

## Operación Git y handoff

- Commit funcional del feedback: `8e79a40`.
- ADR-059, arquitectura, backlog, DESIGN, STRUCTURE, página fuente y surface
  brief quedaron actualizados junto al cambio funcional.
- Este cierre actualiza `20-estado.md` y agrega la entrada correspondiente en
  `40-bitacora.md`.
- No se ejecutó `./scripts/handoff.sh`: termina con `git push` y la política
  operativa vigente reserva el push al usuario. Los transcripts
  `.handoff/sessions/*.jsonl` siguen locales e ignorados.
