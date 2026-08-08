# 10 — Arquitectura

> Solo describe lo que existe y fue inspeccionado o construido con éxito el
> 2026-08-08. Lo planeado está en `50-backlog.md`.

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
├── config/netlify-headers/        headers staging y release
├── public/                        assets optimizados, fuentes y redirects
├── scripts/                       build, optimización, QA y handoff
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

## Ruteo y renderizado

- `src/pages/index.astro` compone la homepage y es la única ruta que incluye
  `SitePreloader.astro`.
- `src/pages/[slug].astro` resuelve páginas top-level desde el manifiesto.
- `src/pages/journal/[slug].astro` resuelve artículos.
- `src/pages/portfolio.astro` conserva el flipbook especializado.
- `src/pages/tina-island/[name].ts` sirve refresco visual de islas Tina.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts` y `llms.txt.ts` generan salidas
  según `SITE_MODE` y el manifiesto.

Componentes especializados existentes:

- `FamilyPage.astro`, `SeniorPage.astro`, `NewbornPage.astro`
- `BrandingPage.astro`, `HeadshotPage.astro`
- `AboutPage.astro`, `InvestmentPage.astro`, `ContactPage.astro`
- `JournalPage.astro`, `LocationsGuidePage.astro`
- `RichlandPage.astro`, `KennewickPage.astro`
- `ContentPage.astro` para rutas aún genéricas, incluidas Pasco, Reviews,
  Privacy, Thank-you y algunos artículos.

`EditorialHero.astro` materializa la estructura de hero basada en Seniors y es
compartido por las páginas especializadas anteriores.

## Contratos externos

### Netlify Forms

Formularios detectables estáticamente:

- `session-inquiry` en `src/components/GuidedInquiry.astro`.
- `session-estimate` en `src/components/SessionPriceCalculator.astro`.

Ambos usan `POST`, `data-netlify="true"`, honeypot, campo oculto `form-name` y
acción `/thank-you/`. La entrega por correo se configura en Netlify Dashboard;
un campo oculto de recipient no crea la notificación.

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
- `src/components/KindWords.astro`: consume el endpoint y usa un fallback sin
  número si no hay resumen válido.

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
notificaciones reales siguen dependiendo del Dashboard de Netlify.

## Comandos

```bash
npm install
npm run dev
npm run build:local
npm run build
npm run preview
npm run optimize:images
npm run audit:lighthouse
```

`npm run build:local` inicia Tina local, compila Astro, instala headers de
staging y ejecuta `scripts/validate-site.mjs`. `npm run build` realiza además
indexación/build Tina según el entorno de deploy.

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
  formularios, placeholders y el máximo de cuatro enlaces internos de body.

## SEO/indexación actual

En `release`, el manifiesto actualmente permite sitemap para cuatro rutas:

- `/`
- `/family-photographer-tri-cities-wa/`
- `/journal/family-photo-locations-tri-cities/`
- `/portfolio/`

`llms.txt` incluye Homepage, Family y Family Photo Locations; Portfolio está
excluido de llms. Las otras 16 rutas siguen `draft/noindex`. `/thank-you/` es
noindex permanente. Los headers release de Journal deben enumerar las rutas
draft explícitamente; un wildcard `/journal/*` bloquearía también los artículos
publicados. En
`staging`, sitemap queda sin URLs indexables y todo el sitio lleva noindex.

`Base.astro` emite WebSite, LocalBusiness, breadcrumbs y schema por familia.
No se emiten `Review` ni `AggregateRating` hasta verificar atribución y conteo.

## Assets y rendimiento

- Fuentes WOFF2 locales en `public/fonts/`; no se depende de Google Fonts en
  runtime.
- Fotografías optimizadas en AVIF/WebP/JPEG con dimensiones y `sizes`.
- GSAP no es una dependencia global. Los scripts de interacción se cargan solo
  en las rutas/composiciones que los necesitan.
- Portfolio carga prioritariamente solo las páginas visibles iniciales.
- El preloader usa SVG inline y Web Animations API; anima transform/opacity,
  respeta reduced motion, permite Escape/Tab y elimina el overlay al finalizar.

## Trampas conocidas

1. La homepage Netlify es la autoridad visual; no rehacerla desde `DESIGN.md` ni
   usar el dominio legado como referencia.
2. `PUBLIC_INQUIRY_NOTIFICATION_EMAIL` no entrega emails. Configurar
   notifications para ambos formularios en Netlify Dashboard.
3. Ejecutar `npm run build:local` puede modificar temporalmente los componentes
   de formularios añadiendo IDs. Revisar `git status` después del build y no
   commitear cambios generados no solicitados.
4. Tina local abre un listener en `::1:4001`; entornos sandbox pueden devolver
   `EPERM`. Fuera del sandbox el build verificado funciona.
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
