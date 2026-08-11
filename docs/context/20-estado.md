# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-10 19:29 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `82af21f` —
`feat(home): refresh session card photography`

**Commit documental:** este archivo pertenece al commit local inmediatamente
posterior a `82af21f`; consultar `git log -1` después de crearlo para obtener su
hash sin inventarlo aquí.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al preparar este cierre:** `main` está veintitrés commits por
delante de `origin/main` (`ff736c6`) en `82af21f`. El worktree contiene
únicamente los cinco documentos reconciliados de este cierre; cuando entren en
su commit local, la rama quedará limpia y veinticuatro commits por delante. No
se hizo push, deploy, DNS ni otra mutación externa; el usuario conserva la
publicación.

---

## Siguiente paso concreto

El usuario debe publicar los veinticuatro commits locales posteriores a
`ff736c6`. Cuando Netlify termine, comprobar `/` en el dominio final: status
200, las cinco cards de servicios en orden, Seniors sin cambios y las cuatro
fotografías nuevas servidas como WebP responsive. Comprobar también `/about/`:
status 200, canonical `www`, meta robots index, ausencia de
`X-Robots-Tag: noindex`,
membresía y `lastmod: 2026-08-10` en `/sitemap.xml`, entrada exacta en
`/llms.txt`, las cuatro fotografías nuevas y el fondo del hero
`/uploads/about-lisa-photographing-tricities.jpg` con crop `50% 24%`. Confirmar
además que Belief conserva la cita horizontal en tres líneas y Method su inset
20–32 px, retícula 4/2/1 y 32 px antes de la segunda fila en tablet. Repetir la
comprobación pendiente de Newborn, Richland, Kennewick y Pasco. No cambiar
apex/`www`, DNS ni redirects antes de resolver la divergencia de host ya
documentada.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Richland, Kennewick,
  Pasco, Family Photo Locations y Portfolio. Thank-you es `ready/noindex`; las
  otras 11 rutas siguen `draft/noindex`.
- Release contiene nueve URLs en sitemap y ocho entradas en `llms.txt`;
  Portfolio queda fuera de `llms.txt`. Staging conserva sitemap vacío y noindex
  global.
- Homepage conserva su card Seniors byte a byte y renueva Family, Newborn,
  Branding y Headshots con fotografías existentes, optimizadas y alts
  literales. No se borró ni reprocesó media.
- La retícula mantiene cinco columnas a 1728/1440/1200, 2–2–1 a 900 y una
  columna a 390; el conjunto de variantes 640 px pesa aproximadamente 197 KiB.
- `/about/` quedó `ready/index`, `lastModified: 2026-08-10`, con copy definitivo,
  dirección A+C aprobada, autoridad verificable, schema propio y CSS aislado.
- El usuario aprobó reemplazar solo el fondo del hero About por
  `/uploads/about-lisa-photographing-tricities.jpg`, con alt literal y crop
  `50% 24%` común. H1, intro, script, CTA, prints y geometría permanecen
  exactos; el DOM nuevo está rebaselined.
- La fuente anterior no se borró ni reprocesó y continúa utilizada por otras
  rutas. Los cuatro retratos Lisa optimizados desde Drive permanecen en
  producción.
- Belief y Method quedaron reequilibradas con un ajuste CSS-only: la cita usa
  medida display de 12ch y balance, mientras el ledger recupera un inset válido
  de 20–32 px y conserva 4/2/1. Copy, DOM, media, schema y hero no cambian.
- La revisión independiente detectó un ritmo apretado a 900 px; los ítems Method
  01–02 ahora añaden 32 px inferiores antes de la segunda fila. La grilla sigue
  en dos columnas y overflow permanece en cero.
- Los claims pendientes de reseñas, salud, premio, Grammy, certificaciones,
  seguro, membresías y Google Business no se publican y no bloquean About.
- El commit funcional más reciente es `82af21f`; este cierre documental
  todavía no está commiteado ni publicado.

## Portfolio de servicios de Homepage

