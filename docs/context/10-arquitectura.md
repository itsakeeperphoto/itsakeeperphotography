# 10 — Arquitectura

> Solo describe lo que existe y fue inspeccionado o construido con éxito el
> 2026-08-11. Lo planeado está en `50-backlog.md`.

## Stack

| Capa | Tecnología | Versión verificada | Nota |
|---|---|---:|---|
| Runtime local | Node.js / npm | Node 26.4.0, npm 11.17.0 | `package.json` exige Node `>=22.12.0`. |
| Framework | Astro | 6.4.8 | Salida estática; adaptador elegido por destino. |
| CMS | TinaCMS / `@tinacms/astro` | 3.11.0 / 0.5.1 | Contenido editable, composición visual en código. |
| UI islands | React | 18.3.1 | Dependencia de desarrollo/Tina; páginas públicas son Astro. |
| Hosting | Netlify | Configuración en repo | Producción prevista y staging actual. |
| Formularios | Netlify Forms | HTML estático | `session-inquiry` y `session-estimate`. |
| Funciones/cache | Netlify Functions + Blobs | SDK en `package.json` | Resumen diario de reseñas GBP. |
| Imágenes | Sharp + script propio | Sharp 0.34.5 | AVIF/WebP/JPEG responsivos y metadatos explícitos. |
| Flipbook | `page-flip` | 2.0.7 | Solo Portfolio. |
| Analítica | Microsoft Clarity + Google tag (GA4) | Snippets globales en `src/layouts/Base.astro` | Clarity `xyqkkqom4v`; GA4 `G-0YW8M601L1`. |
| Anotación dev | Agentation | 3.0.2 | Solo integración de desarrollo. |
| Base de datos | Ninguna | — | Contenido en JSON/Markdown; cache GBP en Blobs. |
| Auth pública | Ninguna | — | TinaCloud gestiona su propia autenticación editorial. |

## Estructura relevante

```text
.
├── AGENTS.md                      contrato de continuidad
├── DESIGN.md                      sistema visual y responsive
├── STRUCTURE.md                   inventario/routing publicado
├── astro.config.mjs               modo staging/release y adaptadores
├── netlify.toml                   build, contextos y variables públicas
├── content/
│   ├── homepage/index.json        contenido de homepage
│   ├── settings/index.json        datos compartidos y navegación
│   ├── pages/*.json               contenido de rutas generales
│   ├── journal-pages/*.json       contenido del libro Portfolio
│   └── testimonials/*.json        testimonios almacenados
├── paginas/*.md                   documentos fuente entregados
├── docs/
│   ├── context/*.md               memoria operativa de agentes
│   ├── final-handoff.md            evidencia histórica del 2026-07-21
│   └── legacy-redirect-inventory.md inventario de redirecciones
├── src/
│   ├── components/                componentes Astro, páginas especializadas
│   ├── content/pending.ts         registro de hechos/media pendientes
│   ├── layouts/Base.astro         metadata, schema, header/footer y scripts
│   ├── lib/
│   │   ├── page-manifest.ts       21 rutas y estado de búsqueda
│   │   ├── content-pages.ts       resolución de contenido
│   │   ├── static-content.ts      fallback/contenido tipado
│   │   ├── session-pricing.ts     única fuente de precios del estimador
│   │   └── tina/                  acceso e islas de edición
│   ├── pages/                     rutas Astro, robots/sitemap/llms/endpoints
│   ├── scripts/                   interacción pública minificada al build
│   └── styles/                    CSS global y por familia de página
├── tina/config.ts                 modelos de contenido de Tina
├── netlify/
│   ├── functions/                 endpoints y job GBP programado
│   └── lib/                       cache/resumen GBP compartido
├── config/
│   ├── image-seo-metadata.json    allowlist XMP segura para assets locales
│   └── netlify-headers/           headers staging y release
├── public/                        assets optimizados, fuentes y redirects
├── scripts/
│   ├── lib/image-xmp.mjs          construcción/normalización de XMP segura
│   └── ...                        build, optimización, QA y handoff
├── .handoff/sessions/             rollouts locales ignorados por git
└── artifacts/, .artifacts/,
    .codex-evidence/               evidencia visual histórica y puntual
```

## Modelo de contenido

### Manifiesto de página

`src/lib/page-manifest.ts` es la fuente tipada de rutas. Cada entrada conserva:

