# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-12 11:32 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `075df78` —
`feat(reviews): publish client stories page`

**Base remota al iniciar:** `0e13801` —
`docs(journal): record hub publication and Lisa checklist`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar implementación:** `main` está un commit por delante de
`origin/main`; el worktree quedó limpio antes de preparar este cierre
documental. Este estado y la bitácora se commitean aparte. No se hizo push,
deploy, DNS ni mutación externa.

---

## Siguiente paso concreto

El usuario puede revisar y subir los commits locales. Después del deploy
release, ejecutar un smoke test de `/reviews/`, `/portfolio/` y Homepage en el
dominio final: status 200, canonical/index, ausencia de header noindex,
membresía única en sitemap/`llms.txt`, diez testimonios, flip del libro y CTA a
Contact. Si Lisa aporta la URL pública oficial de Google Reviews, evaluar un
enlace externo explícito; no bloquea la publicación actual.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify sigue construyendo y validando 21 rutas públicas.
- `/reviews/` quedó especializado, `ready/index` y fechado `2026-08-12`.
- Release contiene 13 URLs en sitemap y 12 entradas en `llms.txt`; Portfolio es
  la única ruta indexable excluida de `llms.txt`. Staging conserva sitemap vacío
  y noindex global.
- Reviews usa el mismo `EditorialHero` de Seniors, Family y Newborn, reutiliza
  exactamente `What Tri-Cities Clients Remember` de Homepage, integra el libro
  canónico de Portfolio y termina con un único CTA a `/contact/`.
- El inventario visible contiene diez testimonios reales y atribuidos. No se
  inventó una categoría Newborn, URL de Google, rating, fecha o procedencia.
- Schema queda en `WebPage` + `BreadcrumbList`; `Review` y `AggregateRating` se
  omiten hasta contar con campos individuales verificables.
- QA responsive, funcional, de indexación y de acabado está aprobada. La
  revisión técnica paralela no encontró hallazgos P1/P2 y la revisión final
  Impeccable devolvió `disposition: ship`, `ceiling: reached` y cero fixes
  materiales.

## Reviews publicado en `075df78`

### Dirección y composición

- Comp C `.impeccable/mocks/reviews-c-at-ease-purpose.png`, `Words Become
  Pictures / At Ease, on Purpose`, seed `c2ad8044`, es la dirección canónica.
- Las comps A/B quedan versionadas como alternativas auditadas no seleccionadas.
- Secuencia: hero compartido → `At Ease, on Purpose` → diez pruebas KindWords →
  libro de seis páginas → `Leave the Nerves at Home`.
- Las fotografías provienen de `public/uploads/`; no se copiaron marca, paleta,
  textos o sujetos de la referencia. Seam, papel, mats, arco, wire, reglas y
  libro son HTML/CSS/SVG.
- Contrato visible: 1 H1, 4 H2, 6 H3, diez testimonios originales, seis páginas
  del libro y un anchor dentro de `<main>`.

### Render y contenido

- `src/components/pages/ReviewsPage.astro` y
  `src/styles/reviews-page.css` forman el renderer/CSS aislado de ruta.
- `src/pages/[slug].astro` y `EditorialPageRouter.astro` resuelven Reviews en
  SSR y refresh Tina sin caer a `ContentPage`.
- `getStaticReviewsPage()`, la query Tina y la isla pasan el mismo inventario de
  testimonials/journal. Ambos manifiestos de página permanecen byte-identical.
- `KindWords.astro` conserva Homepage enlazado hacia Reviews, pero en Reviews
  presenta el resumen social como texto estático para evitar autorreferencia o
  un destino Google no confirmado.
- `JournalBook.astro` se extrajo de `JournalPortfolio.astro`: cada instancia
  tiene IDs/ARIA/memoria propios. Reviews carga las seis páginas lazy; Portfolio
  conserva su primera página eager/high. Reduced motion usa crossfade.

### Publicación y SEO