- Orden preservado: Seniors, Families, Newborns, Branding y Headshots.
- Seniors conserva `/uploads/senior-portrait-golden-hour-richland.jpg` con
  SHA-256
  `1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c`.
- Families usa `/uploads/about-belief-family-golden-hour-tricities.jpg`.
- Newborns usa `/uploads/newborn-family-at-home-west-richland.jpg`.
- Branding usa `/uploads/about-lisa-camera-portrait-tricities.jpg`.
- Headshots usa `/uploads/review-lisa-griffith-headshot-tricities.jpg`.
- El validador bloquea cambios de ruta/alt, duplicados, archivos ausentes,
  dimensiones o lazy loading incorrectos; Playwright verifica `currentSrc`
  WebP, foco, crops y overflow en cinco viewports.

## About publicado

### Copy y estructura visible

- Ruta: `/about/`.
- Title: `Meet Lisa Weiss | Tri-Cities Photographer for 20 Years`.
- Description: `The story behind It's A Keeper Photography — twenty years of
  preserving Tri-Cities families' most meaningful moments, and the mom who
  picked up a camera first.`
- H1 protegido: `Meet Lisa — The Heart Behind It's A Keeper`.
- Nueve H2 en orden: origen, nombre, cámara, veinte años, creencia, método,
  Lisa fuera de cámara, experiencia/reconocimiento y CTA final.
- Cinco anchors exactos dentro de `<main>`: hash del hero, Seniors, Investment,
  edición Issuu verificada y Contact.
- El enlace Issuu es la única salida externa, abre con `target="_blank"` y
  `rel="noopener"`, sin `nofollow`.
- `paginas/08-about.md` es la fuente reconciliada: contiene los 55 campos de
  copy publicados y documenta la única excepción explícita de fondo del hero.

### Dirección A+C

- A `Keeper Archive` aporta el arco de origen, print superpuesto y ledger del
  nombre.
- C `Through Her Lens` aporta el ritmo de retratos, el ledger 4/2/1 de `How I
  Photograph` y la prueba editorial.
- La secuencia completa usa historia de la cámara, galería con arco central,
  statement de creencia, retratos Off Camera, autoridad de cuatro filas y
  cierre fotográfico full-bleed.
- `Experience & Recognition` integra autoridad como ledger, no como badges o
  estadísticas genéricas: Lisa Weiss, Founder & Professional Photographer en
  Richland; 20+ años detrás de cámara; 14 años de negocio; cientos de historias;
  portada Tri-Cities MOM Magazine, agosto/septiembre de 2019.
- Los mocks aprobados quedan bajo `.impeccable/mocks/` como referencias de
  geometría. Ningún pixel generado se usa como fotografía de producción.
- `DESIGN.md` y `.impeccable/surfaces/route-about.md` fijan la tesis, el mundo
  visual, los patrones prohibidos, la secuencia responsive y el finish contract.

### Densidad Belief y Method

- En Belief, `max-width: 8ch` estaba aplicado al `blockquote` y se evaluaba con
  el font del body, produciendo una medida cercana a 70 px y una columna de una
  palabra. Ahora H2 y texto display usan 12ch, la cita tiene
  `text-wrap: balance`, máximo `3.75rem` y separaciones de 32 px en lugar de
  40 px.
- A 1728×997, Belief pasa de 1738.5 a 1324.2 px; la cita baja de 495.9 a
  180 px en tres líneas. Media y copy quedan equilibrados en 973.8 y 978.6 px.
- En Method, el token inexistente `--space-7` invalidaba todo el shorthand
  `padding`. El inset ahora usa tokens existentes mediante un clamp de 20–32 px,
  resuelve 27.648 px a 1728 y conserva la retícula 4/2/1 sin overflow.
- En el layout de dos columnas entre 768 y 1050 px, los ítems 01–02 usan además
  `padding-bottom: var(--space-8)`. A 900 px, la última línea del ítem 01 queda
  exactamente a 32 px de la hairline de la segunda fila, frente a 8–10 px antes
  del ajuste; se conservan dos columnas y overflow 0.

