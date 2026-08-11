# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 16:13 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional de implementación verificado:** `bcbadae` —
`feat(journal): redesign senior timing guide`

**Base previa:** `e1ab90e` —
`docs(contact): record transparent estimate reversal`

**Cierre documental Senior Timing:** incluido en el commit local
`docs(journal): record senior timing redesign`; no se hizo push.

**HEAD documental actual:** `2c47def` —
`docs(journal): record senior timing redesign`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al concluir el cierre:** `main` queda diez commits por delante de
`origin/main` (`b504f84`) y el worktree queda limpio. El commit funcional y el
cierre documental están cerrados localmente. No se hizo push, deploy, DNS,
edición externa, envío de formulario ni `./scripts/handoff.sh`.

---

## Siguiente paso concreto

Auditar y rediseñar
`/journal/in-home-vs-studio-newborn-photography/` con el copy definitivo de
`paginas/17-journal-newborn.md`, fotografía existente verificable, comps
image-first y QA en 1440/1200/900/390. La calidad visual no autoriza por sí sola
`ready/index`: validar primero los hechos pendientes y una fecha editorial real.

Los diez commits acumulados permanecen locales hasta que el usuario decida
publicarlos. Codex no hizo push. El cierre documental Senior Timing no cambia
su gate: `/journal/when-to-book-senior-pictures-tri-cities/` sigue
`draft/noindex`, con header release noindex y fuera de sitemap/`llms.txt`.

Después de un push/deploy autorizado, verificar en el host final que la ruta
mantiene robots/header noindex, exclusión de crawler outputs, schema sin fechas,
11 imágenes cargadas y CSS aislado. Esa prueba no autoriza `ready/index`.

Para publicar el artículo en el futuro, Lisa/William deben aprobar una fecha
editorial real. Los deadlines distritales y la oferta Q54 son ampliaciones
opcionales: permanecen omitidos mientras no exista una fuente verificable o una
confirmación explícita.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Contact, Richland,
  Kennewick, Pasco, Family Photo Locations y Portfolio. Thank-you es
  `ready/noindex`; las otras 10 rutas siguen `draft/noindex`.
- Release contiene 10 URLs en sitemap y 9 entradas en `llms.txt`; Portfolio
  queda fuera de `llms.txt`. Staging conserva sitemap vacío y noindex global.
- Senior Timing ya tiene renderer, diseño, media, copy seguro, metadata, schema
  y QA propios, pero la calidad de implementación no sustituye el gate
  editorial.
- Contact transparente, Kind Words y la media Branding/Headshots permanecen
  preservados. No se revirtió ni se mezcló trabajo concurrente.

## Senior Timing en `bcbadae`

### Render y dirección

- `SeniorTimingPage.astro` reemplaza el fallback genérico solo para
  `/journal/when-to-book-senior-pictures-tri-cities/`.
- `src/pages/journal/[slug].astro` resuelve SSR y
  `EditorialPageRouter.astro` conserva el mismo renderer durante refresh Tina.
- `journal-senior-timing-page.css` se importa como `?url`, se enlaza mediante
  `Base.astro` únicamente en la ruta y no filtra `.senior-timing-*` a las otras
  veinte páginas.
- `EditorialHero` permanece compartido. El mock canónico es
  `.impeccable/mocks/senior-timing-03-contact-sheet-field-guide.png`; las
  opciones 01 ledger y 02 spine quedaron rechazadas.
- La secuencia es hero, byline, short answer, yearbook guidance, contact sheet
  estacional 4/2/1, Too Late, Golden Hour, booking ledger, Quick Answers y
  cierre full-bleed.

### Copy, semántica y enlaces

- Contrato exacto: 1 H1, 8 H2 y 7 H3 en el orden del documento fuente.
- El hero usa botón `Read the timeline` hacia `the-short-answer`; no crea un
  quinto anchor.
- Los cuatro anchors de `<main>` son, en orden: Seniors `see how senior sessions
  work`, Seniors `See how senior sessions work`, Family Photo Locations y
  Contact `Check my calendar`.
- La frase distrital no sustentada fue sustituida por la recomendación de
  consultar el deadline publicado por cada escuela y trabajar hacia atrás.
- `no school-schedule conflicts` pasó a
  `fewer school-schedule conflicts`. La pregunta Q54 se omite del FAQ visible.
