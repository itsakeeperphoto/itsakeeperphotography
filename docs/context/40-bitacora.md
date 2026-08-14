# 40 — Bitácora de sesiones

> **Append-only.** Una entrada por sesión al final. Esta primera entrada rescata
> una sesión extensa que abarcó la construcción e iteración de casi todo el sitio.

---

### 2026-08-08 — Codex / GPT-5.6 — Rescate integral y handoff del sitio

- **Objetivo de la sesión:** construir desde la homepage Netlify aprobada un
  sitio editorial completo para It's A Keeper Photography, iterar cada página
  con feedback visual, implementar captación/SEO y, al final, preservar todo el
  contexto para el próximo agente.

- **Qué se hizo:**
  1. Se corrigió la fuente de verdad. El primer entendimiento apuntaba al dominio
     personalizado legado; el usuario aclaró que la fundación es
     `https://itsakeeperphotography.netlify.app/` y que este repo es su deployment.
  2. Se adoptó la paleta Deep Umber/Walnut/Warm Earth/Clay/Muted Olive/
     Weathered Sand/Warm Ivory y se mantuvo el lenguaje editorial de prints,
     arcos, tape, construcción y solapes.
  3. Se expandió la arquitectura a 21 rutas públicas, conservando Homepage y
     Portfolio y creando/organizando servicios, trust, ciudades, Journal y
     utilidades.
  4. Se añadió un manifiesto tipado de páginas, gating draft/ready,
     staging/release, metadata/schema y generación de sitemap/robots/llms.
  5. Se construyeron componentes especializados para Family, Seniors, Newborn,
     Branding, Headshots, About, Investment, Contact, Journal, Richland,
     Kennewick y la guía de locations. Pasco, Reviews, Privacy, Thank-you y otras
     rutas siguen en el renderer genérico mientras están draft.
  6. Se centralizó la apertura visual en `EditorialHero.astro` usando Seniors
     como base elegida por el usuario.
  7. Se iteró la homepage: contraste del inquiry, eliminación de “Frame One…”;
     cards de servicios; bloque local; Meet Lisa con dos fotos superpuestas;
     FAQ/lines; banners/espaciados; footer y navegación.
  8. Se creó la experiencia de reseñas `KindWords.astro`: polaroids arqueadas en
     movimiento continuo, clip de bronce, flip 3D por hover/focus y fallback para
     conteo de Google.
  9. Se implementó el resumen dinámico de GBP con scheduled function, OAuth,
     Netlify Blobs y endpoint público. Quedó pendiente configurar credenciales.
  10. Se creó el preloader cinematográfico de cámara: primero como HTML autónomo,
      después integrado solo en homepage. Tras feedback se eliminó el wordmark
      intermedio para que el shutter revele directamente el sitio.
  11. Se reemplazó el formulario simulado por Netlify Forms reales. Contact se
      convirtió en “session estimates” con selección de servicio, cobertura,
      personas, colecciones, add-ons, desglose sticky y total.
  12. Se consolidaron precios reales en `src/lib/session-pricing.ts`: Newborn sí;
      Pet/Elopement no; valores adicionales aprobados; sin segunda ubicación
      adicional; cinco personas incluidas y $15/person adicional.
  13. Se aclaró que el destinatario real se configura en Netlify Dashboard y no
      mediante hidden field. Producción apunta a `itsakeeperphoto@gmail.com` y se
      había solicitado `globalbridge360@gmail.com` para pruebas.
  14. Se actualizaron copys fuente de Family, Seniors, Headshots, Branding,
      Investment y el artículo de localizaciones. Investment y Locations Guide
      tienen commits recientes y evidencia puntual.
  15. Se realizaron múltiples correcciones visuales solicitadas: líneas sin
      anclaje, procesos superpuestos, FAQs, imágenes aplastadas, papeles rasgados,
      tapes reales, sticky headings, timelines y CTAs descentradas.
  16. Se implementaron redirects de intención, crawler outputs, headers y
      validación de 21 rutas; se añadió Microsoft Clarity.
  17. En el cierre se auditó código/config/contenido/evidencia; se ejecutó
      `npm run build:local` con éxito y se instaló el sistema de memoria en la
      raíz (`AGENTS.md`, `docs/context/`, `scripts/handoff.sh`).

- **Páginas e iteraciones relevantes:**
  - `/senior-photographer-tri-cities-wa/`: rediseño de referencia, corrección de
    confidence line, process ledger, overlap de steps, FAQ conectada y final con
    imagen/delineado.
  - `/family-photographer-tri-cities-wa/`: rediseño editorial, actualización de
    copy y FAQ/final con papel rasgado; sigue siendo el servicio ready.
  - `/newborn-photographer-tri-cities-wa/`: fuente de headings alineada a
    Seniors, imagen enmarcada, arco/proceso, recibo de papel real y ajustes FAQ.
  - `/about/`: varias composiciones de collage, belief/final y hero centralizado.
  - `/branding-photographer-tri-cities-wa/`: rediseño, hero común, correcciones de
    custom/library/rights/audiences/includes/final y actualización de copy.
  - `/headshot-photographer-tri-cities-wa/`: contenido actualizado y hero común.
  - `/journal/`: hub editorial nuevo; se eliminó una línea transversal sin razón.
  - `/investment/`: rediseño con prices/paper/tape, nuevo copy, sticky sections,
    timeline/policies y final en papel.
  - `/richland-wa-photographer/` y `/kennewick-wa-photographer/`: páginas locales
    especializadas, aún no indexables por conocimiento local pendiente.
  - `/journal/family-photo-locations-tri-cities/`: copy actualizado sin inventar
    ubicaciones; implementación reciente en el commit `02fb6a8`.

- **Archivos tocados durante el desarrollo rescatado:**
  - Configuración/arquitectura: `astro.config.mjs`, `netlify.toml`,
    `.env.example`, `package.json`, `tina/config.ts`.
  - Contenido: `content/homepage/index.json`, `content/settings/index.json`,
    `content/pages/*.json`, `content/journal-pages/*.json`,
    `content/testimonials/*.json`, `src/content/pending.ts`.
  - Rutas/modelo: `src/lib/page-manifest.ts`, `src/lib/content-pages.ts`,
    `src/lib/static-content.ts`, `src/lib/session-pricing.ts`,
    `src/content/page-types.ts`, `src/pages/**/*.astro`, `src/pages/**/*.ts`.
  - Componentes: `src/components/*.astro`, especialmente `EditorialHero.astro`,
    `KindWords.astro`, `GuidedInquiry.astro`, `SessionPriceCalculator.astro`,
    `SitePreloader.astro` y las páginas especializadas.
  - Interacción: `src/scripts/cinematic-preloader.ts`,
    `src/scripts/session-price-calculator.ts` y scripts por página.
  - Estilos: `src/styles/*.css`, con hojas dedicadas de cada página.
  - Netlify/SEO: `netlify/functions/*.mts`, `netlify/lib/*.ts`,
    `config/netlify-headers/*`, `public/_redirects`,
    `scripts/validate-site.mjs`, `scripts/install-netlify-headers.mjs`.
  - Assets/evidencia: `public/images/**`, `public/fonts/**`, `artifacts/**`,
    `.artifacts/**`, `.codex-evidence/**`.
  - Handoff de esta fecha: `AGENTS.md`, `README-CONTEXTO.md`, `PROMPTS.md`,
    `docs/context/*.md`, `scripts/handoff.sh`, `.handoff/sessions/.gitkeep`.

- **Commits relevantes inspeccionados:**
  - `6b7005b` instalación inicial del contexto durante esta redacción; apareció
    de forma concurrente y fue preservado.
  - `1881161` merge de Clarity.
  - `02fb6a8` actualización Investment y Journal Locations.
  - `b0c6b16` Microsoft Clarity.
  - `8f120ea` sitemap y errores de indexación.
  - `2389eaf` mejoras finales previas.
  - `8134b1c` iteración reviews.
  - `094ffce` página/inquiry actual.
  - `44d28fc` links de homepage.
  - `637f0c2` loader suave.
  - `f5eb7b5` Journal.
  - `ed3fff4` Branding y Headshot.
  - `5886249` About.
  - `aed3e60` Newborn.
  - `de944e6` Family.
  - `bd9d2c4` Seniors.
  - `0266496`, `bfd9cd1` fases iniciales.
  - El commit final de decisiones/bitácora/backlog será creado por
    `scripts/handoff.sh` después de escribir esta entrada; su SHA no existe al
    redactarla.

- **Qué se intentó y NO funcionó:**
  1. Usar el dominio custom como base visual fue una dirección incorrecta. Se
     descartó después de la aclaración del usuario y no debe repetirse.
  2. Tras instalar Agentation apareció históricamente
     `Failed to load @astrojs/react/server.js` al ejecutar `npm run dev`. La
     instalación actual construye; no se verificó en este cierre la causa exacta
     ni el cambio puntual que lo resolvió. TODO(contexto): documentar la reparación
     exacta si vuelve a reproducirse.
  3. Las primeras review cards quedaron estáticas, sin flip/loop móvil y con
     cuadrados verdes. También un click podía dejarlas abiertas. Esos enfoques
     fueron rechazados y reemplazados por hover transitorio + clip de bronce.
  4. La primera versión del preloader revelaba un wordmark después del flash. El
     usuario lo rechazó; ahora el shutter revela el sitio directamente.
  5. Muchas líneas decorativas quedaron flotando o atravesando texto/fotos sin
     anclaje. Se corrigieron por página; no reintroducir líneas por llenar vacío.
  6. Un hidden field de email no hace que Netlify envíe notificaciones. La entrega
     necesita configuración de Dashboard y aún debe probarse.
  7. El conteo GBP no puede confirmarse en vivo sin credenciales OAuth/IDs. El
     fallback sí funciona; no hardcodear una cifra para ocultar el bloqueo.
  8. El primer `npm run build:local` de este cierre falló con `listen EPERM
     ::1:4001` dentro del sandbox. Ejecutado fuera del sandbox terminó bien.
  9. El build exitoso añadió automáticamente IDs a los dos `<form>` fuente. Como
     el worktree estaba limpio antes y la tarea era documental, esos cambios
     incidentales se revirtieron con patch antes del handoff.
  10. El primer `scripts/handoff.sh` fue rechazado porque iba a incluir el rollout
      completo en el push. Se cambió a una alternativa segura: backup local con
      `*.jsonl` ignorado y publicación exclusiva de `docs/context/`.

- **Descubrimientos:**
  - La documentación previa `docs/final-handoff.md` quedó congelada en el
    2026-07-21; prueba ese estado, no las iteraciones posteriores.
  - El repo tiene 21 rutas aunque el brief original hablaba de 18 principales;
    Portfolio y dos utilidades explican la diferencia.
  - Solo Homepage, Family y Portfolio participan hoy en sitemap de release.
  - El registro `src/content/pending.ts` tiene 40 entradas actuales; una cifra
    anterior de 58 era obsoleta.
  - `content/homepage/index.json` aún tiene la imagen de Headshots vacía.
  - La dirección legada permanece almacenada pero correctamente no renderizada.
  - `README.md` describe una fase antigua y puede confundir a un agente nuevo.
  - La pregunta del usuario sobre cambiar de cuenta motivó instalar esta memoria:
    no se debe confiar en que otra cuenta vea el mismo historial de chat.

- **Quedó pendiente:** todo lo listado en `docs/context/50-backlog.md`, con
  prioridad en resolver contenido de una ruta, revalidar su QA y solo entonces
  cambiarla a ready/index. También configurar Forms/GBP en Netlify y rehacer la
  matriz completa de capturas/Lighthouse antes del cutover.

### 2026-08-08 — Codex / GPT-5.6 — Repositorio oficial y tags de analítica

