# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-09 23:53 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit base de esta intervención:** `b215739` —
`docs(context): record Pasco publication`

**Commit funcional verificado:** `9f293d0` —
`feat(cities): add verified local session galleries`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git antes del commit documental:** `main` está seis commits por
delante de `origin/main`; este cierre añade un séptimo commit local. No se hizo
push, deploy, DNS ni otra mutación externa. El usuario conserva la publicación
de los commits.

---

## Siguiente paso concreto

El usuario debe publicar los siete commits locales creados después de
`ff736c6`. Cuando Netlify termine, verificar en producción Richland, Kennewick
y Pasco: status 200, canonical exacta, meta robots index, ausencia de
`X-Robots-Tag: noindex`, membresía de sitemap/`llms.txt` y
`lastmod 2026-08-09`. Después observar el build y el bandwidth por asset durante 48
horas. No cambiar apex/`www`, DNS ni redirects sin una decisión explícita.

---

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Richland, Kennewick, Pasco, Family
  Photo Locations y Portfolio. Thank-you es `ready/noindex`; las otras 13 rutas
  siguen `draft/noindex`.
- Richland incorpora `Recent Richland Sessions` con diez fotografías de diez
  sesiones verificadas por carpeta Drive, fecha XMP, `OriginalDocumentID` e
  identidad visual.
- Kennewick incorpora `Recent Kennewick Sessions` con una fotografía de cada
  una de sus cinco sesiones seguras. No se fabricó una sexta sesión y Benton
  City continúa excluida.
- Ambas galerías conservan siete H2, nueve anchors dentro de `<main>`, CTA del
  hero como botón, FAQ/schema y estado `ready/index`.
- Richland actualiza `lastModified` a `2026-08-09`; Kennewick y Pasco conservan
  esa misma fecha. Las tres aparecen correctamente en el sitemap release.
- Se añadieron 13 JPEG optimizados: 165.81 MiB en origen → 5.92 MiB. Todos
  cumplen máximo 2400 px/700 KiB. Sus 52 WebP 400/640/960/1440 son
  regenerables y están al día.
- No se borró, reemplazó ni renombró ninguna fotografía de producción.
- El build final quedó en modo `release` y `scripts/validate-site.mjs` aprobó
  las 21 rutas.

## Galerías implementadas

### Richland

- Sección: `#recent-richland-sessions`, entre directorio y planificación.
- Contenido: dos couples, newborn, dos family, maternity y cuatro senior; cada
  fotografía representa una sesión distinta.
- Layout: retícula editorial 4 columnas desktop, 2 tablet y 1 móvil; los dos
  últimos ítems quedan centrados en desktop.
- Contrato: exactamente 10 figuras no vacías, fuentes únicas, alt literal,
  caption visible y cero anchors.

### Kennewick

- Sección: `#recent-kennewick-sessions`, entre directorio y FAQ.
- Contenido: una couples y cuatro senior de cinco sesiones distintas.
- Layout: panorama destacado y retícula 3 columnas desktop, 2 tablet y 1 móvil.
- Contrato: exactamente 5 figuras no vacías, fuentes únicas, alt literal,
  caption visible y cero anchors.
- `010A4575copy.jpg` y `sennior-session-benton-city.jpg` siguen excluidos por
  identificar la misma sesión Benton City.

## Procedencia y rendimiento de media

- Drive autorizado: `It’s A keeper Photography Assets`, carpetas Richland y
  Kennewick identificadas en ADR-040.
- Richland: diez fechas XMP, diez `OriginalDocumentID` y diez sujetos/sesiones
  visualmente distintos.
- Kennewick: tres frames alternativos nuevos y dos fuentes ya publicadas de
  sesiones distintas. Ningún archivo nuevo duplica bytes de otro JPEG.
- Nuevos JPEG Richland: 4.49 MiB aproximados; nuevos JPEG Kennewick: 1.37 MiB
  aproximados; total real 5.92 MiB.
- Las variantes WebP están ignoradas por Git y se regeneran con
  `npm run optimize:images`; la segunda ejecución informó `up to date`.

## Contenido, navegación y SEO

- Richland y Kennewick mantienen el copy de service-area page y sus H1
  exactas.
- Cada ruta conserva siete H2 y nueve anchors: tres de prosa, cinco servicios y
  Contact final. La galería no introduce enlaces.
