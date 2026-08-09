# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-09 16:12 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit base de esta intervención:** `1369dfb` —
`docs(context): reconcile published handoff`

**Commit funcional verificado:** `c5ec44c` —
`feat(kennewick): redesign city service page`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cierre:** antes del commit documental, `main` está dos commits
por delante de `origin/main`: la reconciliación `1369dfb` y la implementación
`c5ec44c`. El commit que contiene este documento añade un tercer commit local.
No se ejecutó push, deploy ni cambio externo.

---

## Siguiente paso concreto

El usuario debe publicar los tres commits locales y, cuando Netlify termine,
verificar Richland y Kennewick en producción: status 200, robots index,
canonical, ausencia de `X-Robots-Tag: noindex`, sitemap/llms y lastmod
(`2026-08-08` para Richland; `2026-08-09` para Kennewick). Después observar el
build y el bandwidth por asset durante 48 horas. No cambiar apex/`www`, DNS ni
redirects sin una decisión explícita.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Richland, Kennewick, Family Photo
  Locations y Portfolio. Thank-you es `ready/noindex`; las otras 14 rutas
  siguen `draft/noindex`.
- Kennewick ya implementa ADR-036/038: hero compartido con Seniors, siete
  composiciones image-first canónicas y cuerpo editorial completo.
- Copy, title, description, H1, seis H2, nueve anchors, FAQ/schema 4:4 y un solo
  `Service` schema permanecen intactos.
- Se añadieron seis JPEG Drive optimizados, sin borrar ni reemplazar fotografías
  usadas. Dos frames de la sesión identificada como Benton City quedaron fuera.
- La galería “Recent Kennewick Sessions” sigue vacía y no genera ningún nodo ni
  espacio: el lote demuestra solo cinco sesiones seguras y no cubre todos los
  servicios.
- `lastModified` de Kennewick es `2026-08-09`; release conserva seis URLs en
  sitemap y cinco en `llms.txt`. Staging mantiene noindex global y sitemap vacío.
- Astro, headers y el validador pasaron en staging y release; Playwright aprobó
  1440, 1200, 900 y 390 px; Impeccable devolvió `[]`.
- La optimización previa de bandwidth continúa vigente: fuentes JPEG limitadas
  a 2400 px/700 KiB y variantes WebP generadas con cuatro workers.

## Kennewick implementado

### Visual y estructura

- `KennewickPage.astro` reutiliza `EditorialHero.astro` con:
  - H1 `Kennewick, WA Photographer` en dos líneas visuales y texto DOM exacto;
  - fotografía full-bleed verificada;
  - dos prints decorativos;
  - cero frase script y cero placeholder para ella;
  - un botón nativo `Plan Your Session` que desplaza y enfoca
    `#kennewick-final`; el hero contiene cero anchors.
- `EditorialHero.astro` acepta ahora `scriptLine` opcional y no emite el nodo si
  falta. Las líneas del heading conservan whitespace explícito.
- El cuerpo sigue esta secuencia:
  1. Lisa en arco + hairline + “Ten Minutes From My Front Door”.
  2. Contraste “Light and Airy” con un único collage restringido.
  3. “What Works Well” text-led, sin usar portfolio como falsa prueba local.
  4. Directorio ledger con cinco links completos y una fotografía.
  5. FAQ Walnut con `<details>/<summary>` y H3 reales.
  6. CTA final fotográfico full-bleed con un solo link a Contact.
- Desktop usa 12 columnas; 900 px usa composiciones de dos columnas; 390 px
  sigue orden de lectura en una columna y disuelve los overlaps absolutos.
- No se copiaron logo, marca, paleta, textos, tape, splatters ni decoración de
  la referencia. Tampoco se usaron imágenes generadas en producción.

### Fotografía y atribución

- Drive suministró `Couples - Kennewick` y `Senior Session - Kennewick`.
- Los 22 archivos representan seis sesiones por XMP. Después de excluir la
  sesión Benton City quedan 20 fotos de cinco sesiones candidatas.
- `010A4575copy.jpg` y `sennior-session-benton-city.jpg` muestran la misma
  sesión y no se publican. `010A1338-copy.jpg` y `010A0428-copy.jpg` ya existían
  en producción con otros nombres y no se duplicaron.
- Se publicaron seis fuentes nuevas de cuatro sesiones seguras:
  - `kennewick-couple-golden-hour-embrace.jpg`
  - `kennewick-couple-open-field-golden-hour.jpg`
  - `kennewick-couple-walking-golden-hour.jpg`
  - `kennewick-senior-cowboy-golden-hour.jpg`
  - `kennewick-senior-riverside-portrait.jpg`
  - `kennewick-senior-wood-wall-portrait.jpg`
- Cada fuente mide 1600–2400 px y 226–591 KiB. El pipeline genera WebP
  400/640/960/1440; esas variantes están ignoradas y se regeneran en build.
- Los originales/masters de auditoría y el contact sheet están ignorados en
  `artifacts/audits/kennewick-drive-2026-08-09/`.

### Contenido, navegación y SEO

- Fuente editorial: `paginas/12-kennewick.md`; runtime:
  `content/pages/kennewick.json`.
- H2 exactos y en orden: Ten Minutes, Light and Airy, What Works, What I
  Photograph, Kennewick Questions y Let's Plan Yours.
- `<main>` contiene exactamente nueve anchors: tres contextuales, cinco de
  servicio y Contact final. La galería vacía está ausente.