- **Objetivo:** trasladar correctamente la intervención de analítica al repo
  oficial `itsakeeperphoto/itsakeeperphotography` y evitar futuras confusiones
  con `williammelo533/itsakeeper-astro`.
- **Instrucciones:** `AGENTS.md` declara el remoto oficial, obliga a verificar
  `git remote get-url origin` antes de editar/push y prohíbe enviar este proyecto
  al repositorio alterno. También se corrigieron las dos referencias obsoletas
  en la memoria.
- **Código:** `src/layouts/Base.astro` carga Microsoft Clarity `xyqkkqom4v` y
  Google tag/GA4 `G-0YW8M601L1` desde el `<head>` compartido de las 21 rutas.
- **Descubrimiento:** los commits históricos de Clarity crearon y luego borraron
  un `Base.astro` en la raíz; nunca actualizaron el layout real bajo `src/`, por
  lo que la documentación anterior describía una integración inexistente.
- **Verificación:** se ejecutó `npm ci`; `npm run build:local` terminó con
  `Validated 21 public routes in staging mode.` y el HTML generado contiene
  cada ID en las 21 rutas. El remoto inspeccionado coincide con el oficial.
- **Incidencias:** el primer build no tenía dependencias; después el sandbox
  bloqueó el listener Tina `::1:4001`. La misma orden autorizada fuera del
  sandbox pasó y no dejó cambios fuente incidentales.
- **Pendiente:** verificar recepción real tras el deploy, decidir el tratamiento
  del tráfico de staging y considerar ambas herramientas en la revisión humana
  de Privacy/consentimiento. Después continúa Seniors.

### 2026-08-08 — Addendum — Handoff saneado y push bloqueado

- El primer `scripts/handoff.sh` creó el commit local `b324fb2`, pero este clon
  carecía de `.handoff/sessions/.gitignore` y añadió un transcript `*.jsonl`.
- El push fue rechazado con HTTP 403 antes de transferir el commit: GitHub usó la
  identidad `williammelo533`, que no tiene permiso en el repositorio oficial.
  `gh auth status` además reportó que su token estaba inválido.
- El transcript se retiró únicamente del índice y sigue disponible en la máquina
  local. Se añadió `.gitignore`, exclusión por pathspec, validación de archivos
  rastreados/preparados y la prohibición correspondiente en `AGENTS.md`.
- El commit local se sanea antes del próximo intento. Para publicar, autenticar
  `gh` con una cuenta autorizada mediante `gh auth login -h github.com`, revisar
  `gh auth status` y retomar el push a `origin/main`.

### 2026-08-08 — Codex / GPT-5.6 — Guía de localizaciones v2

- **Objetivo:** actualizar
  `/journal/family-photo-locations-tri-cities/` con el documento editorial v2,
  usando la homepage y `DESIGN.md` como autoridad visual, sin inventar imágenes
  ni datos.
- **Contraste:** `content/pages/journal-family-locations.json` ya renderizaba el
  copy v2; la contradicción estaba en `paginas/15-journal-locations.md`, que aún
  contenía la lista v1 de doce lugares y marcadores de validación.
- **Contenido:** se sustituyó la fuente v1 por el adjunto exacto, verificado con
  `cmp`. No se modificó el copy renderizado, el schema, las fotografías ni los
  cuatro enlaces internos. `[FECHA]` sigue registrado y la ruta permanece
  `draft/noindex`.
- **Diseño:** se conservaron la composición, paleta, tipografías, arcos y
  fotografías existentes. Se corrigieron dos usos móviles de `--space-7`, token
  inexistente, por el token oficial `--space-8`.
- **Herramientas de diseño:** `frontend-design` y `emil-design-eng` fijaron una
  dirección de lectura editorial sin rediseño; `impeccable` devolvió cero
  hallazgos en su detector final; `playwright-cli` cubrió 1440×1000, 1200×900,
  900×900 y 390×844.
- **Verificación:** `npm run build:local` terminó con 21 rutas validadas. En los
  cuatro viewports no hubo overflow; cargaron 20/20 imágenes, aparecieron
  exactamente cuatro enlaces internos y cinco FAQs, el primer foco de teclado
  tuvo outline visible y la consola quedó en cero errores/advertencias.
- **Evidencia:** cuatro capturas full-page JPEG quedaron en
  `.codex-evidence/journal-locations-2026-08-08/`. Los PNG temporales de QA se
  movieron a `/private/tmp/itsakeeper-journal-locations-png.GtzYXx/` y no se
  incluyen en git.
- **Incidencia:** el primer build dentro del sandbox falló con `listen EPERM
  ::1:4001`; la misma orden autorizada fuera del sandbox pasó sin cambios fuente
  incidentales.
- **Pendiente:** Lisa debe confirmar la fecha editorial real. Solo después se
  puede retirar `[FECHA]` y evaluar `ready/index` con un nuevo build y QA.

### 2026-08-08 — Addendum — Commit creado, push rechazado

- `./scripts/handoff.sh "actualiza guia de localizaciones v2"` creó el commit
  local `72bd789` con código, contexto y cuatro capturas finales.
- El push a `itsakeeperphoto/itsakeeperphotography` falló con HTTP 403 porque
  GitHub autenticó esta terminal como `williammelo533`, que no tiene permiso de
  escritura. No se transfirió el commit.
- El usuario había publicado `5a5a063` por otro método autorizado; repetir ese
  método para los commits locales pendientes y confirmar que `main` queda
  sincronizada con `origin/main`.

### 2026-08-08 — Codex / GPT-5.6 — Locations Guide lista para producción

- **Objetivo:** retirar todos los pendientes de
  `/journal/family-photo-locations-tri-cities/`, usar la fecha aprobada
  `2026-08-08`, aplicar seis correcciones visuales, añadir una foto autorizada y
  habilitar `ready/index`, sitemap, llms y schema completo.
- **Contenido/gating:** el JSON y ambos manifiestos quedaron `ready/index`; se
  eliminó `[FECHA]` de pending y del documento fuente. El criterio de spots
  anónimos quedó cerrado, no pendiente. El release header dejó de bloquear todo
  `/journal/*` y ahora protege de forma explícita el hub y los tres artículos
  draft canónicos.
- **Schema/crawlers:** Article incluye fechas, imagen, `mainEntityOfPage`, autor
  y publisher. El artefacto contiene cinco JSON-LD parseables: LocalBusiness,
  WebSite, Article, FAQPage y BreadcrumbList. Sitemap incluye la guía con
  `lastmod 2026-08-08`; llms la incluye y Portfolio permanece excluido.
- **Diseño:** “Four Kinds” pasó de offsets irregulares a una retícula desktop /
  tablet / móvil contenida; se retiraron las líneas de session fit y winter; se
  redujeron las escalas de Seasons para eliminar el solapamiento; “I’ll find the
  light” cambió a deep umber con contraste 7.10:1.
- **Asset:** mediante Google Drive se seleccionó `010A6353 copy.jpg` del folder
  autorizado “Family Session - Richland”. Se importó como
  `journal-locations-final-family-richland-tricities.jpg` a 2400×1600; el build
  genera WebP 400/640/960/1440. Desktop usa fondo con wash y móvil conserva el
  encuadre 3:2 completo.
- **Herramientas:** `frontend-design`, `emil-design-eng` y `DESIGN.md` fijaron la
  dirección; `impeccable` devolvió `[]`; `playwright-cli` verificó 1728×963,
  1440×1000, 1200×1000, 900×1000 y 390×844.
- **Verificación:** overflow horizontal 0, Seasons overlap 0, línea fit 0 px,
  pseudo winter `none`, consola sin errores. Los builds release y staging
  terminaron con `Validated 21 public routes` y mantuvieron sus gates opuestos.
- **Incidencias:** Tina no permite un build mientras `npm run dev` ocupa 9000;
  se detuvo el servidor local antes de las dos corridas. No se ejecutó deploy,
  DNS ni cambio externo de Netlify.
- **Siguiente paso:** crear el commit de handoff, publicar con identidad GitHub
  autorizada y verificar el artefacto desplegado en el dominio final.

### 2026-08-08 — Addendum — Handoff de producción creado, push rechazado

- `./scripts/handoff.sh "publica guia de localizaciones lista para produccion"`
  creó el commit local `8d5d84f` con código, contenido, asset y memoria.
- El push al remoto oficial fue rechazado con HTTP 403: GitHub autenticó esta
  terminal como `williammelo533`, sin escritura en
  `itsakeeperphoto/itsakeeperphotography`.
- No se transfirieron cambios ni se ejecutó deploy. Este addendum se commitea
  localmente para que el próximo agente vea el bloqueo exacto; el usuario puede
  publicar los cuatro commits adelantados con su método autorizado.

### 2026-08-08 — Codex / GPT-5.6 — Rediseño editorial de “Four Kinds”

- **Objetivo:** rediseñar únicamente
  `#the-four-kinds-of-locations-that-work-here` siguiendo dos referencias
  adjuntas, con homepage y `DESIGN.md` como autoridades y sin inventar fotos ni
  copy.
- **Dirección:** se tradujeron las referencias a un contact sheet de 12
  columnas: 01 dominante, 02 horizontal desplazada, 03 como único arco y 04
  como única impresión con mat. Se rechazaron tape, rasgados, speckles,
  rotaciones, sombras y texturas añadidas.
- **Contenido y semántica:** se conservaron los cuatro párrafos y fotografías;
  se corrigieron dos alt texts que afirmaban movimiento/orchard no visibles, se
  sincronizó la fuente editorial y cada card quedó asociada a su `h3` mediante
  `aria-labelledby`.
- **Responsive:** desktop mantiene la asimetría; 900 px usa 2×2; 390 px usa una
  columna con ambos paisajes 3:2. El fragmento reserva el header sticky mediante
  `scroll-margin-top`.
- **Verificación:** Playwright aprobó 1728×963, 1440×1000, 1200×1000, 900×1000
  y 390×844: overflow de documento/sección 0, solapamiento siguiente 0, cuatro
  imágenes completas, labels contenidos, orden de headings correcto y consola
  sin errores. Impeccable layout devolvió `[]`.
- **Build:**
  `SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run build:local`
  terminó con `Validated 21 public routes in release mode.` El primer intento
  dentro del sandbox falló por el listener Tina; se detuvo solo el proceso local
  obsoleto y la corrida autorizada pasó.
- **Git:** la implementación visual quedó en `c663d68` (`locations updated`) y
  la sincronización de descripciones literales en `fe1602d`. Al iniciar este
  cierre `main...origin/main` estaba sincronizado; por orden del usuario no se
  ejecutó push y el contexto se cierra con otro commit local.

### 2026-08-08 — Codex / GPT-5.6 — Richland v2 con gate fotográfico intacto

- **Objetivo:** reemplazar `/richland-wa-photographer/` con el documento v2,
  contrastarlo con runtime, respetar homepage/`DESIGN.md` y las dos referencias
  editoriales, y verificar 1440, 1200, 900 y 390 px sin inventar datos o fotos.
- **Contenido:** v2 sustituye Howard Amon/Badger Mountain por la residencia de
  Lisa y veinte años observando la luz. Se conservaron hero, residencia,
  Twenty Years, cinco servicios, planning, cuatro FAQ y CTA. Canyon Street y la
  dirección completa se omitieron conforme a ADR-019/032.
- **Gate:** la única entrada Richland en `src/content/pending.ts` es la galería
  de 6–10 sesiones reales. “Recent Richland Sessions” no se renderiza sin
  image+alt verificados; la ruta continúa `draft/noindex`, fuera de sitemap y
  llms, con meta y `X-Robots-Tag` noindex.