- ruta y familia;
- `contentStatus: "draft" | "ready"`;
- `searchVisibility: "index" | "noindex"`;
- metadata, tipo de schema y breadcrumb;
- media/hechos no resueltos;
- máximo de enlaces internos de body;
- dispositivo compositivo requerido;
- participación en sitemap/`llms.txt` y `lastModified`.

### Contenido

- JSON en `content/` es la fuente consumida por Tina y las páginas.
- Los `.md` de `paginas/` son documentos fuente y no se renderizan directamente.
- `src/content/page-types.ts` tipa las familias.
- `src/content/pending.ts` centraliza hechos y media que no deben inventarse.
- `tina/config.ts` expone modelos de contenido. Los editores pueden cambiar copy
  e imágenes, no la estructura visual de los componentes.
- En Homepage, `meetLisa.portrait` alimenta el retrato principal en arco y el
  campo Tina opcional `meetLisa.printImage` alimenta el print decorativo. Si
  `printImage` falta, `MeetLisa.astro` usa `portrait` como fallback. El hero
  conserva una fuente editorial en JSON y variantes art-directed preconstruidas
  para desktop y móvil.

### Precios

`src/lib/session-pricing.ts` es la única fuente para el estimador de Contact:

- Servicios: Senior, Family, Newborn, Branding y Headshots.
- Cobertura: #ONE `$160`, #TWO `$220`, #THREE `$330`.
- Colecciones: ninguna `$0`, #1 `$495.98`, #2 `$1,169.48`, #3 `$1,799.99`.
- Add-ons: imagen retocada `$25`, outfit `$20`, rush 48h `$75`.
- Cinco personas incluidas; `$15` por persona adicional; 1–30 personas.
- No existe add-on de segunda ubicación.

La versión enviada con el formulario se define en
`src/components/SessionPriceCalculator.astro`. El total es un estimado, no un
booking ni un cobro.

En Contact, el recibo, el desglose y los totales desktop/móvil se renderizan
visibles en SSR con el paquete inicial #ONE y `$160`. La ruta contiene un único
form `session-estimate`; nombre, email, teléfono e historia son obligatorios, y
preferred timing es opcional. JavaScript recalcula en vivo las líneas, la
fotografía, el total y los campos ocultos, pero no intercepta el submit. El
navegador ejecuta el `POST` URL-encoded con `action="/thank-you/"` como
navegación de documento, también cuando JavaScript está desactivado. No existen
`fetch`, `preventDefault`, gate, reveal, estados locked/unlocked, timeout,
retry, freeze tras éxito ni analítica personalizada del gate.

## Ruteo y renderizado

- `src/pages/index.astro` compone la homepage y es la única ruta que incluye
  `SitePreloader.astro`.
- `src/pages/[slug].astro` resuelve páginas top-level desde el manifiesto.
- `src/pages/journal/[slug].astro` resuelve artículos y ramifica explícitamente
  Family Photo Locations y Senior Timing a sus renderers especializados antes
  del fallback `ContentPage`.