- La byline identifica a Lisa, el estudio y Richland sin mostrar una fecha
  inventada.

Pendientes exactos preservados en contenido y validador:

1. `[VALIDAR: fechas concretas de los distritos de Richland, Kennewick y Pasco — dato local que nadie más publica]`
2. `[VALIDAR: si Lisa ofrece esto — Q54]`
3. `[FECHA]`

### Media

- La ruta renderiza 11 imágenes: nueve informativas con alt literal y dos prints
  decorativos con alt vacío.
- `west-richland-senior-woodpile-portrait.jpg` es una fuente nueva verificada
  desde la carpeta Senior de West Richland; cumple el guard de fuente, genera
  WebP 400/640/960/1440 y usa XMP allowlisted.
- La metadata segura conserva título, descripción y localidad demostrada; no
  contiene GPS, dirección, sublocation, fecha, serial, nombre RAW,
  EXIF/IPTC/ICC ni historial/IDs `xmpMM`.
- Las otras diez superficies reutilizan fotografías existentes verificadas; no
  se borró ni se sobrescribió media compartida.

### SEO, schema y publicación

- Title: `When to Take Senior Pictures: A Photographer's Timeline`.
- Description: `When should you take senior pictures — and when is it too late?
  A 20-year senior photographer shares the real timeline, season by season,
  plus booking tips.`
- `Base.astro` emite `og:type=article` para `schemaType=Article` y conserva
  `website` en las otras familias; la revisión final confirmó ausencia de
  regresión en las 21 rutas.
- La ruta emite `Article`, `FAQPage` de tres respuestas visibles y
  `BreadcrumbList` Home → Journal → When to Take Senior Pictures.
- El schema no contiene `datePublished`, `dateModified`, `lastModified`, Q54,
  deadlines distritales, `Service`, `Review`, `AggregateRating`, calle,
  coordenadas ni GPS.
- `contentStatus=draft`, `searchVisibility=noindex`, meta robots
  `noindex, nofollow, noarchive`, header release explícito y exclusión de
  `sitemap.xml`/`llms.txt` permanecen protegidos por validación.
- No existe una promesa de rich result FAQ; el schema solo refleja contenido
  visible y consistente.

## Verificación ejecutada

- Validadores staging y release: `Validated 21 public routes` en ambos modos.
- Playwright Senior Timing: `PASS` en 1440×1000, 1200×900, 900×900 y 390×844.
- Los cuatro viewports confirmaron headings, anchors, botón hero, byline sin
  fecha, FAQ nativo, foco, reduced motion, 11 imágenes, WebP responsive, crops,
  consola/red, overflow 0, canonical/robots y schema.
- Impeccable encontró una sola incidencia real: una transición de `width` en la
  hairline del booking ledger. Se corrigió a `transform: scaleX()`.
- Los otros diez avisos `broken-image` de Impeccable eran coincidencias de regex
  dentro del validador; las imágenes reales cargaron y fueron decodificadas en
  navegador.
- Revisión final independiente: `PASS`, sin defectos P1/P2; confirmó además
  draft/noindex, exclusión crawler, semántica, accesibilidad, CSS aislado y
  ausencia de regresión global de `og:type`.

## Publicación: decisión sustentable

`ready/index` **no es sustentable todavía**. La fecha editorial real es el gate
duro para `lastModified` y crawler outputs. Los detalles distritales no son
necesarios si el artículo conserva la guía neutral actual; solo se añaden con
fuente primaria vigente. Q54 tampoco es necesaria para la versión segura y
permanece omitida salvo confirmación de Lisa.

Cuando se apruebe publicación:

1. registrar la fecha editorial real en contenido/manifiesto;
2. decidir explícitamente si distrito/Q54 se verificaron o permanecen omitidos;
3. cambiar manifest/content a `ready/index` y añadir `lastModified` exacto;
4. retirar solo el header release específico de esta ruta;
5. reconstruir y comprobar sitemap, robots, `llms.txt`, canonical y schema;
6. repetir QA responsive y revisión final antes de deploy.

## Trabajo previo preservado

### Contact

- Implementación transparente/nativa: `df6db0f`; cierre ADR-053: `e1ab90e`.
- `/contact/` sigue `ready/index`, `lastModified: 2026-08-11`, dentro de sitemap
  10/`llms.txt` 9, con recibo SSR `$160`, cálculo vivo y POST HTML nativo a
  `/thank-you/`.