- Las cuatro FAQ visibles alimentan el mismo arreglo que FAQPage.
- Release emite LocalBusiness, WebSite, WebPage, Service, BreadcrumbList y
  FAQPage. No aparecen `streetAddress`, Review, AggregateRating ni coordenadas
  Kennewick.
- Canonical release:
  `https://www.itsakeeperphotography.com/kennewick-wa-photographer/`.
- Meta robots release: `index, follow, max-image-preview:large`; no existe
  header noindex específico para la ruta.

## Verificación ejecutada

```bash
npm run optimize:source-images
npm run optimize:images
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npx astro build
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run install:netlify-headers
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app npm run validate:site
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npx astro build
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run install:netlify-headers
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
node /Users/williammelo/.agents/skills/impeccable/scripts/detect.mjs --json src/components/pages/EditorialHero.astro src/components/pages/KennewickPage.astro src/styles/kennewick-page.css content/pages/kennewick.json .impeccable/surfaces/route-kennewick-wa-photographer.md .impeccable/mocks/kennewick-approved-manifest.json
git diff --check
```

- Fuentes: todos los JPEG están ≤2400 px y ≤700 KiB.
- Variantes: up to date; 24 salidas responsive nuevas para las seis fuentes.
- Staging: `Validated 21 public routes in staging mode.`
- Release: `Validated 21 public routes in release mode.`
- Impeccable: `[]`.
- El `npm run build:local` integral se intentó, pero el dev server existente ya
  ocupaba Tina `:9000`. No se cerró ese proceso; se ejecutaron Astro, headers y
  validación directamente en ambos modos.

### Playwright

- Viewports: 1440×1000, 1200×1000, 900×1000 y 390×844.
- En los cuatro: `scrollWidth === clientWidth`, H1 exacta en dos líneas, seis
  H2 contenidos, nueve anchors, cuatro FAQ, galería ausente y cero imágenes
  fallidas.
- A 390 px todos los H1/H2 quedan entre x=16/20 y x=370/374; el antiguo recorte
  de “Photographer” y del heading del directorio está resuelto.
- El botón hero enfoca `#kennewick-final`; scroll padding y margin de 118 px
  preservan el header.
- El segundo FAQ abre con Enter y mantiene foco. Los cinco hrefs del directorio
  coinciden con las rutas canónicas.
- Reduced motion devuelve `transform: none` y transición `0.01ms`.
- Contraste de pares tonales: Earth 6.86:1, Olive 4.61:1, Walnut 9.44:1 y Sand
  7.10:1. Hero/final usan wash uniforme, sin gradientes.
- La única entrada de consola fue un HTTP 400 externo de Microsoft Clarity bajo
  red restringida; no hubo error local de plantilla, script ni asset.
- Evidencia ignorada:
  `artifacts/audits/kennewick-redesign-2026-08-09/`.

## Archivos principales

- UI: `src/components/pages/KennewickPage.astro`,
  `src/components/pages/EditorialHero.astro`,
  `src/styles/kennewick-page.css`.
- Contenido/publicación: `content/pages/kennewick.json`,
  `paginas/12-kennewick.md`, `page-manifest.ts`,
  `src/lib/page-manifest.ts`.
- Media: seis JPEG `public/uploads/kennewick-*.jpg`.
- Diseño: `.impeccable/surfaces/route-kennewick-wa-photographer.md`,
  `.impeccable/mocks/kennewick-approved-manifest.json` y siete PNG canónicos.
- Memoria: ADR-038, esta foto de estado, bitácora, backlog y arquitectura.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado | Qué falta |
|---|---|---|
| Producción | Commit local verificado | Push del usuario y comprobar deploy/crawler gates/lastmod. |
| Bandwidth/build | Optimizado localmente | Verificar Content-Length/build Netlify y observar 48 h por asset. |
| Galería Kennewick | Mejora opcional | Llegar a 6–10 sesiones distintas y cubrir más que Seniors/Couples. |
| Galería Richland | Mejora opcional | Añadir sesiones verificadas cuando el usuario las suministre. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA final. |
| Newborn / comparación | Draft | Formato, safety/handling, validación y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Pasco | Draft | Copy local especializado, hechos/media y QA. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales en Dashboard. |
| Analítica | Snippets instalados | Verificar recepción y política de staging/consentimiento. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar redirects/DNS. |
| `README.md` | Obsoleto | Actualizar en una tarea separada. |

`src/content/pending.ts` contiene 32 entradas; ninguna corresponde a Richland,
Kennewick ni Family Photo Locations.

## Operación local

- El servidor Tina/Astro preexistente continúa en `localhost:4321` y `:9000`.
- El servidor Astro temporal `:4322` y la sesión Playwright se cerraron.
- No ejecutar `./scripts/handoff.sh` mientras siga vigente la prohibición de
  push, porque el script publica de forma incondicional.

## Bloqueadores externos

1. **Publicación:** los commits locales todavía no están en GitHub/Netlify.
2. **Producción:** falta comprobar el deploy resultante, los headers crawler y
   el nuevo `lastmod 2026-08-09` de Kennewick.
3. **Dominio canónico:** producción redirige `www` al apex, mientras el repo
   genera canonical `www`; requiere decisión separada.
4. **Netlify/analítica/legal:** quedan las verificaciones externas del backlog.

## Preguntas abiertas

- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
