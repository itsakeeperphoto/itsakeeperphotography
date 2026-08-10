# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-09 22:24 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit base de esta intervención:** `76a7928` —
`docs(context): record Kennewick redesign`

**Commit funcional verificado:** `2a5adcd` —
`feat(pasco): publish editorial city service page`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git antes del commit documental:** `main` está cuatro commits por
delante de `origin/main`: `1369dfb`, `c5ec44c`, `76a7928` y
`2a5adcd`. Este cierre añade un quinto commit local. No se ejecutó push,
deploy, DNS ni cambio externo porque sigue vigente la política documentada de
que el usuario publica los commits.

---

## Siguiente paso concreto

El usuario debe publicar los cinco commits locales. Cuando Netlify termine,
verificar en producción Richland, Kennewick y Pasco: status 200, meta robots
index, canonical exacta, ausencia de `X-Robots-Tag: noindex`, sitemap,
`llms.txt` y `lastmod`. Pasco debe aparecer como:

`https://www.itsakeeperphotography.com/pasco-wa-photographer/`

con `lastmod 2026-08-09`. Después observar build y bandwidth por asset durante
48 horas. No cambiar apex/`www`, DNS ni redirects sin decisión explícita.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Richland, Kennewick, Pasco, Family
  Photo Locations y Portfolio. Thank-you es `ready/noindex`; las otras 13
  rutas siguen `draft/noindex`.
- Pasco implementa ADR-039 con la dirección visual A+C aprobada: Open Horizon
  para hero/intro y Long Horizon Archive para servicios/galería.
- La página usa el `EditorialHero` compartido con Seniors/Newborn/Family,
  H1 exacta, cero script inventado, dos prints y botón de scroll al cierre.
- Se añadieron diez JPEG Pasco optimizados de diez sesiones distintas:
  tres family/large-family y siete senior. No se borró ni reemplazó ninguna
  fotografía existente.
- La galería muestra exactamente las diez sesiones verificadas con alt literal;
  no publica meeting points ni infiere landmarks desde las imágenes.
- El runtime conserva ocho H2, ocho anchors, cinco links de servicio y FAQ
  visible/schema 4:4.
- Release emite un `Service` Pasco, `WebPage.spatialCoverage` Pasco y
  breadcrumb Home → Pasco Photographer, sin dirección Pasco, coordenadas,
  Review ni AggregateRating.
- Pasco está `ready/index`, en sitemap y `llms.txt`, con
  `lastModified: 2026-08-09`.
- El CSS Pasco se genera como asset Vite route-scoped de ~20 KiB y solo se
  enlaza en Pasco. About, Family y las demás rutas ya no reciben ese CSS inline.
- Builds staging y release, headers, validador, Impeccable y QA Playwright
  final pasan.

## Pasco implementado

### Diseño y estructura

- Fuente visual aprobada:
  - A controla hero full-bleed, paper edge y arco introductorio.
  - C controla archivo fotográfico, ledger de servicios y ritmo de cierre.
- Secuencia:
  1. `EditorialHero` con familia Pasco, dos prints y botón local.
  2. “The Most Underrated Light” con arco y hairline.
  3. “Where Two Rivers Meet” sobre Olive/Walnut, sin mapa.
  4. “Farmland, Rows and Long Horizons” con panorama real.
  5. Directorio oscuro de cinco servicios enlazados.
  6. Galería editorial de diez sesiones.
  7. Planificación por temporadas.
  8. FAQ ledger de cuatro preguntas.
  9. Cierre full-bleed con panel marfil.
- No se copiaron marca, colores, texto, tape, splatters ni firma de la
  referencia. Las imágenes generadas existen solo como previsualización en
  `.impeccable/mocks/` y no se publican en el DOM.

### Fotografía y atribución

- Drive autorizado: `It’s A keeper Photography Assets`, carpetas con Pasco en
  el nombre.
- Los 23 originales representan once sesiones visuales/XMP.
- La selección final toma diez fotografías de diez sesiones:
  - `pasco-family-mother-children-golden-hour.jpg`
  - `pasco-family-group-golden-field.jpg`
  - `pasco-extended-family-walking-golden-field.jpg`
  - `pasco-senior-airplane-portrait.jpg`
  - `pasco-senior-black-dress-foliage.jpg`
  - `pasco-senior-seated-golden-field.jpg`
  - `pasco-senior-pine-portrait.jpg`
  - `pasco-senior-wildflower-portrait.jpg`
  - `pasco-senior-floral-dress-field.jpg`
  - `pasco-senior-white-dress-seated-portrait.jpg`
- `010A6962copy.jpg` se excluyó por colisión visual con una fotografía ya
  publicada; se eligió otra sesión/toma sin colisión.
- Fuentes: ~5.2 MiB, todas ≤2400 px y ≤700 KiB.
- Variantes: 40 WebP 400/640/960/1440, ~4.1 MiB, regenerables en build.
- Originales de Drive y evidencia Playwright permanecen ignorados bajo
  `.artifacts/`.

### Contenido, navegación y SEO

- Fuente editorial: `paginas/13-pasco.md`.
- Runtime: `content/pages/pasco.json`.
- H1: `Pasco, WA Photographer`.
- Ocho H2 exactos: Underrated Light, Two Rivers, Farmland, What I Photograph,
  Recent Sessions, Seasons, Pasco Questions y Let's Find Your Light.
- Ocho anchors exactos dentro de `<main>`: About, Locations Guide, Senior,
  Family, Newborn, Branding, Headshots y Contact final.
- El hero usa un botón; no añade un noveno anchor.
- Primera FAQ corregida a “Yes. Richland, Kennewick and Pasco…” para responder
  coherentemente “Do you travel to Pasco?”.