- Conserva un único `session-estimate`, `ContactPage` y `BreadcrumbList`; no se
  reintrodujo el gate AJAX ni se alteró Netlify Forms.

### Kind Words

- Implementación: `4cabb15`; cierre: `f917e09`.
- Se preservan diez reseñas destacadas, orden 1–10, fallback GBP, tap coarse,
  hover, foco/Escape, reduced motion y ausencia de schema Review/rating sin
  procedencia estructurada.

### Branding y Headshots

- Implementación: `127c539`; cierre: `a05d826`.
- Se preservan 18 JPEG, 72 WebP regenerables y XMP segura. Ambas rutas siguen
  `draft/noindex` por entregables comerciales pendientes.

## Archivos incluidos en el cierre documental

- `paginas/16-journal-senior-timing.md` — copy seguro, estructura exacta,
  enlaces, media, schema y gates.
- `paginas/00-INDICE.md` — estado corregido a rediseñado `draft/noindex`.
- `STRUCTURE.md` — arquitectura pública y publicación del artículo.
- `DESIGN.md` — addendum 16 del field guide.
- `docs/context/10-arquitectura.md` — renderer, router, CSS, schema, validadores
  y asset.
- `docs/context/20-estado.md` — esta fotografía operativa, reescrita al final.
- `docs/context/30-decisiones.md` — ADR-054 append-only.
- `docs/context/40-bitacora.md` — entrada append-only de Senior Timing.
- `docs/context/50-backlog.md` — rediseño cerrado y gates reales separados.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Senior Timing | Implementación completa en `bcbadae`; `draft/noindex` | Push del usuario y fecha editorial antes de considerar publicación. |
| Seniors service | `draft/noindex` | Confirmar número de imágenes por paquete; QA/release decision separada. |
| District/Q54 | Omitidos de forma segura | Añadir solo con fuente/confirmación explícita; no bloquean la versión neutral. |
| Contact | Completo en `df6db0f`/`e1ab90e` | Push del usuario y prueba nativa controlada tras deploy. |
| Kind Words | Completo en `4cabb15`/`f917e09` | Push del usuario y QA del resumen GBP en producción. |
| Branding | Media renovada en `127c539`; `draft/noindex` | Confirmar entregables, cantidad de imágenes y duración. |
| Headshots | Media renovada en `127c539`; `draft/noindex` | Confirmar duración y entregables. |
| Reviews | `draft/noindex` | Definir alcance, URL oficial y fuente estructurada antes de publicar/schema. |
| Privacy | `draft/noindex` | Revisión factual/legal y decisión de consentimiento. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS/canonicals. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
git rev-list --count origin/main..HEAD
git diff --check
git diff -- paginas/16-journal-senior-timing.md paginas/00-INDICE.md STRUCTURE.md DESIGN.md docs/context/
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
```

Para reconstruir Tina localmente, no detener un servidor largo del usuario en
`:9000`; usar un data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de publicar sus
propios commits, porque ese script hace push.

## Bloqueadores externos

1. El usuario decide cuándo publicar los diez commits locales acumulados; este
   pendiente externo no bloquea el rediseño local del artículo Newborn. Codex
   no hace push.
2. Aprobar una fecha editorial real antes de cambiar Senior Timing a
   `ready/index` o generar `lastModified`.
3. Lisa debe confirmar Q54 si se desea recuperar la pregunta multi-season; los
   datos distritales requieren fuente escolar primaria vigente.
4. Lisa debe confirmar el número de imágenes por paquete antes de publicar la
   página de servicio Seniors.
5. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
6. Privacy requiere revisión legal autorizada antes de su propia publicación.

## Preguntas abiertas

- TODO(contexto): ¿qué fecha editorial real debe usar Senior Timing?
- TODO(contexto): ¿se desea investigar deadlines distritales desde fuentes
  escolares primarias o mantener la recomendación neutral actual?
- TODO(contexto): ¿Lisa ofrece la opción multi-season referida en Q54?
- TODO(contexto): ¿cuántas imágenes incluye cada paquete Seniors?
- TODO(contexto): ¿cuál será el host canónico definitivo: apex o `www`?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿quién verificará Clarity, Google Analytics, GBP y Search
  Console después del deploy?