- **Diseño:** `frontend-design` y `emil-design-eng` fijaron una superficie
  Persuade/Read; `impeccable` condujo el “light ledger” de 12 columnas, un arco,
  grandes paisajes, directorio lineal y whitespace. Se retiraron tape,
  rotaciones, papel rasgado, sombras y recortes verticales de paisajes.
- **Fotografía:** se reutilizaron únicamente assets existentes autorizados; los
  alts locales se limitaron a fotografías con evidencia Richland previa y el
  resto quedó literal/genérico. Los marcos conservan ratios 3:2, 9:5, 3:4 y
  15:19; no se creó ni importó ningún asset.
- **Schema/SEO:** release contiene LocalBusiness, WebSite, WebPage,
  BreadcrumbList y FAQPage parseables. FAQ visible/schema coincide 4:4;
  LocalBusiness publica Richland/WA/US sin `streetAddress`; no aparecen Howard
  Amon, Badger Mountain, Canyon Street ni una galería falsa.
- **Verificación:** builds staging y release terminaron con
  `Validated 21 public routes`; detector Impeccable layout devolvió `[]`.
  Playwright release aprobó 1440×1000, 1200×1000, 900×1000 y 390×844: overflow
  0, gaps 0, 11/11 imágenes, H1 única, controles principales ≥44 px, focus
  visible, FAQ por teclado, reduced motion y consola sin mensajes.
- **Incidencias:** el sandbox bloqueó el listener Tina `::1:4001`; además un
  hijo del dev server quedó en 9000 tras `Ctrl-C`. Se identificó y detuvo solo
  ese proceso; las dos corridas autorizadas pasaron y no dejaron cambios fuente
  incidentales.
- **Git:** la tarea comenzó en `7032ead`, con `main` dos commits delante de
  `origin/main`. La implementación quedó en `f23ae47`; este cierre documental
  añade un segundo commit local. Por orden del usuario no se ejecutó push,
  deploy ni cambio externo y `main` termina cuatro commits delante del remoto.
- **Finish review:** la primera revisión independiente detectó dos gates que la
  métrica del contenedor no mostraba: “Photographer” se recortaba a 390 px y el
  directorio convertía `<main>` en diez anchors. Se redujo únicamente la escala
  móvil Richland, el hero pasó a botón de scroll y el directorio a índice
  visual. La nueva evidencia confirma la palabra completa, cuatro anchors
  exactos, foco movido a `#richland-final`, overflow 0 y consola limpia en los
  cuatro viewports. Un finish reviewer fresco posterior devolvió `PASS` sin
  hallazgos materiales.

### 2026-08-08 — Codex / GPT-5.6 — Directorio Richland enlazado y animado

- **Objetivo:** responder al feedback de convertir el listado “What I
  Photograph in Richland” en navegación real hacia las cinco páginas de
  servicio y añadir una animación que comunique la interacción.
- **Implementación:** cada fila completa es un anchor nativo alimentado por los
  hrefs ya presentes en `content/pages/richland.json`. El indicador es una
  flecha SVG; hover usa un barrido horizontal, desplazamiento mínimo del título
  y la flecha, y press reduce la flecha. No se añadió JavaScript ni dependencia.
- **Accesibilidad:** el nombre accesible conserva servicio y detalle, las filas
  superan 44 px, el foco se muestra de inmediato y Enter navega. Reduced motion
  reduce la duración a `0.01ms` y elimina transforms. Los números cambiaron de
  Weathered Sand (2.43:1) a Warm Ivory (4.61:1) tras revisión independiente.
- **Decisión:** ADR-033 permite nueve anchors internos solo en esta ruta: tres
  de prosa, cinco del directorio y Contact final. ADR-006 permanece como regla
  general; el hero sigue siendo botón de scroll.
- **Verificación:** Playwright confirmó 1728×963 y 390×844 con cinco destinos
  exactos, targets 1344×116 y 366×164 px, overflow 0, foco de 2 px, navegación
  con Enter y movimiento reducido. Release y staging terminaron con
  `Validated 21 public routes`; un release adicional confirmó el contraste.
- **Operación:** implementación en `1ddd9ba`; el cierre queda en un segundo
  commit local. Por orden del usuario no se ejecutó push, deploy ni cambio
  externo. Tampoco se ejecutó `./scripts/handoff.sh`, porque su push incorporado
  contradice la instrucción vigente de crear solo commits locales.

### 2026-08-08 — Codex / GPT-5.6 — Richland publicada sin gate de galería

- **Objetivo:** aplicar la decisión del usuario de añadir la galería más tarde
  y publicar ahora `/richland-wa-photographer/` como `ready/index` con entrada
  en sitemap.
- **Gates:** contenido y manifiestos pasan a `ready/index` con `lastModified:
  2026-08-08`; release elimina el `X-Robots-Tag` específico de Richland. El
  validador espera ahora cinco URLs en sitemap, cuatro en `llms.txt` y falla si
  reaparece ese header noindex.
- **Galería:** `pending` del JSON queda vacío y se elimina la entrada Richland de
  `src/content/pending.ts`. “Recent Richland Sessions” permanece condicional y
  ausente; el backlog la conserva como mejora opcional con procedencia y alt
  literal obligatorios cuando se añada.
- **Release:** `Validated 21 public routes`; meta robots index, canonical `www`,
  Richland tercera en sitemap con `lastmod 2026-08-08`, cuatro URLs en llms y
  ningún header noindex para la ruta.
- **Schema:** parsean LocalBusiness, WebSite, WebPage, BreadcrumbList y FAQPage;
  FAQ visible/schema 4:4, breadcrumb 2 ítems, sin `streetAddress`, Review ni
  AggregateRating.
- **Staging:** `Validated 21 public routes`; meta/header global noindex,
  canonical Netlify, sitemap vacío y llms de preview.
- **Entorno local:** el dev server existente se detuvo solo para liberar Tina y
  quedó restaurado en `http://localhost:4321/` después de los builds.
- **Git:** implementación en `04c93ae`; el cierre se registra en un segundo
  commit local. No se ejecutó push, deploy, DNS ni `./scripts/handoff.sh` porque
  el usuario ordenó commits locales únicamente.

### 2026-08-08 — Codex / GPT-5.6 — Arranque reconciliado de Kennewick v2

- **Objetivo confirmado:** el documento externo Kennewick v2 reemplaza v1; la
  galería se añadirá después y no bloquea `ready/index` ni sitemap.
- **Estado Git real:** `main` y `origin/main` coinciden en `fca4196`; el usuario
  publicó fuera de Codex los ocho commits que la memoria anterior registraba
  como locales. Worktree limpio al iniciar.
- **Entorno:** dev y Tina continúan activos en `localhost:4321` y `:9000`; se
  corrigió la frase final de `20-estado.md` que los describía como detenidos.
- **Decisión:** ADR-035 fija la fuente v2, mantiene la galería opcional, prohíbe
  atribuir portfolio genérico a Kennewick y limita a esta ruta la excepción de
  nueve enlaces internos. No se modificó código ni se ejecutó push.

### 2026-08-08 — Codex / GPT-5.6 — Kennewick v2 publicada y verificada

- **Objetivo:** reemplazar `/kennewick-wa-photographer/` con el documento v2
  definitivo, diferenciar la página por estilo, posponer la galería local sin
  bloquear producción y terminarla `ready/index` con sitemap, schema y QA.
- **Contenido:** se retiraron v1, Columbia Park, spots exactos, fallbacks y
  placeholders. Se conservaron hero, Ten Minutes, Light and Airy, What Works,
  cinco servicios, cuatro FAQ y CTA con el copy aprobado completo. Los dos
  énfasis con asteriscos se convierten a `<em>` sin alterar el texto visible.
- **Prueba fotográfica:** se reutilizaron cinco fotografías autorizadas como
  portfolio general de Tri-Cities, con alt literal. Ninguna se atribuye a
  Kennewick. La galería futura no renderiza heading, wrapper ni espacio hasta
  recibir ítems completos con procedencia y alt verificados.
- **Diseño:** `frontend-design` y `emil-design-eng` fijaron “Warm Proof / Tonal
  Contact Sheet”; `impeccable` preservó la homepage y `DESIGN.md`. El hero es
  split oscuro y la única firma es un panorama que hace contacto con un arco;
  no se copiaron tape, rasgados, rotaciones, sombras, gradientes ni texturas de
  las referencias. El detector final devolvió `[]`.
- **Navegación/a11y:** `<main>` contiene exactamente nueve anchors — tres de
  prosa, cinco filas de servicio y CTA final—; el hero usa un botón de scroll.
  FAQ usa controles nativos y comparte datos 4:4 con FAQPage. Foco, Enter,
  targets y reduced motion tienen estados verificados.
- **Publicación/schema:** ambos manifiestos y el contenido quedaron
  `ready/index`, `lastModified: 2026-08-08`; release elimina su header noindex y
  publica seis URLs en sitemap y cinco en llms. Parsean LocalBusiness, WebSite,
  WebPage, Service, BreadcrumbList y FAQPage, sin `streetAddress`, Review ni
  AggregateRating.
- **Playwright:** 1440×1000, 1200×1000, 900×1000 y 390×844 aprobaron overflow
  0, cinco imágenes completas, H1 contenida, galería ausente, targets móviles
  ≥96 px y consola sin errores. La primera ronda reveló recorte/colisión de
  “Photographer” a 900/390; se ajustó la retícula/escala y la segunda confirmó
  `scrollWidth === clientWidth` e intersección 0.
- **Build y revisión:** staging y release terminaron con
  `Validated 21 public routes`; el finish reviewer independiente devolvió PASS
  en copy/proof, responsive, craft, a11y/motion y SEO/release, con
  `VERDICT: SHIP` y ningún defecto material.
- **Git/operación:** la implementación quedó en `b65c3c5`; ADR-035 y el arranque
  están en `8a0e467`. Este cierre crea un tercer commit local. No se ejecutó
  push, deploy, DNS ni `./scripts/handoff.sh` por instrucción del usuario. El
  servidor Tina/Astro se restauró en `http://localhost:4321/`.

### 2026-08-09 — Codex / GPT-5.6 — Dirección visual Kennewick reconciliada

- **Feedback:** el usuario rechazó el hero split y pidió que Kennewick adopte
  fielmente el lenguaje de `/senior-photographer-tri-cities-wa/`, con revisión
  previa obligatoria mediante `image-to-code` y las referencias suministradas.
- **Decisión:** ADR-036 fija `EditorialHero`, la gramática editorial de Seniors
  y la ausencia de una frase script inventada. Copy v2, nueve anchors, schema,
  galería opcional y gates de publicación permanecen intactos.
- **Reconciliación:** `00-proyecto.md` ya registra correctamente que Richland y
  Kennewick son las dos excepciones aprobadas al máximo general de cuatro
  enlaces en `<main>`.
- **Estado:** no se modificó runtime. La implementación queda deliberadamente
  pausada hasta generar y aprobar tres composiciones frescas según
  `image-to-code`/Impeccable. No se ejecutó push.

### 2026-08-09 — Codex / GPT-5 — Optimización de bandwidth y build

- **Objetivo:** reducir consumo de transferencia y duración del build Netlify
  sin borrar fotografías usadas en producción.
- **Diagnóstico:** `public/` ~130 MiB, `dist/` ~148 MiB y cuatro JPEG de 24 MP
  entre 14.6 y 28.1 MiB. Producción servía el Open Graph de Locations con
  15,291,345 bytes; su variante WebP era 139,936 bytes. El pipeline Sharp limpio
  tardaba 114.80 s por procesar 172 salidas secuenciales con effort 6.
- **Implementación:** `bd833f6` optimiza once JPEG usados con máximo 2400 px y
  700 KiB, preserva metadatos existentes, paraleliza variantes con cuatro
  workers/effort 4 e integra el guard en ambos builds. Se retiraron diez assets
  sin referencias verificadas; siguen recuperables desde Git.