- `contentStatus: ready`, `searchVisibility: index`, `sitemap: true`,
  `llms: true`, `lastModified: 2026-08-12`.
- Canonical release:
  `https://www.itsakeeperphotography.com/reviews/`.
- Se retiró la regla release `X-Robots-Tag: noindex` de Reviews.
- Release queda en sitemap 13 y `llms.txt` 12; staging mantiene su aislamiento.
- Único enlace de body: `Start planning your session` → `/contact/`.
- `WebPage` y `BreadcrumbList` Home → Client Reviews; sin schema de reseñas,
  rating, dirección o geodatos fabricados.

## QA ejecutada

### Build y validación

- `SITE_MODE=release ./node_modules/.bin/astro build` — PASS.
- `SITE_MODE=release npm run install:netlify-headers` — PASS.
- `SITE_MODE=release npm run validate:site` — PASS, 21/21 rutas.
- `SITE_MODE=staging ./node_modules/.bin/astro build` — PASS.
- `SITE_MODE=staging npm run install:netlify-headers` — PASS.
- `SITE_MODE=staging npm run validate:site` — PASS, 21/21 rutas.
- Se restauró un build release y se repitió su validador — PASS.
- `git diff --check`, JSON, sintaxis del validador y equivalencia de
  manifiestos — PASS.

El wrapper integral `npm run build:local` no pudo apropiarse del datalayer Tina
`:9000`, ocupado por un proceso preexistente del usuario; no se detuvo. La query
Tina se regeneró en puertos aislados y los builds Astro/validadores definitivos
pasaron en ambos modos.

### Playwright CLI

`scripts/playwright-reviews.js` aprobó:

- 1440×1000, 1200×900, 900×900 y 390×844;
- alturas exactas del hero compartido: 882/782/688/656 px;
- title, description, robots, canonical, headings y comentario de dirección;
- diez testimonios, teclado/Escape, resumen sin self-link;
- seis páginas lazy, Next funcional, page-flip y regresión de Portfolio;
- reduced motion con crossfade e instrucciones específicas;
- tipografía sin clipping, body ≥17.28 px, targets ≥44 px;
- cero overflow, imágenes rotas, errores runtime o fallos de red locales;
- sitemap 13, `llms.txt` 12 y presencia única de Reviews.

Las capturas finales permanecen ignoradas en
`.artifacts/reviews-2026-08-12/final/`.

### Impeccable y revisión técnica

- Detector sobre los archivos propios de Reviews/JournalBook: `[]`.
- El HTML compilado señaló solo `transition: width` en
  `src/styles/journal-page.css`, regla histórica ajena a Reviews.
- Asset Producer: ningún raster nuevo requerido; toda región image-native usa
  fuentes independientes y suficientes. El print pequeño de At Ease se fijó en
  monocromo por CSS.
- Finish Reviewer independiente: `ship`, persistencia `pass`, fidelidad
  `match/acceptable adaptation`, ceiling `reached`, `material_fixes: none`.
- Revisión de código independiente de datos/routing y JournalBook/a11y:
  `no P1/P2 findings`.

## Pendientes no bloqueantes

- Confirmar la URL pública oficial de Google Reviews si se desea enlazar el
  resumen social.
- Probar el endpoint GBP y su actualización diaria en el deploy cuando existan
  credenciales/Blobs operativos; el fallback editorial sigue siendo válido.
- Ejecutar el smoke test post-deploy y verificar Search Console solo después del
  push/deploy administrado por el usuario.
- Privacy y las rutas comerciales todavía draft conservan sus gates propios.

## Operación Git y handoff

- Commit funcional local: `075df78`.
- Este cierre documental actualiza `20-estado.md` y agrega una entrada a
  `40-bitacora.md`; ADR-058, arquitectura, backlog, DESIGN y STRUCTURE ya están
  en el commit funcional.
- No se ejecutó `./scripts/handoff.sh`: el script termina con `git push` y la
  política operativa vigente reserva el push al usuario. Los transcripts
  `.handoff/sessions/*.jsonl` siguen locales e ignorados.