- Canonical release:
  `https://www.itsakeeperphotography.com/pasco-wa-photographer/`.
- Sitemap release contiene siete URLs; `llms.txt` contiene seis.
- Staging mantiene noindex global, sitemap vacío y sin declaración sitemap en
  robots.

## Rendimiento y aislamiento CSS

- Importar `pasco-page.css` desde el componente dentro del router compartido
  hacía que Astro lo inyectara en todos los HTML editoriales.
- La solución final importa el CSS con `?url` desde `[slug].astro` y pasa un
  `pageStylesheet` opcional a `Base.astro`; solo Pasco emite el
  `<link rel="stylesheet">`.
- Resultado:
  - asset generado: ~20,056 bytes sin comprimir;
  - About y Family reducen ~19,957 bytes de HTML cada una;
  - `rg` encuentra `pasco-page.*.css` solo en el HTML Pasco;
  - el validador falla si el stylesheet falta, está roto o se filtra a otra
    ruta.
- `.gitignore` excluye nuevos originales/QA en `.artifacts/`; los artefactos
  históricos ya rastreados no se eliminaron en esta intervención.

## Verificación ejecutada

```bash
npm run build:scripts
npm run optimize:source-images
npm run optimize:images
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  ./node_modules/.bin/tinacms build --local --skip-cloud-checks \
  --skip-indexing --port 4002 --datalayer-port 9001 \
  -c "./node_modules/.bin/astro build"
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app \
  ./node_modules/.bin/astro build
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app \
  npm run install:netlify-headers
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app \
  npm run validate:site
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  ./node_modules/.bin/astro build
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  npm run install:netlify-headers
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  npm run validate:site
node /Users/williammelo/.agents/skills/impeccable/scripts/detect.mjs \
  --json src/components/pages/PascoPage.astro src/styles/pasco-page.css
node --check scripts/validate-site.mjs
node --check scripts/playwright-evidence.js
node --check scripts/playwright-heroes.js
git diff --check
```

- Tina completo pasó usando puertos alternos 4002/9001 para no interferir con
  el proceso preexistente en 9000.
- Staging: `Validated 21 public routes in staging mode.`
- Release: `Validated 21 public routes in release mode.`
- Impeccable: `[]`.
- Fuentes y variantes: dentro del contrato y up to date.
- `git diff --check`: limpio.

### Playwright

- Viewports: 1440×1000, 1200×1000, 900×1000 y 390×844.
- En los cuatro: overflow 0, H1 exacta, ocho H2, ocho anchors, diez figuras de
  galería, cuatro FAQ, cero imágenes rotas y consola local limpia.
- A 390 px, el texto de lectura mínimo es 16 px; “Photographer”, headings,
  servicios y preguntas no se recortan.
- El CTA del hero enfoca `#pasco-final`; con reduced motion el destino queda a
  ~184 px del viewport y no hay animaciones activas.
- El foco del cierre usa outline marfil interior de 3 px y conserva contraste
  sobre la fotografía oscurecida.
- Targets interactivos cumplen ≥44 px; FAQ abre/cierra por teclado y mantiene
  foco.
- Capturas/evidencia local: `.artifacts/pasco-final/` (ignorada).

## Archivos principales

- UI: `src/components/pages/PascoPage.astro`,
  `src/components/pages/EditorialHero.astro`,
  `src/styles/pasco-page.css`.
- CSS route-scoped: `src/pages/[slug].astro`, `src/layouts/Base.astro`.
- Contenido/publicación: `content/pages/pasco.json`,
  `paginas/13-pasco.md`, ambos manifiestos y headers release.
- Schema: `src/pages/[slug].astro`.
- Media: diez `public/uploads/pasco-*.jpg`.
- Diseño: `.impeccable/surfaces/route-pasco-wa-photographer.md`,
  `.impeccable/mocks/pasco-approved-manifest.json`, tres comps y nueve
  referencias de sección.
- QA: `scripts/validate-site.mjs`, `scripts/playwright-evidence.js`,
  `scripts/playwright-heroes.js`.
- Memoria: ADR-039, este estado, arquitectura, backlog y bitácora.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado | Qué falta |
|---|---|---|
| Producción | Cinco commits locales | Push del usuario y QA del deploy. |
| Pasco | Ready/index local | Verificar headers, sitemap, llms y canonical en producción. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h. |
| `.artifacts/` histórico | ~196 MiB/200 archivos rastreados | Auditar en tarea separada antes de retirar evidencia histórica. |
| Galería Kennewick | Mejora opcional | Llegar a 6–10 sesiones distintas y ampliar servicios. |
| Galería Richland | Mejora opcional | Añadir sesiones verificadas cuando existan. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Newborn / comparación | Draft | Formato, safety/handling, validación y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

`src/content/pending.ts` contiene 29 entradas; ninguna corresponde a
Richland, Kennewick, Pasco ni Family Photo Locations.

## Operación local

- Los servidores temporales de preview y las sesiones Playwright se cerraron.
- No se detuvo el proceso Tina preexistente en `:9000`.
- `.artifacts/` ocupa ~628 MiB localmente; ~196 MiB corresponden a 200 archivos
  rastreados y el resto incluye originales/evidencia ignorados.
- No ejecutar `./scripts/handoff.sh` mientras siga vigente la política del
  usuario de publicar personalmente, porque el script hace push.

## Bloqueadores externos

1. Publicar los cinco commits locales en el remoto oficial.
2. Esperar el deploy Netlify y comprobar crawler gates/lastmod de las tres
   ciudades.
3. Resolver la divergencia apex/`www` antes de tocar canonical/DNS/redirects.
4. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