- Los componentes rechazan una galería no vacía con conteo incorrecto, datos
  incompletos, rutas repetidas o links.
- Los validadores comparan allowlists literales de `src`/alt, figuras,
  captions, H2, anchors, hero button y comportamiento responsive.
- Sitemap release verificado:
  - `/richland-wa-photographer/` — `lastmod 2026-08-09`
  - `/kennewick-wa-photographer/` — `lastmod 2026-08-09`
  - `/pasco-wa-photographer/` — `lastmod 2026-08-09`
- Release conserva siete URLs en sitemap y seis entradas en `llms.txt`;
  staging conserva sitemap vacío y noindex global.

## Verificación ejecutada

```bash
npm run optimize:source-images
npm run optimize:images
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  ./node_modules/.bin/tinacms build --local --skip-cloud-checks \
  --skip-indexing --port 4002 --datalayer-port 9001 \
  -c "./node_modules/.bin/astro build"
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app \
  ./node_modules/.bin/astro build
SITE_MODE=staging SITE_ORIGIN=https://itsakeeperphotography.netlify.app \
  node scripts/validate-site.mjs
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  ./node_modules/.bin/astro build
SITE_MODE=release node scripts/install-netlify-headers.mjs
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com \
  node scripts/validate-site.mjs
node --check scripts/validate-site.mjs
node --check scripts/playwright-evidence.js
git diff --check
```

- Tina+Astro release pasó en puertos alternos 4002/9001 sin tocar el proceso
  preexistente en `:9000`.
- Staging y release: `Validated 21 public routes`.
- Fuentes: todas ≤2400 px/700 KiB; variantes: `up to date`.
- JSON, sintaxis de validadores y whitespace Git: válidos.

### Playwright CLI

- Matriz: Richland y Kennewick × 1440×1000, 1200×900, 900×900 y 390×844.
- Resultado: 8/8 combinaciones aprobadas.
- Verificado: status 200, conteos 10/5, imágenes y captions completos,
  dimensiones declarativas/naturales, `currentSrc` WebP, cero solapamiento,
  clipping, overflow horizontal o anchors de galería.
- El único evento de consola externo fue un HTTP 400 de Microsoft Clarity bajo
  la red restringida; no hubo errores locales ni requests de assets fallidos.
- Evidencia ignorada: `.artifacts/city-galleries-final/`.

## Archivos principales

- Contenido: `content/pages/richland.json`, `content/pages/kennewick.json`.
- UI: `src/components/pages/RichlandPage.astro`,
  `src/components/pages/KennewickPage.astro`.
- Estilos: `src/styles/richland-page.css`,
  `src/styles/kennewick-page.css`.
- Media: diez `public/uploads/richland-*.jpg` y tres
  `public/uploads/kennewick-*.jpg` nuevos.
- QA: `scripts/validate-site.mjs`, `scripts/playwright-evidence.js`.
- Publicación: ambos `page-manifest.ts`, `STRUCTURE.md`.
- Diseño/memoria: superficies Impeccable, `paginas/11-richland.md`,
  `paginas/12-kennewick.md` y ADR-040.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado | Qué falta |
|---|---|---|
| Producción | Siete commits locales al cerrar | Push del usuario y QA del deploy. |
| Richland | Ready/index local, galería 10/10 | Verificar producción y bandwidth. |
| Kennewick | Ready/index local, galería 5/5 | Verificar producción; ampliar solo con una sesión nueva verificable. |
| Pasco | Ready/index local, galería 10/10 | Verificar producción y crawler outputs. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Newborn / comparación | Draft | Formato, safety/handling, validación y fecha. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Operación local

- Los servidores temporales de QA y la sesión Playwright se cerraron.
- No se detuvo ni modificó el proceso Tina preexistente en `:9000`.
- El artefacto `dist/` quedó reconstruido y validado en modo `release`.
- No ejecutar `./scripts/handoff.sh` mientras siga vigente la política del
  usuario de publicar personalmente, porque el script hace push.

## Bloqueadores externos

1. Publicar los siete commits locales en el remoto oficial.
2. Esperar el deploy Netlify y comprobar crawler gates/lastmod de las tres
   ciudades.
3. Observar bandwidth/build durante 48 horas.
4. Resolver la divergencia apex/`www` antes de tocar canonical/DNS/redirects.
5. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