- **Resultado:** `public/` ~40 MiB, `dist/` ~51 MiB, fase limpia 5.09 s y
  Tina+Astro 35.62 s. Chrome headless midió entre 64–338 KiB de imágenes en el
  viewport inicial de cuatro rutas críticas y máximo 784 KiB al recorrer una
  ruta completa en desktop.
- **QA:** release y staging validan 21 rutas; cero referencias `/uploads/`
  faltantes; dry-run confirma todos los JPEG dentro del límite; `git diff
  --check` pasa. PageSpeed respondió 429 por cuota, por lo que no se inventaron
  CWV. Evidencia local ignorada en
  `artifacts/audits/bandwidth-2026-08-09/` y `.seo-cache/`.
- **Operación:** no se hizo push ni deploy. Netlify redirige hoy `www` al apex
  mientras el repo genera canonical `www`; se documentó sin tocar DNS.

### 2026-08-09 — Codex / GPT-5 — Rediseño editorial Kennewick implementado

- **Objetivo:** reemplazar el hero split rechazado de
  `/kennewick-wa-photographer/` por el lenguaje visual aprobado de Seniors,
  incorporar media Drive verificada y conservar sin cambios el copy y los
  contratos SEO de la service page.
- **Auditoría de media:** las dos carpetas Kennewick contenían 22 fotografías
  pero solo seis sesiones según XMP. Se excluyeron `010A4575copy.jpg` y
  `sennior-session-benton-city.jpg` por pertenecer a la misma sesión identificada
  como Benton City; dos capturas restantes ya existían en producción. Quedan
  cinco sesiones candidatas, sin Family/Newborn/Branding/Headshots, por lo que
  la galería sigue ausente. Los originales de auditoría bajaron de ~264 MiB a
  ~8.9 MiB y permanecen ignorados.
- **Image-first:** antes del código se generaron y revisaron siete composiciones
  —hero, introducción, estilo, setting, servicios, FAQ y cierre—. Se registran
  como canónicas en `.impeccable/mocks/`; sus píxeles generados no se usan en
  producción. El brief local ya no describe la dirección split anterior.
- **Implementación:** Kennewick reutiliza `EditorialHero` con H1 en dos líneas,
  cero script y botón hacia `#kennewick-final`; el componente compartido omite
  ahora el nodo script cuando no hay contenido y conserva whitespace explícito
  entre líneas. El cuerpo usa arco de Lisa, un solo collage, bloque local
  text-led, directorio con cinco links y retrato, FAQ `<details>/<summary>` con
  H3 reales y cierre full-bleed.
- **Fotografía:** se añadieron seis JPEG fuente nuevos, todos de 1600–2400 px y
  226–591 KiB, más variantes WebP 400/640/960/1440. Las seis tomas representan
  cuatro sesiones seguras. No se borró ni reemplazó ninguna fotografía ya usada
  en producción.
- **SEO/publicación:** copy, title, description, H1, seis H2, tres enlaces de
  prosa, cinco servicios, Contact final, FAQ/schema 4:4 y un solo `Service`
  permanecen intactos. `<main>` tiene nueve anchors y el hero cero. La galería
  vacía no genera DOM. Kennewick continúa `ready/index` y `lastModified` pasa a
  `2026-08-09` en ambos manifiestos.
- **QA visual:** Playwright aprobó 1440×1000, 1200×1000, 900×1000 y 390×844 con
  `scrollWidth === clientWidth`, H1 exacta en dos líneas, seis H2 contenidos,
  nueve anchors y todas las imágenes cargadas. El CTA del hero mueve foco al
  cierre respetando header/scroll margin; el segundo FAQ abre con Enter; los
  cinco destinos son canónicos. Reduced motion deja transforms en `none` y
  transiciones en `0.01ms`. Los pares tonales principales miden 4.61:1–9.44:1.
- **Build:** `npx astro build`, instalación de headers y
  `scripts/validate-site.mjs` pasan en staging y release con 21 rutas. El build
  Tina integral no se duplicó porque el dev server del usuario ya ocupaba
  `:9000`; se dejó activo y se compiló Astro directamente. El detector final de
  Impeccable devuelve `[]` y `git diff --check` pasa. La única consola externa
  fue un HTTP 400 de Clarity bajo la red restringida; no hubo errores locales.
- **Operación:** se cerraron únicamente el navegador de QA y el servidor Astro
  temporal `:4322`; Tina/Astro del usuario en `:4321/:9000` quedó intacto. No se
  ejecutó push, deploy, DNS ni `./scripts/handoff.sh`; este cierre queda en un
  commit local para que el usuario lo publique.

### 2026-08-09 — Codex / GPT-5 — Pasco A+C publicado con media verificada

- **Objetivo:** rediseñar `/pasco-wa-photographer/` como service-area page SEO,
  conservar la marca actual, usar el hero de Seniors/Newborn/Family, generar la
  dirección visual antes del código y revisar las carpetas Drive Pasco.
- **Auditoría:** la versión anterior era thin —~128 palabras, tres links, una
  FAQ y cero fotografías en `<main>`— y seguía `draft/noindex`. El lote Drive
  contenía 23 originales de once sesiones según folder, XMP e identidad visual.
  Se eligieron diez sesiones distintas; `010A6962copy.jpg` se excluyó por
  colisión visual con producción.
- **Image-first:** el usuario aprobó A+C. A aporta Open Horizon, hero/paper edge
  y arco introductorio; C aporta Long Horizon Archive, ledger y ritmo de
  galería. Se generaron tres comps y nueve referencias de sección, registradas
  en `.impeccable/`; ninguna imagen generada se usa en producción.
- **Implementación:** `PascoPage.astro` compone hero compartido sin script,
  intro, rivers, farmland, cinco servicios, galería 10/10, seasons, FAQ 4:4 y
  CTA full-bleed. El hero es botón hacia `#pasco-final`; `<main>` contiene ocho
  anchors exactos. La primera FAQ se corrigió de “No” a “Yes” para responder
  coherentemente si Lisa viaja a Pasco.
- **Fotografía:** se añadieron diez JPEG de 321–709 KB, todos ≤2400 px/700 KiB,
  y 40 WebP 400/640/960/1440. Representan tres family/large-family y siete
  senior. No se borró, reemplazó ni renombró ninguna foto existente; alts y
  claims no revelan landmarks ni meeting points.
- **SEO/publicación:** Pasco pasó a `ready/index`, `lastModified: 2026-08-09`,
  sitemap/llms y headers release coherentes. Emite WebPage con spatialCoverage,
  un Service Pasco, BreadcrumbList y FAQPage, sin dirección Pasco, coordenadas,
  Review ni AggregateRating. Release contiene siete URLs en sitemap y seis en
  `llms.txt`.
- **Bandwidth:** el import CSS inicial se filtraba por el router compartido.
  Se cambió a un asset Vite `?url` enlazado desde `Base.astro` solo para Pasco:
  desaparecen ~19,957 bytes de HTML en cada ruta editorial ajena y el validador
  bloquea futuros leaks o links rotos.
- **QA:** Tina completo pasó en puertos alternos 4002/9001. Staging y release
  terminaron con `Validated 21 public routes`; Impeccable devolvió `[]`.
  Playwright aprobó 1440, 1200, 900 y 390 px: overflow 0, H1 + ocho H2, ocho
  anchors, diez figuras, cuatro FAQ, texto de lectura ≥16 px, cero imágenes
  rotas, foco marfil de 3 px, reduced motion y consola local limpia.
- **Git/operación:** implementación en `2a5adcd`; este cierre añade un commit
  documental. Los previews y navegadores temporales se cerraron y el Tina
  preexistente en `:9000` no se tocó. No hubo push, deploy ni cambio de DNS;
  el usuario mantiene la publicación de los commits locales.

### 2026-08-09 — Codex / GPT-5 — Galerías locales Richland y Kennewick

- **Objetivo:** responder al Page Feedback de Pasco añadiendo una sección de
  sesiones recientes a Richland y Kennewick, con fotografías nuevas de Drive,
  sin borrar media de producción ni inventar procedencia local.
- **Auditoría Drive:** se revisaron únicamente carpetas tituladas Richland o
  Kennewick dentro de `It’s A keeper Photography Assets`. West Richland se
  mantuvo separado. Richland aportó diez sesiones distintas verificadas por
  carpeta, fecha XMP, `OriginalDocumentID` e identidad visual. Kennewick solo
  sostiene cinco sesiones seguras; `010A4575copy.jpg` y
  `sennior-session-benton-city.jpg` permanecen excluidos como una misma sesión
  Benton City.
- **Implementación:** `Recent Richland Sessions` publica 10 figuras en retícula
  4/2/1 y `Recent Kennewick Sessions` 5 figuras con panorama + retícula 3/2/1.
  Ambas usan captions visibles, alt literal, fuentes únicas y cero anchors. Los
  guards de componente rechazan una galería no vacía parcial, incompleta,
  duplicada o enlazada.
- **Media/bandwidth:** se añadieron trece JPEG —diez Richland y tres Kennewick—
  de 5.92 MiB frente a 165.81 MiB de origen, todos ≤2400 px/700 KiB. Se
  generaron 52 WebP 400/640/960/1440; la segunda corrida quedó `up to date`.
  No se borró, reemplazó ni renombró ninguna fotografía existente y no apareció
  ningún duplicado JPEG nuevo.
- **SEO/publicación:** Richland actualiza `lastModified` a `2026-08-09`;
  Kennewick lo conserva. Ambas rutas siguen `ready/index`, con siete H2, nueve
  anchors, CTA hero como botón, FAQ/schema y canonical intactos. Release sigue
  publicando siete URLs en sitemap y seis entradas en `llms.txt`.
- **QA:** el build Tina release pasó en puertos alternos 4002/9001; builds
  staging/release y headers terminaron con `Validated 21 public routes`.
  Playwright CLI aprobó Richland y Kennewick en 1440, 1200, 900 y 390 px: 8/8,
  status 200, 10/5 imágenes y captions, WebP responsive, dimensiones válidas,
  cero clipping, solapamiento, overflow o anchors de galería. Clarity devolvió
  un 400 externo bajo red restringida; no hubo errores locales.
- **Diseño/memoria:** ADR-040 documenta la autorización expresa de cinco
  sesiones Kennewick sin fabricar una sexta y supersede los gates históricos
  correspondientes. Superficies Impeccable, documentos fuente, arquitectura,
  backlog y estado quedaron reconciliados con la implementación real.
- **Git/operación:** la implementación está en `9f293d0`; este cierre añade un
  commit documental local. Los servidores temporales y Playwright se cerraron,
  Tina `:9000` no se tocó y `dist/` quedó en release. No se ejecutó push,
  deploy, DNS ni `./scripts/handoff.sh`; el usuario publica los commits.

### 2026-08-10 — Codex / GPT-5 — Newborn definitiva publicada y documentada

- **Objetivo:** reconciliar la fuente externa v2 y publicar
  `/newborn-photographer-tri-cities-wa/` como una service page definitiva,
  preservando dos regiones ya aprobadas y sin inventar hechos de seguridad.
- **Fuente/copy:** la v2 definitiva externa vive en
  `/Users/williammelo/Documents/Claude/Projects/Its A Keeper Photography/paginas/04-newborn.md`.
  Q53 confirmó sesiones principalmente en casa y exterior según temporada. El
  repositorio la reconcilia en `paginas/04-newborn.md` como autoridad vigente;
  Q41 sobre formación de seguridad queda pendiente no bloqueante y la página no
  publica ese claim.
