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
