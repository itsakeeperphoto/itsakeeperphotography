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