- **Dirección visual:** el usuario aprobó A+C: A “storybook ledger” como base y
  C “archival proofbook” para `No hard deadline` y el FAQ master-detail. El
  `EditorialHero` y `What Your Newborn Session Looks Like` permanecieron exactos
  en contenido, DOM y geometría. El detector final Impeccable devolvió `[]`.
- **Contrato visible:** un H1 exacto, siete H2, cuatro anchors dentro de
  `<main>` y ocho FAQ nativas. Las ocho preguntas/respuestas coinciden 1:1 con
  las ocho entidades `Question`; además se emiten `WebPage`, `Service`
  detallado y `BreadcrumbList`.
- **Publicación:** la ruta quedó `ready/index`, `lastModified: 2026-08-10`,
  incluida en sitemap release y `llms.txt`; staging conserva noindex global.
  Release contiene ocho URLs en sitemap y siete entradas en `llms.txt`.
- **Media/rendimiento:** se incorporó una sola fotografía Drive verificada,
  `newborn-family-at-home-west-richland.jpg`, optimizada de 13.13 MiB/4000×6000
  a 412 KiB/1600×2400, más variantes WebP responsive ignoradas. El CSS se podó
  de 30,378 a 18,404 bytes (`-39.4%`) y quedó en 3,661 bytes gzip.
- **QA:** los validadores aprobaron 21/21 rutas tanto en staging como en
  release. Playwright aprobó 1440/1200/900/390 sin overflow horizontal, fallos
  de runtime, imágenes rotas ni fallos de foco, y confirmó las dos regiones
  protegidas. Capturas finales ignoradas: `.artifacts/newborn-final/`.
- **Operación:** la implementación está en `b3bb362`. Los builds Tina finales
  usaron `--datalayer-port 9001` porque el servidor largo del usuario ocupaba
  `:9000`; no se detuvo. Este cierre documental permanece pendiente en el
  worktree, sin inventar hash futuro. No se ejecutó push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — Cierre local Newborn confirmado

- **Documentación:** el cierre principal quedó registrado en `128e274`
  (`docs(context): record Newborn rollout`).
- **Estado final:** `20-estado.md` y el backlog se reconciliaron en el commit
  local inmediatamente posterior para retirar el pendiente ya resuelto; usar
  `git log -1` como hash autoritativo de ese commit.
- **Operación:** el worktree queda limpio al terminar este commit. No se hizo
  push, deploy, DNS ni `./scripts/handoff.sh`; el usuario publica los diez
  commits locales posteriores a `ff736c6`.

### 2026-08-10 — Codex / GPT-5 — Geometría final de Newborn, Richland y Kennewick

- **Objetivo:** corregir tres observaciones visuales a 1728×963 sin modificar
  copy, fotografías, schema, indexación ni las composiciones tablet/móvil ya
  aprobadas.
- **Newborn:** `.newborn-final__copy` dejó de imponer un ancho fijo y ahora se
  contrae dentro de la primera pista del grid con `min-width: 0`; el párrafo ya
  no queda cortado por la fotografía contigua en desktop. El H2 ajusta medida y
  escala fluida con `overflow-wrap: normal`, de modo que `EXPECTING?` no se
  divide dentro de la palabra, incluido el borde crítico de 768 px.
- **Richland:** `Recent Richland Sessions` dejó la retícula histórica 4/2/1 y
  adoptó un contact sheet determinista 3/2/1. Desktop distribuye las diez
  sesiones en dos bandas completas de cinco sobre tres columnas lógicas;
  tablet usa dos columnas y móvil una. Las fuentes, captions, alts, orden y cero
  anchors permanecen intactos.
- **Kennewick:** el cierre full-bleed aplica `object-position: 50% 20%` solo
  desde 1051 px para evitar cortar la cabeza del hombre; tablet y móvil conservan
  exactamente el crop previo.
- **QA:** el validador release aprobó 21/21 rutas y el detector Impeccable
  devolvió `[]`. Playwright verificó 1728/1440/1200/900/390 sin overflow,
  solapamientos ni imágenes rotas dentro de las secciones. El único request
  fallido fue la telemetría externa de Clarity en local; no falló ningún recurso
  same-origin.
- **Decisión/memoria:** ADR-042 supersede ADR-040 únicamente en el punto visual
  Richland 4/2/1; los contratos de evidencia local y publicación de ADR-040
  siguen vigentes. La superficie Richland, arquitectura, backlog y estado se
  reconciliaron con la implementación real.
- **Git/operación:** el cambio funcional está en `974d97c`; este cierre
  documental pertenece al commit local inmediatamente posterior. Al completarlo,
  `main` queda doce commits por delante de `origin/main` (`ff736c6`). No se
  ejecutó push, deploy, DNS ni `./scripts/handoff.sh`; el usuario conserva la
  publicación.

### 2026-08-10 — Codex / GPT-5 — Cierre Pasco alineado con Richland

- **Objetivo:** responder al feedback visual de `/pasco-wa-photographer/` y
  convertir `Let's Find Your Light` en la misma invitación full-bleed centrada
  que usa Richland, sin tocar el contenido definitivo ni la evidencia local.
- **Implementación:** `pasco-page.css` reemplazó el panel marfil lateral por la
  retícula Richland de 12 columnas, altura 720/656 px, display marfil, párrafo
  centrado y CTA outlined. El eyebrow decorativo deja de competir con el H2.
  La fotografía, su alt y el anchor `/contact/` permanecen intactos.
- **Crop:** la fuente Pasco 3:2 no puede copiar el focal point de la foto portrait
  Richland. Desktop usa `62% 15%` para conservar las cabezas adultas; móvil
  mantiene `59% 42%`, `cover` y el grupo central. No se heredó el `contain`
  route-wide móvil de Richland.
- **QA:** el build Tina release usó los puertos alternos 4002/9001, el validador
  aprobó 21/21 rutas y el detector Impeccable devolvió `[]`. Playwright comparó
  Pasco/Richland a 1728/1440/1200/900/390: misma altura, pista, escala de H2,
  alineación y superficie; cero overflow, errores de consola, requests
  same-origin fallidos o imágenes rotas. El CTA del hero transfirió foco a
  `#pasco-final`.
- **Decisión/memoria:** ADR-043 supersede ADR-039 solo en la composición del
  cierre. La superficie y manifest A+C retiran el mock con panel de la lista
  canónica, pero lo conservan como referencia histórica.
- **Git/operación:** el cambio funcional está en `ff0a075`. El preview temporal
  `:4323` y Playwright se cerraron; los servidores del usuario `:4321` y `:9000`
  quedaron intactos. No se ejecutó push, deploy, DNS ni `./scripts/handoff.sh`;
  el usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — About A+C publicada con autoridad verificable

- **Objetivo:** rediseñar `/about/` con el copy definitivo, conservar el hero
  exactamente como estaba, integrar autoridad sin badges genéricos y dejar la
  ruta lista para indexación.
- **Auditoría y fuente:** se reconciliaron la fuente externa v2, el JSON, la
  página anterior, las fotografías existentes y siete retratos de la carpeta
  Drive autorizada `MY NEW branding pics ( Lisa )`. La edición original de
  Tri-Cities MOM Magazine agosto/septiembre de 2019 verificó la portada de Lisa.
  La cifra de reseñas, salud, premio sin nombre, Grammy, certificaciones,
  seguro, membresías y URL Google pendiente quedaron fuera del render y schema.
- **Dirección visual:** el usuario aprobó A+C. `Keeper Archive` aporta el arco
  de origen, print y ledger del nombre; `Through Her Lens` aporta retratos,
  método 4/2/1 y prueba editorial. El resto compone historia de la cámara,
  galería con arco central, statement de creencia, retratos Off Camera,
  autoridad de cuatro filas y cierre full-bleed. Los comps son evidencia de
  geometría; ninguna imagen generada se usa como fotografía de producción.
- **Hero protegido:** H1, intro, script, hash CTA, DOM, fondo, dos prints, crops
  y baselines 1440/1200/900/390 permanecen exactos. Las tres fuentes de entrada
  son byte-identical frente a `HEAD`; Playwright bloquea el fingerprint DOM y
  una desviación geométrica mayor a 1 CSS px.
- **Copy y enlaces:** la fuente reconciliada publica un H1, nueve H2 y cinco
  anchors exactos: hash del hero, Seniors en `shy teenager`, Investment en `the
  thinking is done`, la edición Issuu y Contact final. `How I Photograph`
  queda visible como método y `Experience & Recognition` muestra identidad,
  20+ años detrás de cámara, 14 años de negocio, cientos de historias y la
  portada verificable.
- **Media:** se incorporaron cuatro retratos Lisa de 1600×2400, sRGB, metadata
  retirada y 298–487 KiB, más WebP 400/640/960/1440 regenerables. No se borró,
  reemplazó ni renombró ninguna fotografía de producción.
- **SEO/schema:** About quedó `ready/index`, `lastModified: 2026-08-10`, sin
  regla release noindex, dentro de sitemap y `llms.txt`. Emite un único
  `AboutPage`, una sola `Person` Lisa, `BreadcrumbList` y referencia founder
  coherente desde el negocio; no emite `Service`, FAQ, Review, rating, premio,
  credencial, calle ni coordenadas. Release pasa a nueve URLs en sitemap y ocho
  entradas citables.
- **Rendimiento/aislamiento:** `about-page.css` se procesa con `?url` y solo se
  enlaza en About; el contrato de dirección HTML tampoco aparece en las otras
  veinte rutas.
- **QA:** release validó 21/21 rutas. Playwright aprobó 1440×1000, 1200×900,
  900×900 y 390×844: status 200, metadata/canonical/index, headings/links/schema,
  hero exacto, imágenes y WebP cargados, foco, reduced motion, ancho de lectura,
  cero overflow, clipping, solapamientos, errores de runtime o fallos
  same-origin. La revisión final independiente devolvió `PASS` sin defectos
  materiales.
- **Git/operación:** la implementación funcional quedó en `364569a`
  (`feat(about): redesign and publish Lisa story`). Este cierre documental
  permanece en el worktree para el commit local siguiente. `main` está quince
  commits por delante de `origin/main` antes de documentarlo; no se hizo push,
  deploy, DNS ni `./scripts/handoff.sh`. El usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — Fondo del hero About actualizado por aprobación explícita

- **Objetivo:** reemplazar únicamente la fotografía de fondo del hero de
  `/about/` por el retrato señalado por el usuario, sin alterar el resto del
  bloque ni borrar media que siga en producción.
- **Cambio aprobado:** el fondo ahora usa
  `/uploads/about-lisa-photographing-tricities.jpg`, alt literal `Lisa holding a
  camera to her face among dry grass and shrubs.` y crop `50% 24%` en desktop y
  móvil. La fuente anterior `/uploads/lisa-photographer-tricities.jpg` permanece
  sin borrar ni reprocesar porque otras rutas todavía la utilizan.
- **Regresión protegida:** H1, intro, script, CTA hash, dos prints laterales,
  estructura DOM y geometría responsive continúan exactos. El nuevo fingerprint
  DOM es
  `7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`.
- **QA:** Playwright aprobó la revisión solicitada a 1728×997 y las baselines
  1440/1200/900/390; release validó 21/21 rutas e Impeccable devolvió `[]`.
  About conserva `ready/index`, sitemap, `llms.txt`, metadata, schema, enlaces y
  autoridad sin cambios.
- **Git/operación:** el cambio funcional quedó en `bd40b70`
  (`fix(about): update hero background portrait`). `main` está diecisiete
  commits por delante de `origin/main` antes del cierre documental y quedará
  dieciocho por delante tras su commit local. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — Densidad Belief y Method de About corregida