### Hero rebaselined y protegido

- El usuario aprobó explícitamente reemplazar solo el fondo por
  `/uploads/about-lisa-photographing-tricities.jpg`.
- Alt literal: `Lisa holding a camera to her face among dry grass and shrubs.`
- Crop desktop y móvil: `50% 24%`.
- H1, intro, script, CTA `#it-started-with-my-own-children`, dos prints,
  estructura DOM y geometría permanecen exactos.
- La fuente anterior `/uploads/lisa-photographer-tricities.jpg` no se borró ni
  reprocesó y sigue usada por otras rutas de producción.
- Fingerprint DOM Playwright:
  `7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`.
- Baseline exterior: 1440×882, 1200×782, 900×688 y 390×867.64 px, tolerancia
  máxima de 1 CSS px.

### Media

- `about-lisa-camera-portrait-tricities.jpg`: 1600×2400, 298,467 bytes.
- `about-lisa-photographing-tricities.jpg`: 1600×2400, 478,551 bytes.
- `about-lisa-camera-candid-black-white.jpg`: 1600×2400, 374,362 bytes.
- `about-lisa-camera-close-portrait-tricities.jpg`: 1600×2400, 486,994 bytes.
- Las cuatro fuentes son sRGB, metadata retirada y ≤700 KiB; sus WebP
  400/640/960/1440 son regenerables mediante el pipeline existente.
- La auditoría Drive local permanece fuera del commit; producción incluye solo
  las cuatro selecciones autorizadas y optimizadas.
- `about-lisa-photographing-tricities.jpg` sirve ahora tanto el fondo aprobado
  del hero como la historia de la cámara; no se duplicaron bytes.

### SEO y autoridad estructurada

- Ambos manifiestos y el JSON coinciden en `ready/index`,
  `lastModified: 2026-08-10`, title, description y resumen `llms.txt`.
- El header release no contiene una regla noindex para About.
- `AboutPage.about` y `AboutPage.mainEntity` apuntan a la entidad canónica
  `#lisa`.
- Existe una sola `Person` Lisa Weiss con job title, descripción, relación con
  `#business`, Richland/WA/US sin calle ni coordenadas, siete temas de
  conocimiento, idioma inglés, perfiles sociales y `subjectOf` enlazado a la
  edición original de Tri-Cities MOM Magazine.
- `LocalBusiness.founder` referencia el mismo `@id` sin duplicar Person.
- El breadcrumb es Home → About Lisa.
- No se emiten `Service`, `FAQPage`, `Review`, `AggregateRating`, premio,
  credencial, street address ni coordenadas.

### Rendimiento y aislamiento

- `about-page.css` se procesa como URL Vite y `Base.astro` lo enlaza únicamente
  cuando `entry.id === "about"`.
- Las reglas `.about-*` y el comentario de dirección no aparecen en las otras
  veinte rutas del router editorial compartido.
- No se añadió JavaScript interactivo propio a About; el cuerpo permanece Astro
  estático y usa el pipeline responsive de `Picture.astro`.
- El ajuste de densidad modifica únicamente `src/styles/about-page.css`; no
  añade assets, DOM, JavaScript, breakpoints ni reglas globales.

## Verificación ejecutada

- Release: `Validated 21 public routes in release mode.`
- Playwright Homepage aprobó el portfolio en 1728/1440/1200/900/390: cinco
  imágenes cargadas, variantes WebP, orden y alt exactos, Seniors protegida,
  foco visible y cero overflow.
- La revisión visual independiente devolvió PASS sin defectos P1/P2 ni recortes
  problemáticos de rostros, cabezas, bebé, cámara o manos.
- Playwright About volvió a aprobar 1440/1200/900/390 después del ajuste tablet;
  la inspección 1728×997 conserva las medidas aprobadas de Belief y Method.
- En los cinco anchos: status 200, canonical/robots correctos, un H1, nueve
  H2, cinco anchors en orden, schema exacto, todas las imágenes cargadas,
  variantes WebP, ancho de lectura y foco visibles.