- `src/pages/portfolio.astro` conserva el flipbook especializado.
- `src/pages/tina-island/[name].ts` sirve refresco visual de islas Tina.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts` y `llms.txt.ts` generan salidas
  según `SITE_MODE` y el manifiesto.

En Homepage, `Hero.astro` entrega la fotografía visual mediante `picture`:
AVIF/WebP 1440×960 para desktop/tablet y un recorte AVIF/WebP 640×1024 para
móvil, con JPEG fuente como fallback. `MeetLisa.astro` mantiene separado el
retrato informativo principal del print pequeño decorativo, que se carga lazy y
permanece fuera del árbol accesible.

`KindWords.astro` recibe hasta diez testimonios `featured` desde
`content/testimonials/*.json`, ordenados por `order` 1–10. Cada fotografía usa
`Picture.astro` y variantes WebP regenerables. El archivo fuente
`public/scripts/site.js` crea los clones decorativos del loop, los excluye del
orden de tabulación y revela el reverso por hover con puntero fino, foco de
teclado o toggle por tap con puntero coarse; solo una tarjeta puede permanecer
abierta. Tina aplica el mismo rango 1–10.

Componentes especializados existentes:

- `FamilyPage.astro`, `SeniorPage.astro`, `NewbornPage.astro`
- `BrandingPage.astro`, `HeadshotPage.astro`
- `AboutPage.astro`, `InvestmentPage.astro`, `ContactPage.astro`
- `JournalPage.astro`, `LocationsGuidePage.astro`, `SeniorTimingPage.astro`
- `RichlandPage.astro`, `KennewickPage.astro`, `PascoPage.astro`
- `ContentPage.astro` para rutas aún genéricas, incluidas Reviews, Privacy,
  Thank-you y algunos artículos.

`EditorialHero.astro` materializa la estructura de hero basada en Seniors y es
compartido por varias páginas especializadas, incluidas Kennewick y Pasco. Su frase
script es opcional: cuando no existe contenido aprobado, el nodo no se emite.
Admite CTA como enlaces o como botón de desplazamiento; Kennewick y Pasco usan
botones hacia sus cierres, por lo que el hero no añade un anchor. Su título en
líneas conserva espacios explícitos para que el texto DOM siga siendo exacto.

`SeniorTimingPage.astro` renderiza el artículo
`/journal/when-to-book-senior-pictures-tri-cities/` como field guide
image-first: byline sin fecha, short answer, yearbook guidance, contact sheet
estacional 4/2/1, essays Too Late/Golden Hour, booking ledger, tres `<details>`
y cierre full-bleed. El contrato exacto es 1 H1, 8 H2, 7 H3, cuatro anchors y
11 imágenes —nueve informativas más dos prints decorativos—. Reutiliza
`EditorialHero`; su control es un botón local, no un anchor. El CSS
`journal-senior-timing-page.css` se importa con `?url` desde
`src/pages/journal/[slug].astro` y `Base.astro` lo enlaza solo en esa ruta.
`EditorialPageRouter.astro` repite la misma rama para que el refresco Tina no
degrade la superficie a `ContentPage`.

`AboutPage.astro` publica la dirección híbrida A+C aprobada —`Keeper Archive`
más `Through Her Lens`— como página de identidad y confianza. Su
`EditorialHero` conserva H1, intro, script, CTA hash, dos prints, estructura DOM
y geometría exactos. El usuario aprobó una única excepción de media: el fondo
es `/uploads/about-lisa-photographing-tricities.jpg`, con alt literal y crop
`50% 24%` tanto en desktop como en móvil; el DOM rebaselined queda fijado por
SHA-256
`7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`.
Debajo, la secuencia fija comprende origen, historia del
nombre, historia de la cámara, lecciones, creencia, método 4/2/1, vida fuera de
cámara, autoridad como ledger y cierre fotográfico full-bleed. El contrato
visible exige un H1, nueve H2 y cinco anchors en orden: hash del hero, Seniors,
Investment, Issuu y Contact. El stylesheet se importa con `?url` en
`src/pages/[slug].astro` y `Base.astro` lo enlaza solo en About para impedir
leakage a las demás rutas del router compartido.

`NewbornPage.astro` conserva sin cambios el `EditorialHero` compartido y el
subárbol completo `What Your Newborn Session Looks Like`; ambos están protegidos
por fingerprints DOM y baselines geométricos en 1440/1200/900/390. El resto de
la ruta implementa la dirección A+C aprobada: A como composición base y C como
donante del statement `No hard deadline` y el FAQ ledger. El contrato exige
siete H2, cuatro anchors exactos dentro de `<main>` y ocho FAQ visibles/schema
1:1. El copy del cierre se dimensiona automáticamente dentro de su primera pista
desktop, sin invadir ni quedar recortado por la fotografía contigua; el H2 usa
una escala fluida y `overflow-wrap: normal` para que `EXPECTING?` nunca se parta
dentro de la palabra. Q41 sobre formación de seguridad permanece pendiente no
bloqueante y no existe un claim publicado.

El contrato de `RichlandPage.astro` renderiza cinco filas enlazadas de servicio
y cuatro FAQ. Su guard específico de galería exige, cuando esta no está vacía,
exactamente diez fotografías con heading, imagen y alt completos, fuentes
únicas y cero links. Las diez actuales proceden de diez sesiones Richland
distintas y se muestran como contact sheet editorial determinista 3/2/1: en
desktop son tres columnas lógicas distribuidas en dos bandas completas de cinco
imágenes; tablet usa dos columnas y móvil una.

`KennewickPage.astro` exige cinco filas enlazadas de servicio y cuatro FAQ. El
cuerpo usa arco+hairline, un único collage restringido, sección local
text-led, directorio ledger con una fotografía, FAQ nativo y cierre fotográfico
full-bleed. Cuando la galería no está vacía, exige exactamente cinco fotografías
con heading, imagen y alt completos, fuentes únicas y cero links. Las cinco
actuales representan cinco sesiones seguras; la sesión Benton City permanece
excluida y no se inventa una sexta. El cierre full-bleed usa
`object-position: 50% 20%` solo por encima de 1050 px para conservar completa la
cabeza del sujeto; tablet y móvil mantienen su crop previo.

`PascoPage.astro` exige cinco servicios enlazados, diez fotografías verificadas
de diez sesiones, cuatro FAQ y ocho anchors exactos. Su secuencia A+C combina
hero/intro de horizonte abierto, dos bloques de paisaje, directorio ledger,
galería editorial, planificación estacional, FAQ nativo y cierre full-bleed.
El cierre reutiliza la geometría centrada de la invitación Richland —retícula de
12 columnas, wash umber, display marfil y CTA outlined— sin compartir CSS ni
media: conserva copy, fotografía, alt y focal crops propios de Pasco. En móvil
la foto permanece `cover`; no hereda el `contain` route-wide de Richland.
`src/pages/[slug].astro` importa `pasco-page.css` como URL procesada por Vite y
`Base.astro` la enlaza solo para Pasco. Así se evita que el router compartido
inyecte aproximadamente 20 KiB de CSS Pasco en cada ruta editorial ajena.

## Contratos externos

### Netlify Forms

Formularios detectables estáticamente:

- `session-inquiry` en `src/components/GuidedInquiry.astro`.
- `session-estimate` en `src/components/SessionPriceCalculator.astro`.

Ambos usan `POST`, `data-netlify="true"`, honeypot, campo oculto `form-name` y
acción `/thank-you/`. La entrega por correo se configura en Netlify Dashboard;
un campo oculto de recipient no crea la notificación.

`/contact/` renderiza exactamente una instancia de `session-estimate`. Con o
sin JavaScript, esa instancia usa el transporte HTML nativo hacia
`/thank-you/`; el script solo mejora el cálculo y la navegación interna del
planner. El payload conserva contacto, notas, selecciones crudas y, cuando el
calculador está activo, desglose y total. El usuario confirmó el 2026-08-11 que
Forms y sus notificaciones ya funcionan en producción. El QA local interceptó
los POST como navegaciones de documento y no realizó envíos reales.

### Analítica

- `src/layouts/Base.astro` carga Microsoft Clarity con project ID público
  `xyqkkqom4v` y Google tag/GA4 con measurement ID público
  `G-0YW8M601L1` dentro del `<head>` compartido.
- Los snippets se renderizan en las 21 rutas públicas, tanto en staging como en
  release. No existe gating por entorno ni por consentimiento en el código
  actual.
- La revisión humana pendiente de Privacy debe considerar ambas herramientas;
  este registro técnico no sustituye una evaluación legal o de consentimiento.

### Google Business Profile

- `netlify/functions/refresh-gbp-review-summary.mts`: job `@daily` que solicita
  un access token y lee el resumen de reseñas de GBP.
- `netlify/lib/gbp-review-summary.ts`: validación y cache en Netlify Blobs.
- `netlify/functions/google-review-summary.mts`: endpoint público
  `/api/google-review-summary` de solo lectura.
- `src/components/KindWords.astro`: consume el endpoint y conserva el fallback
  editorial `100+ five-star Google reviews` salvo que GBP entregue juntos un
  `averageRating` y `totalReviewCount` válidos; solo entonces muestra ambos
  valores actuales.

El flujo requiere credenciales OAuth y IDs de GBP; no hay valores en git.

### Tina visual editing

`TinaIsland.astro`, `src/lib/tina/data.ts` y `src/lib/tina/islands.ts` separan
registro de islas, queries y render público para evitar cargar CSS/JS de páginas
no utilizadas en homepage.

## Variables de entorno

Los nombres están en `.env.example`; nunca documentar valores reales.

| Variable | Propósito | Requerida |
|---|---|---|
| `TINA_PUBLIC_CLIENT_ID` | Cliente TinaCloud | Deploy con edición |
| `TINA_TOKEN` | Lectura/build TinaCloud | Build conectado |
| `TINA_PUBLIC_BRANCH` | Rama editorial | Opcional según deploy |
| `DEPLOY_TARGET` | Fuerza adaptador | Opcional |
| `SITE_MODE` | `staging` o `release` | Sí en Netlify |
| `SITE_ORIGIN` | Canonical explícito | Sí por contexto |
| `PUBLIC_INQUIRY_NOTIFICATION_EMAIL` | Campo/auditoría visible al build | Sí por contexto; no configura correo |
| `GBP_OAUTH_CLIENT_ID` | OAuth GBP | Solo resumen dinámico |
| `GBP_OAUTH_CLIENT_SECRET` | OAuth GBP | Solo resumen dinámico |
| `GBP_OAUTH_REFRESH_TOKEN` | Renovación OAuth GBP | Solo resumen dinámico |
| `GBP_ACCOUNT_ID` | Cuenta GBP | Solo resumen dinámico |
| `GBP_LOCATION_ID` | Ubicación GBP | Solo resumen dinámico |

`netlify.toml` configura staging con `globalbridge360@gmail.com` y producción
con `itsakeeperphoto@gmail.com` en la variable pública de auditoría. Las
notificaciones reales siguen dependiendo del Dashboard de Netlify; su
configuración y funcionamiento en producción fueron confirmados por el usuario
el 2026-08-11.

## Comandos

```bash
npm install
npm run dev
npm run build:local
npm run build
npm run preview
npm run optimize:source-images
npm run optimize:images
npm run audit:lighthouse
```

`npm run build:local` valida primero que los JPEG fuente no excedan 2400 px ni
700 KiB, genera variantes responsive, inicia Tina local, compila Astro, instala
headers de staging y ejecuta `scripts/validate-site.mjs`. `npm run build`
realiza la misma disciplina de assets y además indexación/build Tina según el
entorno de deploy. En Netlify el guard puede optimizar una fuente grande en el
checkout efímero; localmente exige `npm run optimize:source-images -- --write`
para evitar cambios silenciosos al repositorio.

## Despliegue

- Rama verificada: `main`.
- Netlify ejecuta `npm run build` y publica `dist/`.
- Contexto production: `SITE_MODE=release`, canonical del dominio `www` y correo
  público de producción.
- Deploy previews, branch deploys y dev: `SITE_MODE=staging`, canonical Netlify y
  noindex global.
- `astro.config.mjs` rechaza combinaciones incoherentes de modo/contexto y elige
  adaptador Netlify, Vercel o Node; la salida pública es estática.
- `scripts/install-netlify-headers.mjs` instala el set de headers correcto.
- `scripts/validate-site.mjs` valida las 21 rutas, canonicals, crawler outputs,
  formularios, placeholders, enlaces internos rotos y gates de publicación.
  En Homepage fija la fuente/alt del hero, sus cuatro variantes art-directed,
  preloads y atributos prioritarios; protege también la separación entre el
  retrato principal y el print decorativo de Meet Lisa, además del contrato de
  las cinco cards y el digest byte-identical de Seniors.
  Para las galerías Richland/Kennewick compara allowlists literales de `src` y
  alt, cuenta 10/5 tríos figure/image/caption, prohíbe duplicados y anchors, y
  conserva siete H2 y nueve anchors de `<main>` en ambas rutas.
- Para About valida metadata y estado `ready/index`, H1 protegido, fondo/alt y
  crop exactos del hero, nueve H2, mapa exacto de cinco anchors, enlace Issuu
  seguro, ausencia de claims pendientes, entidades
  `AboutPage`/`Person`/`BreadcrumbList`, referencia única al founder global y
  ausencia de schema de servicio, FAQ, reseñas, rating, premio, coordenadas o
  dirección de calle.
- Para Contact valida estado `ready/index`, metadata/canonical/robots, una sola
  instancia de `session-estimate`, nombre/email/teléfono/historia requeridos,
  timing opcional, recibo y totales SSR visibles en `$160`, región live, campos
  calculados, acción nativa `/thank-you/` y ausencia completa de markup, script
  y analítica del gate. Playwright lleva el total a `$955.98`, intercepta el
  POST URL-encoded como navegación de documento en 1440/1200/900/390 y repite
  el fallback sin JavaScript a 390 px. El contrato conserva
  `ContactPage`/`BreadcrumbList`, ausencia de un `Service` inventado, membresía
  exacta en sitemap/`llms.txt` y aislamiento noindex de staging.
- Para Branding y Headshots valida el manifiesto XMP de 18 JPEG, naming
  descriptivo, dimensiones/peso, ausencia de metadata sensible, cuatro WebP
  400/640/960/1440 por fuente y XMP exacto en fuente/derivados. En el HTML fija
  fuente y alt de cada superficie, mínimo 11 fuentes únicas por ruta, máximo
  dos usos por fuente, hero distinto del cierre y unicidad específica del
  mosaico Branding y el par Team Headshots.
- Para Senior Timing fija el estado `draft/noindex`, metadata/canonical,
  `og:type=article`, tres pendientes literales y exclusión de sitemap/`llms.txt`.
  En el HTML exige 1 H1, 8 H2, 7 H3, cuatro anchors en orden, 11 imágenes con
  nueve alts informativos/dos vacíos decorativos, byline sin fecha, CTA local
  como botón, tres FAQ visibles y CSS aislado. Contrasta `Article`, `FAQPage` y
  `BreadcrumbList` con el copy visible y prohíbe fechas, Q54, deadlines
  distritales, `Service`, ratings, calle y geodatos inventados. Playwright cubre
  1440/1200/900/390, foco, acordeones, reduced motion, crops, carga WebP,
  consola/red, overflow y ausencia de regresión de `og:type` en las 21 rutas.

## SEO/indexación actual

En `release`, el manifiesto actualmente permite sitemap para diez rutas:

- `/`
- `/family-photographer-tri-cities-wa/`
- `/newborn-photographer-tri-cities-wa/`
- `/about/`
- `/contact/`
- `/richland-wa-photographer/`
- `/kennewick-wa-photographer/`
- `/pasco-wa-photographer/`
- `/journal/family-photo-locations-tri-cities/`
- `/portfolio/`

`llms.txt` incluye Homepage, Family, Newborn, About, Contact, Richland,
Kennewick, Pasco y Family Photo Locations; Portfolio está excluido de llms.
Otras 10 rutas siguen `draft/noindex`.
`/thank-you/` es noindex permanente. Los headers release de Journal deben
enumerar las rutas draft explícitamente; un wildcard `/journal/*` bloquearía
también los artículos publicados. En
`staging`, sitemap queda sin URLs indexables y todo el sitio lleva noindex.

`Base.astro` emite WebSite, LocalBusiness, breadcrumbs y schema por familia.
También deriva `og:type`: `article` únicamente cuando `schemaType` es
`Article`, y `website` para las demás familias.
`src/pages/[slug].astro` añade para Kennewick y Pasco un `Service` de portrait
photography con `areaServed` de la ciudad/WA y provider enlazado al negocio; no
declara ubicación física en esas ciudades. No se emiten `Review`,
`AggregateRating` ni `streetAddress` sin evidencia y autorización.

Para Newborn, `src/pages/[slug].astro` emite un `WebPage`, un `Service`
detallado de fotografía newborn in-home para Richland/Kennewick/Pasco y un
`BreadcrumbList` Home → Newborn Photography. `NewbornPage.astro` deriva un
único `FAQPage` de las ocho respuestas visibles, en el mismo orden y texto.

Para About, `Base.astro` emite un único `AboutPage` cuyo `about` y
`mainEntity` apuntan a `#lisa`; `[slug].astro` añade una sola entidad `Person`
Lisa Weiss y `BreadcrumbList` Home → About Lisa. `LocalBusiness.founder`
referencia el mismo `@id` sin duplicar la persona. La autoridad estructurada
incluye rol, Richland/WA/US sin calle ni coordenadas, siete áreas de
conocimiento, idioma, perfiles sociales y la publicación verificable de
Tri-Cities MOM Magazine de agosto de 2019. No emite `Service`, `FAQPage`,
`Review`, `AggregateRating`, premio ni credencial.

Para Contact, `Base.astro` emite un único `ContactPage` enlazado al negocio y
`[slug].astro` añade `BreadcrumbList` Home → Session Pricing Estimate. La ruta
no emite un `Service` de nivel superior, calle, coordenadas, `Review` ni
`AggregateRating`.

Para Senior Timing, `Base.astro` emite `Article` con headline, author/publisher,
imagen, `mainEntityOfPage`, `about` y cobertura Richland/Kennewick/Pasco;
`journal/[slug].astro` añade `FAQPage` de tres respuestas visibles y
`BreadcrumbList` Home → Journal → When to Take Senior Pictures. Ningún nodo
contiene `datePublished`, `dateModified` o `lastModified` mientras `[FECHA]`
siga pendiente. La frase distrital no demostrada y Q54 tampoco se exponen. La
ruta conserva `draft/noindex`, su header release y exclusión de sitemap/llms.

## Assets y rendimiento

- Fuentes WOFF2 locales en `public/fonts/`; no se depende de Google Fonts en
  runtime.
- Fotografías optimizadas en AVIF/WebP/JPEG con dimensiones y `sizes`.
- `scripts/optimize-source-images.mjs` limita JPEG web a 2400 px y 700 KiB,
  conserva metadatos existentes y reemplaza solo después de validar el temporal.
- `scripts/optimize-images.mjs` genera las variantes 400/640/960/1440 con hasta
  cuatro workers, WebP quality 72 y effort 4. En la medición limpia del
  2026-08-09 pasó de 114.80 s a 5.09 s.
- Para los assets incluidos explícitamente en
  `config/image-seo-metadata.json`, `scripts/optimize-images.mjs` incorpora XMP
  segura en cada WebP y toma el manifiesto como entrada de invalidación. El
  helper `scripts/lib/image-xmp.mjs` permite al optimizador y al validador
  construir y comparar exactamente la misma metadata.
- Diez assets sin referencias en ninguna de las 21 rutas, CSS, Tina, schema u
  Open Graph fueron retirados en `bd833f6`; cualquier restauración debe añadir
  primero una referencia verificable.
- Richland incorpora diez JPEG fuente optimizados de diez sesiones distintas
  verificadas por folder, XMP, `OriginalDocumentID` e identidad visual. Sus
  variantes WebP 400/640/960/1440 se regeneran durante el build.
- Kennewick incorpora nueve JPEG fuente optimizados procedentes de las carpetas
  Drive `Couples - Kennewick` y `Senior Session - Kennewick`: los seis del
  rediseño y tres frames alternativos para la galería. La galería activa usa
  esos tres y reutiliza dos fuentes de producción de sesiones distintas.
  `010A4575copy.jpg` y `sennior-session-benton-city.jpg` no se publican porque
  pertenecen a la misma sesión identificada como Benton City.
- Pasco incorpora diez JPEG fuente optimizados de diez sesiones distintas
  verificadas por folder, XMP e identidad visual: tres family/large-family y
  siete senior. Sus originales de auditoría permanecen ignorados; producción
  usa solo los JPEG ≤2400 px/700 KiB y variantes WebP 400/640/960/1440.
- Newborn incorpora un JPEG nuevo verificado desde Drive:
  `newborn-family-at-home-west-richland.jpg`, optimizado de 13.13 MiB/4000×6000
  a 412 KiB/1600×2400. Sus variantes WebP responsive son regenerables y están
  ignoradas por Git; los demás assets de la ruta ya existían en producción.
- Senior Timing incorpora
  `west-richland-senior-woodpile-portrait.jpg`, verificado desde la carpeta
  Senior de West Richland y usado como print decorativo del hero. La fuente
  cumple el guard ≤2400 px/700 KiB, genera WebP 400/640/960/1440 y conserva XMP
  allowlisted con título, descripción y localidad demostrada; no contiene GPS,
  dirección, sublocation, fecha, serial, EXIF/IPTC/ICC ni IDs `xmpMM`.
- About incorpora cuatro retratos nuevos de Lisa procedentes de la carpeta
  Drive `MY NEW branding pics ( Lisa )`: tres en color y uno en blanco y negro,
  todos en 1600×2400, sRGB, sin metadata y entre 298–487 KiB. Sus variantes
  WebP 400/640/960/1440 son regenerables. Uno de esos retratos es ahora el fondo
  aprobado del hero, con crop `50% 24%`; los dos prints laterales permanecen
  intactos. La fuente de fondo anterior no se borró ni se reprocesó porque
  continúa utilizada por otras rutas de producción.
- Homepage usa como hero visual
  `/uploads/kennewick-couple-open-field-golden-hour.jpg` (2400×1600, 549817 B)
  y cuatro derivados rastreados: desktop AVIF/WebP 1440×960 y recorte móvil
  AVIF/WebP 640×1024. El navegador carga una sola fuente AVIF compatible, sin
  solicitar el JPEG. La fuente anterior permanece porque Settings, Open Graph,
  schema y otras rutas todavía la referencian. Meet Lisa conserva su retrato
  principal y cambia solo el print pequeño a una fuente existente en blanco y
  negro; no se borró media de producción.
- Branding y Headshots comparten un lote de 18 JPEG nuevos procedentes de las
  carpetas Drive verificadas `Branding photos` de Richland, Kennewick y West
  Richland, más el inventario Headshot auditado. Los JPEG son sRGB,
  progresivos, ≤2400 px y ≤700 KiB; sus 72 WebP 400/640/960/1440 son
  regenerables e ignorados por Git. Branding renderiza 13 superficies con 11
  fuentes únicas; Headshots, 14 con 11. Ninguna fuente aparece más de dos veces
  dentro de su ruta.
- La metadata del lote se limita a creator, credit, rights, web statement,
  title, description y ciudad/estado/país cuando la carpeta Drive lo verifica.
  No se conserva GPS, dirección, sublocation, fecha de captura, serial, nombre
  RAW, EXIF/IPTC/ICC ni historial/identificadores `xmpMM`. El retrato neutral de
  Headshots no incluye ciudad. Los nombres descriptivos y alt literales siguen
  siendo las señales principales; XMP no justifica inventar precisión local.
- GSAP no es una dependencia global. Los scripts de interacción se cargan solo
  en las rutas/composiciones que los necesitan.
- Portfolio carga prioritariamente solo las páginas visibles iniciales.
- El preloader usa SVG inline y Web Animations API; anima transform/opacity,
  respeta reduced motion, permite Escape/Tab y elimina el overlay al finalizar.

## Trampas conocidas

1. La homepage Netlify es la autoridad visual; no rehacerla desde `DESIGN.md` ni
   usar el dominio legado como referencia.
2. `PUBLIC_INQUIRY_NOTIFICATION_EMAIL` no entrega emails por sí mismo. Las
   notifications se configuran en Netlify Dashboard; el usuario confirmó su
   funcionamiento en producción el 2026-08-11.
3. Ejecutar `npm run build:local` puede modificar temporalmente los componentes
   de formularios añadiendo IDs. Revisar `git status` después del build y no
   commitear cambios generados no solicitados.
4. Tina local abre listeners para UI y data layer; entornos sandbox pueden
   devolver `EPERM`. Si el servidor largo del usuario ya ocupa `:9000`, usar un
   puerto alterno como `--datalayer-port 9001` sin detener ese proceso. Los
   builds finales Newborn se verificaron de ese modo.
5. `docs/final-handoff.md` y sus 84 capturas son evidencia histórica del
   2026-07-21, no una certificación de todos los cambios posteriores.
6. `README.md` está desactualizado respecto a rutas y formularios actuales.
7. `content/settings/index.json` conserva una dirección marcada como legado; el
   render público y schema no deben exponerla.
8. `public/_redirects` incluye host redirects al dominio final. QA de staging
   debe hacerse con deploy preview/host adecuado y verificar el comportamiento.
9. No declarar una ruta lista solo porque compila: pendientes de
   `src/content/pending.ts` y QA responsive deben resolverse primero.
10. Las ubicaciones exactas de sesiones locales no se deben inferir a partir de
    imágenes; el artículo actual protege esa información hasta confirmación.
11. Los `*.jsonl` de `.handoff/sessions/` pueden contener datos de conversación
    y están ignorados por git. `docs/context/` es la memoria compartida; no
    forzar la inclusión de transcripts sin autorización explícita.
12. `scripts/handoff.sh` excluye los transcripts por pathspec y aborta si alguno
    está rastreado o preparado para commit. La presencia del comentario en el
    script no sustituye `.handoff/sessions/.gitignore` ni este control.
13. El push al remoto oficial requiere una sesión GitHub autenticada con acceso
    a `itsakeeperphoto/itsakeeperphotography`; la identidad `williammelo533`
    recibió HTTP 403 en la última prueba.