- **Objetivo:** corregir la altura excesiva de Belief y devolver aire al ledger
  Method sin cambiar contenido, DOM, media, schema, hero ni publicación.
- **Causa Belief:** `max-width: 8ch` estaba aplicado al `blockquote` con el font
  del body, generaba una medida cercana a 70 px y convertía la cita display en
  una columna de una palabra. La sección medía 1738.5 px y la cita 495.9 px.
- **Corrección Belief:** el texto display usa `12ch`, `text-wrap: balance` y un
  máximo de `3.75rem`; el `blockquote` deja de limitar la medida y las
  separaciones afectadas bajan de 40 a 32 px. A 1728×997 la sección mide
  1324.2 px, la cita 180 px en tres líneas, y las pistas quedan en 973.8 px de
  media frente a 978.6 px de copy.
- **Causa y corrección Method:** el token inexistente `--space-7` invalidaba el
  shorthand completo de padding. Se reemplazó por un `clamp()` de tokens
  existentes equivalente a 20–32 px; a 1728 resuelve 27.648 px. El ledger
  conserva 4/2/1 y cero overflow.
- **QA:** release validó 21/21 rutas. Playwright About aprobó
  1440/1200/900/390 y la revisión manual 1728×997; Impeccable devolvió `[]`.
  `/about/` conserva `ready/index`, copy, fotografías, schema, enlaces y hero.
- **Git/operación:** el ajuste funcional quedó en `4774a25`
  (`fix(about): rebalance belief and method spacing`). `main` está diecinueve
  commits por delante de `origin/main` antes del cierre documental y quedará
  veinte por delante tras su commit local. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — Breathing room tablet del ledger Method corregido

- **Objetivo:** resolver el único defecto detectado por la revisión visual
  independiente posterior a ADR-046 sin alterar la composición fuera de tablet.
- **Hallazgo:** a 900 px, el texto final del ítem Method 01 quedaba a unos
  8–10 px de la hairline que inicia la segunda fila. El layout seguía en dos
  columnas y sin overflow, pero el ritmo vertical era demasiado apretado.
- **Corrección:** dentro del rango tablet 768–1050 px, delimitado por los
  breakpoints existentes, los ítems 01 y 02 reciben
  `padding-bottom: var(--space-8)`. El selector queda limitado a la primera fila
  del layout de dos columnas; los layouts 4/1, hairlines, DOM, copy, media,
  schema y hero permanecen intactos.
- **Resultado:** a 900 px, la última línea del ítem 01 queda exactamente a
  32 px de la hairline de la segunda fila. La retícula conserva dos columnas y
  overflow horizontal 0.
- **QA:** release validó 21/21 rutas. Playwright About volvió a aprobar
  1440/1200/900/390 e Impeccable final devolvió `[]`. La ruta conserva
  `ready/index`, sitemap, `llms.txt`, metadata y autoridad.
- **Git/operación:** el ajuste funcional quedó en `0f9989c`
  (`fix(about): add tablet ledger breathing room`). `main` está veintiún commits
  por delante de `origin/main` antes del cierre documental y quedará veintidós
  por delante tras su commit local. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-10 — Codex / GPT-5 — Fotografías del portfolio de Homepage renovadas

- **Objetivo:** actualizar las fotografías de las cinco cards de servicios en
  `/`, preservando exactamente la card Seniors solicitada por el usuario.
- **Selección:** Family usa `about-belief-family-golden-hour-tricities.jpg`;
  Newborn, `newborn-family-at-home-west-richland.jpg`; Branding,
  `about-lisa-camera-portrait-tricities.jpg`; y Headshots,
  `review-lisa-griffith-headshot-tricities.jpg`. Seniors conserva ruta, bytes,
  alt y SHA-256
  `1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c`.
- **Media y accesibilidad:** se reutilizaron fuentes ya conformes y variantes
  WebP 400/640/960/1440 disponibles según su tamaño; no se descargó,
  reprocesó, renombró ni borró media. Los cuatro alts nuevos describen
  literalmente sujeto y escena sin claims locales no demostrados.
- **Regresión:** `scripts/validate-site.mjs` protege el contrato fuente/build,
  unicidad, existencia, dimensiones, lazy loading y digest Seniors.
  `scripts/playwright-session-cards.js` cubre las cinco cards, `currentSrc`
  WebP, foco, crops y overflow en 1728/1440/1200/900/390.
- **QA:** optimizadores reportaron fuentes conformes y variantes al día; el
  build release terminó correctamente y validó 21/21 rutas. Playwright confirmó
  cinco columnas en 1728/1440/1200, 2–2–1 en 900 y una columna en 390. La
  revisión independiente devolvió PASS sin defectos P1/P2. Los cinco avisos
  `broken-image` de Impeccable son falsos positivos sobre regex del validador,
  no imágenes del DOM.
- **Git/operación:** la implementación quedó en `82af21f`
  (`feat(home): refresh session card photography`). `main` está veintitrés
  commits por delante de `origin/main` antes de este cierre y quedará
  veinticuatro tras su commit documental local. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-11 — Codex / GPT-5 — Hero y print Biography de Homepage renovados

- **Objetivo:** resolver el feedback visual de `/`: hero más engaging y con un
  fondo menos ruidoso, otra fotografía de Lisa en el print pequeño de Biography
  y confirmación de las cards actuales sin reemplazar Seniors.
- **Hero:** `content/homepage/index.json` usa
  `/uploads/kennewick-couple-open-field-golden-hour.jpg` con alt literal. La
  fuente 2400×1600 se entrega mediante cuatro derivados rastreados: AVIF/WebP
  1440×960 para desktop/tablet y recorte AVIF/WebP 640×1024 para móvil. Los
  focos aprobados son `50% 29%`, `50% 58%` y `50% 42%` según desktop, tablet y
  móvil. Settings y la imagen global de Open Graph/schema no cambiaron; la
  fuente anterior sigue disponible.
- **Meet Lisa:** el retrato principal en arco continúa en
  `/uploads/lisa-photographer-tricities.jpg`. El nuevo campo Tina opcional
  `meetLisa.printImage` desacopla únicamente el print pequeño y conserva fallback
  al retrato. El print usa
  `/uploads/about-lisa-camera-candid-black-white.jpg`, carga lazy WebP 640/400,
  queda centrado, sin zoom, con alt vacío y fuera del árbol accesible.
- **Portfolio y preservación:** ADR-048 permanece exacto. Seniors conserva ruta,
  bytes y SHA-256
  `1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c`.
  No se borraron ni reprocesaron fotografías de producción.
- **Contratos:** Tina y su lock exponen el nuevo campo; el validador fija
  source/build del hero, art direction, prioridades/preloads, print decorativo,
  fallback, cinco cards y digest Seniors. Playwright amplía el guard de
  Homepage a hero, Biography y portfolio.
- **QA:** release validó 21/21 rutas. Playwright aprobó 1728×963, 1440×1000,
  1200×900, 900×900 y 390×844 con una sola petición AVIF del hero, ningún
  JPEG, crop o overflow defectuoso, foco de teclado visible y cero fallos
  same-origin. Clarity puede responder 400 externo tras recargas repetidas y se
  filtra exclusivamente por URL. La revisión independiente devolvió PASS. El
  único detector Impeccable reportó siete falsos positivos `broken-image`
  dentro de regex del validador; el HTML construido y el navegador refutan
  imágenes rotas, por lo que no se documenta como `[]`.
- **Git/operación:** la implementación quedó en `ec4c734`
  (`feat(home): refresh hero and Lisa print`). `main` está veinticinco commits
  por delante de `origin/main` (`ff736c6`) antes del cierre documental y quedará
  veintiséis tras su commit local. No se ejecutó push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva la publicación.

### 2026-08-11 — Codex / GPT-5 — Contact publicado con estimated receipt gated

- **Objetivo:** pedir los datos mínimos después de configurar la sesión y
  revelar el estimado personalizado solo cuando Netlify confirme el envío.
- **Formulario:** `/contact/` conserva una única instancia
  `session-estimate`, detectada estáticamente por Netlify. Nombre y email son
  requeridos; teléfono, timing e historia son opcionales. El mismo HTML mantiene
  honeypot, `form-name`, selecciones crudas, POST y fallback a `/thank-you/`.
- **Gate:** el recibo y el total móvil empiezan `hidden`/locked. JavaScript
  serializa URL-encoded hacia `/`; solo `response.ok` revela el desglose. El
  request congela controles y bloquea doble submit. Un 5xx, fallo de red o
  timeout de 15 segundos conserva datos, restaura controles, enfoca la alerta y
  permite reintentar sin desbloquear.
- **Accesibilidad y privacidad:** las CTA auxiliares enfocan nombre, el éxito
  enfoca el título del recibo y el error su live region assertive. La microcopia
  declara que los datos y selecciones se envían a Lisa mediante Netlify Forms.
  Google tag recibe solo nombres de eventos sin PII. `/privacy/` permanece
  `draft/noindex` como deuda legal separada.
- **SEO/schema:** Contact queda `ready/index`, `lastModified: 2026-08-11`, sin
  header release noindex y dentro de sitemap/`llms.txt`. Emite `ContactPage` y
  breadcrumb Home → Session Pricing Estimate, sin `Service`, calle,
  coordenadas, reseñas ni rating. Release pasa a 10 URLs y 9 entradas citables;
  staging conserva sitemap vacío y noindex global.
- **QA:** los validadores staging/release aprobaron 21/21 rutas. Playwright
  aprobó 1440/1200/900/390 con 2xx, 5xx, fallo de red y doble clic, siempre con
  POST interceptados: un solo POST, unlock exclusivo de 2xx, datos preservados
  en error, retry, freeze tras éxito, foco, fallback sin JavaScript y overflow
  0. No se enviaron datos reales durante QA.
- **Operación externa:** el usuario confirmó que Netlify Forms y las
  notificaciones funcionan en producción. La implementación quedó en
  `dd4a590` (`feat(contact): gate estimate behind inquiry`); este cierre
  documental permanece en el worktree para el commit local siguiente. No se
  hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Media Branding y Headshots renovada con SEO seguro

- **Objetivo:** sustituir la rotación excesiva de fotografías en Branding y
  Headshots por una selección real de las carpetas Drive de Richland,
  Kennewick y West Richland, manteniendo el diseño y sin borrar fuentes usadas
  en producción.
- **Selección:** se incorporaron 18 JPEG nuevos, descriptivos y optimizados.
  Branding pasa de cuatro fuentes repetidas a 13 superficies/11 únicas;
  Headshots, a 14/11. Ninguna fuente aparece más de dos veces, los hero no
  repiten sus cierres y las composiciones internas críticas son únicas.
- **Entrega responsive:** el build regenera 72 WebP en 400/640/960/1440 px. El
  manifiesto `config/image-seo-metadata.json`, su helper XMP y los guards del
  optimizador/validador mantienen sincronizadas fuentes y variantes.
- **SEO, accesibilidad y privacidad:** filenames en kebab-case y alt literales
  describen sujeto/acción. XMP conserva autoría, derechos, título, descripción
  y la ciudad demostrada por la carpeta; excluye GPS, dirección, sublocation,
  fecha, serial, nombre RAW, EXIF/IPTC/ICC e historial/IDs `xmpMM`. El retrato
  neutral permanece sin ciudad.
- **Publicación:** ambas rutas continúan `draft/noindex` y fuera de sitemap y
  `llms.txt`; siguen bloqueadas por entregables, cantidades y duraciones no
  confirmados. La mejora visual no resolvió esos hechos por inferencia.
- **QA:** release validó 21/21 rutas. Playwright aprobó Branding y Headshots en
  1440/1200/900/390 con WebP responsive, alt, diversidad, carga, crops,
  consola/red y overflow correctos; la inspección visual final también pasó.