- Cero overflow horizontal, clipping, solapamientos indebidos, imágenes rotas,
  errores de runtime, respuestas 4xx o requests same-origin fallidos.
- Reduced motion deja transiciones/transforms prescindibles anulados.
- El hero conserva copy, prints y geometría dentro de la tolerancia de 1 px; el
  fondo, alt, crop y fingerprint DOM nuevos están protegidos de regresión.
- Belief conserva una cita legible y horizontal; Method mantiene 4/2/1 con inset
  válido y 32 px antes de la segunda fila a 900, sin overflow.
- Impeccable final devolvió `[]` después del refinamiento tablet.
- El único hallazgo de la revisión independiente fue el breathing room a 900;
  quedó resuelto sin cambiar copy, autoridad, gates, schema, links, headings ni
  aislamiento CSS.
- `git diff --check`, copy 55/55, fences Markdown y conflicto markers pasan para
  los documentos de cierre.

## Archivos del lote

Implementación funcional base en `364569a`:

- `content/pages/about.json`
- `src/components/pages/AboutPage.astro`
- `src/styles/about-page.css`
- `src/pages/[slug].astro`
- `src/layouts/Base.astro`
- `src/lib/page-manifest.ts`
- `page-manifest.ts`
- `src/content/pending.ts`
- `scripts/validate-site.mjs`
- `scripts/playwright-about.js`
- `config/netlify-headers/release`
- cuatro JPEG bajo `public/uploads/about-lisa-*.jpg`
- comps, sidecars, prompts, manifest aprobado y superficie bajo `.impeccable/`

Ajuste del fondo del hero en `bd40b70`:

- `content/pages/about.json`
- `src/components/pages/AboutPage.astro`
- `scripts/validate-site.mjs`
- `scripts/playwright-about.js`
- `.impeccable/surfaces/route-about.md`
- `.impeccable/mocks/about-approved-manifest.json`

Refinamiento de densidad en `4774a25`:

- `src/styles/about-page.css`
- `.impeccable/surfaces/route-about.md`
- `.impeccable/mocks/about-approved-manifest.json`

Ajuste tablet del ledger Method en `0f9989c`:

- `src/styles/about-page.css`
- `.impeccable/surfaces/route-about.md`
- `.impeccable/mocks/about-approved-manifest.json`

Actualización del portfolio Homepage en `82af21f`:

- `content/homepage/index.json`
- `scripts/validate-site.mjs`
- `scripts/playwright-session-cards.js`

Documentación reconciliada en este cierre:

- `paginas/01-home.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| About | `ready/index` en `0f9989c` | Push del usuario y QA del deploy. |
| Homepage | Portfolio actualizado en `82af21f`; Seniors intacta | Push del usuario y QA del deploy. |
| Documentación Homepage | Completa en worktree | Crear el commit local de cierre. |
| Producción | Veintitrés commits sobre `ff736c6` antes del cierre documental | Commit docs, push del usuario y QA Netlify. |
| Newborn | `ready/index` | Verificar producción; Q41 sigue opcional/no bloqueante y sin claim. |
| Richland/Kennewick/Pasco | `ready/index` | Verificar producción y crawler outputs tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h tras deploy. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| Reviews/Privacy | Draft | Reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
SITE_MODE=release npm run validate:site
```

Para una reconstrucción Tina local, no detener el servidor largo del usuario en
`:9000`; usar un puerto de data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de hacer push
personalmente, porque ese script publica el repositorio.

## Bloqueadores externos

1. Crear el commit documental local inmediatamente posterior a `82af21f`.
2. El usuario debe publicar los veinticuatro commits locales en el remoto oficial.
3. Esperar el deploy Netlify y comprobar Homepage, About y las cuatro rutas
   recientes.
4. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
5. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿Lisa quiere ampliar About con alguno de los hechos hoy
  excluidos? Cada claim requiere evidencia y autorización antes de render/schema.
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