- **Git/operación:** la implementación funcional quedó en `127c539`
  (`feat(media): refresh branding and headshot photography`). Antes del cierre
  documental, `main` está tres commits por delante de `origin/main` (`b504f84`)
  y quedará cuatro por delante después del commit documental local. Los cambios
  concurrentes ajenos en Homepage, testimonios, Tina, scripts y media
  `review-*` permanecen sin stage y no forman parte de este lote. No se borró
  media, ni se hizo push, deploy, DNS o `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Kind Words actualizado desde PDF y Drive

- **Objetivo:** actualizar fotos, autores y testimonios de `#kind-words` en la
  homepage con las diez reseñas entregadas por el usuario.
- **Fuentes:** se preservó literalmente el copy de `Reviews.pdf`. La auditoría
  visual de Google Drive confirmó originales exactos para Beth, Isabella,
  Allissa, Christina y Hanna; los candidatos de las otras cinco carpetas eran
  personas distintas, por lo que se mantuvo la evidencia exacta del PDF/local.
- **Contenido y media:** la rail pasa de seis a diez reseñas destacadas en orden
  1–10. Se añadieron cinco JSON y siete JPEG 800×1000; tres imágenes exactas ya
  existentes se reutilizan. Charity queda archivada como `featured: false` y no
  se borró ni sobrescribió ningún asset previo.
- **Interacción:** Tina y ambos loaders admiten diez registros. El fallback
  visible es `100+ five-star Google reviews`; GBP solo lo sustituye si devuelve
  rating y conteo válidos. Las tarjetas ahora alternan por tap coarse y
  conservan hover, teclado/Escape, scroll interno y reduced motion.
- **QA:** `npx astro build`, instalación de headers staging y
  `validate:site` pasaron 21/21 rutas. Playwright verificó
  1920/1440/1200/900/390, 10 tarjetas, orden/nombres, carga de imágenes,
  overflow 0, tap front→back→front, foco/Escape y consola sin errores. El build
  Tina integral se omitió porque el servidor largo del usuario ocupa `:9000`;
  no se interrumpió.
- **Git/operación:** implementación funcional en `4cabb15`
  (`feat(home): refresh client testimonials`). Antes del cierre documental,
  `main` está cinco commits por delante de `origin/main` y quedará seis después
  del commit local. No se hizo push, deploy, edición de Drive ni
  `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Contact volvió al estimate transparente y nativo

- **Objetivo:** revertir los dos cambios documentados del estimated receipt
  gated sin despublicar Contact ni perder el historial de ADR-050.
- **Decisión:** ADR-053 supersede ADR-050 solo en gate, AJAX y campos
  opcionales. Contact conserva un único `session-estimate`, pero el recibo y los
  totales desktop/móvil vuelven a estar visibles desde SSR en `$160`; el
  calculador los actualiza antes del contacto. Nombre, email, teléfono e
  historia son requeridos; preferred timing permanece opcional.
- **Transporte:** el form mantiene detección Netlify, honeypot, `POST` y
  `action="/thank-you/"`. JavaScript no intercepta submit ni usa `fetch`,
  `preventDefault`, reveal, locked/unlocked, timeout, retry, freeze tras éxito,
  `submission_id` o eventos personalizados del gate. El navegador envía
  URL-encoded como navegación de documento con y sin JavaScript.
- **Publicación preservada:** Contact continúa `ready/index`,
  `lastModified: 2026-08-11`, dentro de sitemap release con 10 URLs y
  `llms.txt` con 9 entradas. Conserva `ContactPage` y `BreadcrumbList`, sin
  `Service`, calle, coordenadas, reseñas ni rating. Forms y notificaciones
  productivas siguen confirmados por el usuario.
- **QA:** Tina release integral corrió en puertos `4002`/`9001`; validadores
  staging/release aprobaron 21/21 rutas. Playwright aprobó
  1440/1200/900/390 con `$160` → `$955.98`, campos nativos, ausencia del gate y
  POST URL-encoded de documento a `/thank-you/`; no-JS a 390 px conservó SSR,
  validación y selecciones crudas. La revisión final independiente devolvió
  `PASS`. Todos los POST se interceptaron y no hubo envío real.
- **Documentación:** `paginas/10-contact.md` queda en v4 definitiva;
  `DESIGN.md` añade el addendum 15 sin borrar el 13; Arquitectura, Estado,
  Backlog y ADR quedan sincronizados, preservando Reviews y la media
  Branding/Headshots.
- **Git/operación:** la implementación funcional está en `df6db0f`
  (`fix(contact): restore transparent native estimate`). Antes del cierre
  documental, `main` está siete commits por delante de `origin/main`
  (`b504f84`) y quedará ocho después del commit local esperado
  `docs(contact): record transparent estimate reversal`. No se hizo stage,
  commit, push, deploy, DNS, envío real ni `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Senior Timing rediseñado sin publicar hechos pendientes

- **Objetivo:** convertir
  `/journal/when-to-book-senior-pictures-tri-cities/` en una guía image-first
  útil para Seniors, preservando el copy definitivo, la verdad local y el gate
  de publicación.
- **Dirección:** se eligió
  `.impeccable/mocks/senior-timing-03-contact-sheet-field-guide.png`; las comps
  01 ledger y 02 spine quedaron rechazadas. `SeniorTimingPage` reutiliza
  `EditorialHero` y ordena short answer, yearbook guidance, contact sheet
  estacional 4/2/1, essays prácticos, FAQ ledger y cierre full-bleed. El
  contrato visible es 1 H1, 8 H2, 7 H3 y cuatro anchors.
- **Verdad editorial:** la afirmación no demostrada sobre deadlines de escuelas
  Tri-Cities se reemplazó por la recomendación de consultar el deadline
  publicado por cada escuela y trabajar hacia atrás. La frase absoluta sobre
  conflictos escolares pasó a `fewer school-schedule conflicts`; Q54 no se
  renderiza y no se inventa fecha. Los tres pendientes exactos permanecen en
  contenido y validadores.
- **Media:** la ruta usa 11 imágenes, nueve informativas y dos decorativas. Se
  incorporó `west-richland-senior-woodpile-portrait.jpg` desde una carpeta
  West Richland verificada, con fuente optimizada, variantes WebP y XMP
  allowlisted sin GPS ni metadata sensible. Las otras superficies reutilizan
  media existente verificada.
- **SEO y arquitectura:** `journal/[slug].astro` y
  `EditorialPageRouter.astro` resuelven el renderer especializado; el CSS se
  enlaza solo en la ruta mediante `?url`. `Article`, `FAQPage` y
  `BreadcrumbList` no contienen fechas; `og:type=article`. La ruta sigue
  `draft/noindex`, conserva el header release y permanece fuera de sitemap y
  `llms.txt`.
- **QA:** validadores staging/release aprobaron 21/21 rutas y Playwright pasó
  1440×1000, 1200×900, 900×900 y 390×844. Impeccable detectó una transición de
  `width` real, corregida a `transform`; sus diez avisos `broken-image` de regex
  fueron falsos positivos refutados por imágenes cargadas. La revisión final
  independiente devolvió `PASS` sin P1/P2 y sin regresión global de `og:type`.
- **Git/operación:** la implementación funcional quedó en `bcbadae`
  (`feat(journal): redesign senior timing guide`); `main` está nueve commits por
  delante de `origin/main` (`b504f84`). Este cierre documental permanece
  unstaged en el worktree para un commit local separado. No se ejecutó push,
  deploy, DNS ni `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Newborn Comparison rediseñado sin levantar sus gates

- **Objetivo:** convertir
  `/journal/in-home-vs-studio-newborn-photography/` en una comparación editorial
  completa, sin inventar oferta, fecha ni evidencia visual.
- **Dirección y render:** Concept B / Impeccable `The house as archive` quedó
  canónico. `NewbornComparisonPage` se resuelve en SSR y refresh Tina; su CSS
  `?url` se enlaza solo en la ruta. El pase final corrigió crops, espaciado y
  balance responsive del díptico.
- **Copy y media:** se restauró el copy definitivo completo con contrato
  1 H1/8 H2/7 H3/3 FAQ, tres anchors Family → Newborn → Contact y guard literal
  del orden de párrafos. La ruta reutiliza nueve imágenes existentes: siete
  informativas con alt literal y dos decorativas con alt vacío.
- **SEO y gate:** emite un `Article`, un `FAQPage` 1:1 y un `BreadcrumbList`,
  sin fechas ni schema no sustentado. Sigue `draft/noindex`, con header release
  y fuera de sitemap/`llms.txt` por `[VALIDAR CON LISA]`,
  `[VALIDAR: formato exacto que ofrece Lisa]` y `[FECHA]`.
- **QA:** staging y release validaron 21/21 rutas. Playwright aprobó
  1440/1200/900/390 más spot-check 1728; Impeccable final devolvió `[]`.
- **Git/operación:** implementación funcional en `1dd00d3`
  (`feat(journal): redesign newborn comparison guide`). `main` está 12 commits
  ahead antes del cierre documental; los documentos quedan unstaged para un
  commit local separado que lo dejaría ahead 13. No se hizo push, deploy, DNS
  ni `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Branding vs. Headshots publicado con Versus Axis

- **Objetivo:** convertir
  `/journal/branding-photos-vs-headshots/` en una comparación editorial propia
  y publicarla con la fecha autorizada, sin presentar el copy comparativo como
  un paquete contractual ni levantar los gates de las páginas de servicio.
- **Dirección:** Comp C / Impeccable `Versus Axis` quedó canónica. Un headshot
  singular enfrenta una biblioteca Branding asimétrica mediante una costura
  central `VS`; Comp A `Proofbook` y Comp B `Dossier` quedan como alternativas
  auditadas no seleccionadas.
- **Render y copy:** el contrato usa renderer especializado para SSR/refresh
  Tina y CSS `?url` exclusivo de ruta. Preserva el copy definitivo en 1 H1, 8
  H2, 6 H3, tres FAQ, checklist de cinco ítems, tabla semántica de seis filas y
  tres anchors Branding → Headshots → Contact; el control hero es botón local.
- **Media:** once fuentes existentes y únicas, ocho informativas y tres
  decorativas. Las tres superficies hero cargan eager —solo el fondo con
  prioridad alta— y las ocho de cuerpo lazy/async con WebP responsive. No se
  añadió, renombró, recodificó ni borró media compartida.
- **SEO y publicación:** el contrato cambia la ruta a `ready/index`, fecha
  `2026-08-11`, sin header release noindex, enlazada desde el hub y miembro de
  sitemap/`llms.txt`. Emite `Article`, `FAQPage` 1:1 y `BreadcrumbList`; no
  `Service`, `Offer`, duración/precio estructurado, reseñas, rating, calle ni
  coordenadas. Branding y Headshots service permanecen `draft/noindex`.
- **QA:** build release y validadores staging/release aprobaron 21/21 rutas. La
  suite dedicada pasó 1440×1000, 1200×900, 900×900, 390×844 y 1728×963 y dejó
  15 capturas finales. Impeccable devolvió `[]`; la revisión independiente dio
  `PASS` sin P1/P2. Los fixes finales dejan contraste Headshot 4.6104:1, foco
  ledger 13.479:1, tabla/body ≥16 px, costura `VS` vertical en 900–1728 y
  horizontal en 390, `figureGap` 174.375 px ≥ seam 88 px a 1440, y cero
  overflow/runtime. El P3 de evidencia —crops de sección con skip-link/header
  enfocado— no afecta las capturas full-page ni el comportamiento accesible.
- **Build:** un intento default se bloqueó únicamente porque el servidor largo
  del usuario ocupaba `:9000`; no se detuvo. Los builds definitivos se
  ejecutaron aislados y pasaron.
- **Git/operación:** implementación funcional en `b22c581`
  (`feat(journal): publish branding versus headshots guide`). `main` está 14
  commits por delante de `origin/main` (`b504f84`) antes de este cierre; los
  nueve documentos autorizados permanecen unstaged y un commit local
  `docs(journal): record branding versus headshots publication` lo dejaría
  ahead 15. No se hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### 2026-08-11 — Codex / GPT-5 — Journal publicado y checklist de confirmación para Lisa

- **Objetivo:** pasar `/journal/` a `ready/index`, integrarlo en sitemap y
  `llms.txt`, y preparar un documento compartible con toda la información que
  Lisa debe confirmar para decidir la publicación de las rutas restantes,
  excluyendo Reviews y Privacy.
- **Publicación:** Journal conserva firma `overlap`, copy, cuatro cards y orden.
  Locations Guide y Branding vs. Headshots quedan enlazados; Senior Timing y
  Newborn Comparison conservan título/extracto sin anchor. Portfolio y Contact
  completan cuatro enlaces exactos dentro de `<main>`. También se retiraron los
  enlaces hacia ambos artículos draft desde footer y rutas `ready/index`;
  Newborn conserva su copy relacionado sin link.
- **SEO y schema:** contenido/manifiestos usan `ready/index`,
  `lastModified: 2026-08-11`, sitemap y `llms`; el header release noindex del hub
  se retiró. La ruta emite un único `CollectionPage` y un `BreadcrumbList` Home
  → Journal. Release contiene 12 URLs en sitemap y 11 entradas en `llms.txt`;
  staging mantiene sitemap vacío y noindex global.
- **QA web:** staging y release aprobaron 21/21 rutas. Playwright aprobó Journal
  en 1440/1200/900/390 sin overflow, imágenes rotas ni errores runtime; la suite
  Newborn pasó de nuevo en los cuatro anchos. La revisión independiente devolvió
  `PASS` sin P1/P2.
- **Checklist:** se crearon
  `docs/lisa-publication-confirmation-checklist.md` y `.docx`. Cubren Seniors,
  Branding, Headshots, Investment, Senior Timing y Newborn Comparison; corrigen
  que el gate Seniors es outfits por paquete, no cantidad de imágenes, y
  separan paquetes de cobertura, colecciones, entregables, derechos, fechas y
  aprobaciones. Reviews y Privacy se excluyeron por instrucción del usuario.
- **QA documental:** contenido auditado `PASS`; DOCX Letter de seis páginas,
  etiquetado, renderizado sin clipping y con accesibilidad high/medium/low
  `0/0/0`.
- **Git/operación:** implementación funcional en `ffe5198`
  (`feat(journal): publish journal hub`). `origin/main` está en `a33f6ec`; antes
  del commit documental `main` está un commit por delante y quedaría dos por
  delante tras el cierre local. Estos documentos permanecen unstaged. No se
  hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### 2026-08-12 — Codex / GPT-5 — Reviews publicado con Words Become Pictures

- **Objetivo:** auditar y rediseñar `/reviews/` con la geometría editorial de la
  referencia sin copiar su identidad, preservar el hero compartido, reutilizar
  KindWords y el libro de Portfolio, y dejar la ruta `ready/index`.
- **Auditoría y concepto:** se verificaron la ruta genérica previa, diez
  testimonios atribuidos, seis páginas de Journal y la media local. Se generaron
  tres comps antes del código; Comp C `Words Become Pictures / At Ease, on
  Purpose`, seed `c2ad8044`, quedó canónica. A/B se conservan como evidencia.
- **Implementación:** `ReviewsPage` compone hero compartido, arco/print/líneas,
  `KindWords` exacto, `JournalBook` y cierre B/N con único CTA a Contact.
  `JournalBook` se extrajo de Portfolio con estado, IDs y ARIA por instancia;
  Reviews carga lazy y Portfolio conserva eager/high. SSR, contenido estático y
  refresh Tina reciben los mismos testimonials/journal pages.
- **Contenido y SEO:** Reviews quedó `ready/index`, fecha `2026-08-12`, canonical
  `www`, sin header noindex y dentro de sitemap 13/`llms.txt` 12. Emite
  `WebPage` + breadcrumb; se omiten `Review`/`AggregateRating`, categoría
  Newborn y URL Google no sustentados.
- **QA:** staging y release validaron 21/21 rutas. Playwright pasó
  1440/1200/900/390, teclado, flip, reduced motion, tipografía sin clipping,
  targets, imágenes, red/consola, overflow y regresión de Portfolio. Detector
  propio `[]`; Finish Reviewer `ship`, ceiling `reached`, sin fixes. Revisión
  técnica paralela: sin P1/P2.
- **Git/operación:** implementación y documentación estructural en `075df78`
  (`feat(reviews): publish client stories page`). Este cierre actualiza estado y
  bitácora en un commit local separado. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el script empuja al remoto y la política vigente
  reserva el push al usuario.

### 2026-08-12 — Codex / GPT-5 — Feedback de Reviews: CTA Google y álbum 3D

- **Objetivo:** aplicar los cinco puntos de feedback del usuario a `/reviews/`:
  CTA directo para reseña, giro físico del libro, menor espacio entre prueba y
  Journal, retirada de líneas cruzadas y contraste del resumen social.
- **Auditoría:** a 1920×963 el resumen medía 2.05:1, KindWords más Journal
  acumulaban aproximadamente 314 px desde el resumen a la siguiente
  introducción y las dos reglas de At Ease seguían en DOM. StPageFlip 2.0.7
  estaba activo, pero todas las hojas se interpretaban como `soft`, sin caras
  `rotateY`/`matrix3d`; GSAP solo intervenía en el reveal, no en la física.
- **Implementación:** el enlace confirmado
  `https://g.page/r/CZnCWAWyBWnQEBM/review` quedó en Settings y alimenta un CTA
  opt-in de KindWords exclusivo de Reviews, con navegación externa segura,
  relleno de papel/flecha animados y fallback reduced-motion. El resumen usa
  marfil, se eliminaron las reglas cruzadas, la firma cambió a `arch` y se
  compactaron los paddings. JournalBook compartido usa hojas `hard`, esquina
  inferior, 1200 ms y sombra `0.50`; reduced motion mantiene crossfade.
- **Pase de revisión:** el revisor detectó un P2 real: Headshot y Branding
  aparecían como placeholders porque el loop movía clones lazy aún no
  solicitados. El observer de KindWords ahora prima originales y clones como
  eager/low al entrar en viewport; el gate exige carga real de las 30 instancias
  en Reviews y Homepage. La captura final de 1920 muestra ambas tarjetas y el
  revisor confirmó el P2 resuelto sin hallazgos adicionales.
- **QA:** staging y release aprobaron 21/21 rutas. Playwright pasó
  1920×963/1440×1000/1200×900/900×900/390×844: contraste 4.61:1, gaps
  184/172.8/148/144/144 px, CTA hover/foco/reduced-motion, dos anchors seguros,
  seis hojas `hard`, estado intermedio `flipping` con `matrix3d` y sombra,
  imágenes completas, cero overflow/runtime y regresiones de Portfolio/Home.
  Sitemap permanece 13 y `llms.txt` 12. Detector Impeccable: `[]`.
- **Git/operación:** implementación y documentación estructural en `8e79a40`
  (`fix(reviews): refine proof actions and page turn`). Con este cierre
  documental `main` queda cuatro commits por delante de `origin/main`. No se
  hizo push, deploy, DNS ni `./scripts/handoff.sh`; el usuario conserva el
  control del push.

### 2026-08-13 — Codex / GPT-5 — Thank-you rediseñado como confirmación personal

- **Objetivo:** convertir `/thank-you/` en una confirmación cálida y útil sin
  transformarla en otra landing de venta ni darle visibilidad orgánica.
- **Auditoría y dirección:** se verificaron la fuente JSON, el flujo POST de
  Contact, las afirmaciones disponibles y la biblioteca fotográfica. No se
  inventó tiempo de respuesta. Image-to-code extrajo la topología de la
  referencia y la generación visual produjo tres comps; C / `Your Message Is
  With Me`, seed `02ea6a91`, quedó canónica por claridad y continuidad.
- **Implementación:** `ThankYouPage.astro` y `thank-you-page.css?url` conservan
  el renderer en SSR/refresh Tina. El hero compartido usa botón local; la nota
  combina copy verificado, arco de Lisa, print B/N y tres pasos; el cierre usa
  una sola acción a Portfolio. GSAP orquesta una entrada discreta y reduced
  motion mantiene contenido visible.
- **SEO:** la ruta sigue `ready/noindex`, `WebPage`, canonical propia,
  `sitemap:false`, `llms:false`, sin `lastModified`; staging y release emiten
  `noindex,nofollow,noarchive`. No se bloquea en `robots.txt`, de modo que el
  crawler puede leer la directiva. El validador protege el contrato completo.
- **QA:** staging/release aprobaron 21/21. Playwright CLI pasó
  1440×1000/1200×900/900×900/390×844: alturas hero 882/782/796/656, seis fotos
  cargadas, acción/foco/hover correctos, cero overflow, errores runtime o fallos
  locales de red y reduced motion visible. Las capturas finales quedan en
  `.artifacts/thank-you-2026-08-13/final/`. Detector Impeccable propio limpio;
  el warning compilado de `transition: width` pertenece a Journal preexistente.
- **Finish:** el revisor fresco devolvió `SHIP / ceiling reached`, sin P1/P2 ni
  hallazgos materiales de fidelidad, craft, responsive, accesibilidad o SEO. El
  documenter fresco reconciliado confirmó que DESIGN y el surface brief
  describen el render final.
- **Git/operación:** implementación y documentación estructural en `fc29eec`
  (`feat(thank-you): redesign inquiry confirmation`). Este estado y la bitácora
  forman un commit local de cierre separado. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva el control del push.

### 2026-08-14 — Codex / GPT-5 — Nuevo logo global optimizado y accesible

- **Objetivo:** sustituir el logo visible del sitio por el PNG entregado por el
  usuario, mantener la identidad legible en header/footer y optimizar alt,
  peso, transparencia, carga y estabilidad visual.
- **Auditoría:** el archivo 1031×797 contenía una marca negra con caja visible
  688×417, 57% de lienzo transparente y XMP/EXIF de Canva con identificadores
  internos. El logo anterior era horizontal 600×200; usar el nuevo con los
  mismos anchos habría aumentado el header de forma material.
- **Implementación:** se recortó sin alterar el trazo, se añadió un margen
  transparente de 16 px y se publicó a 720×449 bajo la URL estable. PNG y WebP
  quedaron sin metadata privada; el pipeline sirve 400/640. Settings usa alt
  literal, Header eager/async y Footer lazy/async. Los tokens de ancho preservan
  la altura del header y la retícula responsive se corrigió para centrar la
  marca exactamente en ≤1250 px. El favicon no cambió porque el wordmark
  rectangular no es adecuado a 16–32 px.
- **QA:** el primer build staging y el validador aprobaron 21/21 antes de que
  comenzara un rollout paralelo ajeno. Playwright CLI aprobó
  1440/1200/900/390 con centro exacto, overflow 0, WebP cargado, dimensiones
  naturales positivas y foco visible; Footer seleccionó el WebP 640 solo al
  entrar en viewport. PNG 49,984 B y WebP 32,388 B; ambos 720×449, con alpha y
  sin EXIF/IPTC/XMP/ICC.
- **Git/operación:** cambio funcional aislado en `0058d2e`
  (`feat(brand): replace site logo`). El worktree conserva sin stage otro
  rollout que retira Portfolio; no se revirtió ni se incluyó. No hubo push,
  deploy, DNS ni `./scripts/handoff.sh`.
