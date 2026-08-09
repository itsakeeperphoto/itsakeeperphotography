# 50 — Backlog y preguntas abiertas

> El primer ítem abierto de “Ahora” coincide con el siguiente paso de
> `20-estado.md`.
> Ningún pendiente editorial se resuelve por inferencia.

## Ahora — siguiente operación y ruta hacia producción

- [x] **1. Resolver la divergencia Git anterior.** Al cerrar la implementación
  visual, `main...origin/main` coincide en `c663d68`. Política vigente del
  usuario: Codex crea commits locales y no ejecuta pushes.
- [x] **2. Publicar Family Photo Locations en el gate de producción.** Fecha
  aprobada `2026-08-08`; `[FECHA]` retirado, ruta `ready/index`, schema completo,
  sitemap/llms/headers verificados y QA responsive final aprobado.
- [x] **3. Publicar Richland sin esperar la galería opcional.** Ruta
  `ready/index`, `lastModified: 2026-08-08`, sitemap/llms/meta/headers/schema
  verificados en release y aislamiento staging conservado.
- [x] **4. Implementar y publicar Kennewick v2.** Reemplazar v1 por el copy
  definitivo centrado en estilo, mantener la galería como mejora opcional,
  verificar diseño/schema en cuatro viewports y pasar la ruta a `ready/index`
  con sitemap/llms/header coherentes.
- [ ] **5. Verificar Richland y Kennewick después del próximo push autorizado.**
  Confirmar en el dominio final status 200, meta index, canonical, ausencia de
  header noindex, membresía del sitemap/llms y `lastmod 2026-08-08`.
- [ ] **6. Verificar analítica en el deploy.** Confirmar una visita etiquetada en
  tiempo real en Microsoft Clarity y Google Analytics, y decidir si staging se
  filtra o se excluye antes de interpretar métricas.
- [ ] **7. Completar Seniors con hechos confirmados.** Revisar
  `src/content/pending.ts` y `content/pages/senior.json`; obtener de Lisa el
  número de imágenes por paquete, la oferta referida en Q54 y la fecha editorial
  de `/journal/when-to-book-senior-pictures-tri-cities/`. Actualizar copy sin
  reescribir su voz.
- [ ] Ejecutar `npm run build:local` después de esas ediciones y confirmar
  `Validated 21 public routes in staging mode.`; revisar inmediatamente
  `git status --short` por IDs de forms generados.
- [ ] Ejecutar Playwright para Seniors a 1440×1000, 1200×900, 900×900 y 390×844;
  guardar capturas y verificar overflow, crops, focus, reduced motion, consola,
  body links, robots y composición.
- [ ] Solo si los tres puntos anteriores pasan, cambiar Seniors y su artículo
  asociado a `ready/index` en `src/lib/page-manifest.ts`, actualizar
  `lastModified`, reconstruir y comprobar sitemap/robots/llms de release.

## Contenido pendiente registrado

La fuente canónica es `src/content/pending.ts`. Mantener este resumen sincronizado
sin reemplazar el archivo.

### Homepage

- [ ] Confirmar si se puede publicar la historia sobre health challenges y
  Grammy.
- [ ] Verificar la cifra “96 five-star reviews”; mientras GBP no esté vivo usar
  fallback sin número.
- [ ] Elegir y autorizar la imagen Headshots para
  `content/homepage/index.json` (`sessions.cards[4].image` está vacío).

### About

- [ ] Confirmar hobbies y referencias de salud publicables.
- [ ] Confirmar nombre exacto del premio.
- [ ] Proveer URL/atribución de MOM Magazine.
- [ ] Confirmar permiso para la referencia/foto Grammy.
- [ ] Confirmar certificaciones, seguro y membresías profesionales.
- [ ] Resolver el texto condicional marcado “[si se publica]”.

### Branding y Headshots

- [ ] Confirmar entregables, número de imágenes y duración de Branding.
- [ ] Confirmar duración y entregables de Headshots.
- [ ] Revalidar que el copy de ambos coincide con
  `src/lib/session-pricing.ts` y no promete un número distinto.

### Newborn

- [ ] Confirmar formato exacto de sesión y lenguaje de safety/handling.
- [ ] Validar con Lisa las afirmaciones del artículo in-home vs studio.
- [ ] Confirmar el formato exacto descrito en el artículo.
- [ ] Asignar fecha editorial real al artículo.

### Investment

- [ ] Confirmar cantidades/duraciones mencionadas de manera neutral en el copy.
- [ ] Revisar todo el copy contra `src/lib/session-pricing.ts`: las páginas deben
  describir una starting point/session estimate, no un precio contractual distinto.
- [ ] QA actual de sticky headings, timeline, policy section y final paper en los
  cuatro breakpoints; la evidencia actual es puntual.

### Journal

- [ ] Fecha editorial para Branding Photos vs Headshots.
- [x] Fecha editorial para Family Photo Locations: `2026-08-08`.
- [ ] Datos de distritos/fechas escolares para Senior timing.
- [ ] Respuesta/offer de Lisa referida en Q54 para Senior timing.
- [ ] Fecha editorial para Senior timing.
- [ ] Validación de Lisa, formato exacto y fecha para Newborn comparison.

### Richland

- [x] Sustituido el inventario de spots por el conocimiento local v2 aportado
  por Lisa, sin publicar nombres ni dirección privada.
- [x] Incorporados al copy v2 el formato newborn in-home y la política de viaje
  Tri-Cities suministrados en el documento aprobado.
- [x] Enlazadas las cinco filas del directorio a sus servicios con estados
  hover, focus y reduced motion; excepción limitada por ADR-033.
- [x] Publicada `ready/index` por aprobación explícita; la galería dejó de ser
  gate y se retiró de `src/content/pending.ts`.
- [ ] Mejora opcional: añadir después 6–10 sesiones reales con procedencia
  Richland y alt contextual literal, sin nombrar el spot exacto.

### Kennewick

- [x] Sustituido v1 por el copy v2 aprobado, sin publicar spots exactos ni
  presentar portfolio general como prueba local.
- [x] Política de travel Tri-Cities y argumento de estilo incorporados desde el
  documento definitivo; ruta publicada `ready/index` con schema y crawler
  outputs verificados localmente.
- [x] Directorio de cinco servicios enlazado; excepción de nueve anchors
  limitada por ADR-035.
- [ ] Mejora opcional: añadir después 6–10 sesiones reales con procedencia
  Kennewick y alt contextual literal, sin nombrar el spot exacto.

### Pasco

- [ ] Lugares reales y detalles locales de Lisa.
- [ ] Seleccionar imágenes reales y alt contextual.
- [ ] Confirmar política/costo de travel.
- [ ] Diseñar una página especializada y hacer QA cuando exista contenido; hoy
  permanece en `ContentPage.astro`.

### Reviews

- [ ] Obtener 8–12 reseñas reales con permiso/atribución.
- [ ] Confirmar nombres o formato de anonimización autorizado.
- [ ] Confirmar link público oficial de Google Reviews.
- [ ] Añadir reseñas verificadas de Family, Seniors, Newborn y
  Branding/Headshots sin inventar categorías.
- [ ] Solo después evaluar schema Review/AggregateRating con datos actuales.

### Privacy

- [ ] Revisión factual/legal por la persona autorizada.
- [ ] Incluir Microsoft Clarity y Google Analytics en la revisión y definir
  cualquier requisito de consentimiento antes del release.
- [ ] Mantener noindex hasta aprobación y registrar quién/fecha aprobó.

## Integraciones y operación

### GitHub y handoff

- [x] Publicado el commit de analítica en
  `itsakeeperphoto/itsakeeperphotography`; al iniciar esta sesión
  `main...origin/main` estaba sincronizado en `5a5a063`.
- [x] La referencia local `origin/main` ya contiene `72bd789`, `eaa68d1`,
  `8d5d84f`, `aae3812` y `c663d68` al cierre de implementación.
- [ ] Mantener la instrucción operativa actual: ningún agente hace push; cada
  intervención termina en commits locales que el usuario administra.
- [ ] Publicar los tres commits locales de Kennewick (`8a0e467`, `b65c3c5` y
  su cierre documental) con una identidad autorizada; después ejecutar el
  chequeo remoto descrito en el ítem 5.
- [x] Excluir `.handoff/sessions/*.jsonl` mediante `.gitignore`, pathspec y
  abortar el handoff si un transcript aparece rastreado o preparado.

### Analítica

- [x] Instalar Microsoft Clarity globalmente con project ID `xyqkkqom4v`.
- [x] Instalar Google tag/GA4 globalmente con measurement ID
  `G-0YW8M601L1`.
- [ ] Verificar tráfico en tiempo real en ambos dashboards desde el deploy
  oficial.
- [ ] Decidir y documentar si staging debe excluirse o filtrarse.

### Netlify Forms

- [ ] En Netlify Dashboard, confirmar que Netlify detecta `session-inquiry` y
  `session-estimate` en el deploy actual.
- [ ] Crear notificación email para ambos forms hacia
  `itsakeeperphoto@gmail.com` en producción. Si se sigue probando antes, usar la
  notificación temporal `globalbridge360@gmail.com` y luego retirarla.
- [ ] En deploy preview, enviar una inquiry y un estimate con etiquetas claras;
  verificar que aparecen en Forms y llegan al buzón.
- [ ] Repetir prueba mínima en producción después del cutover.
- [ ] Documentar capturas/fecha de la prueba sin almacenar PII en git.

### Google Business Profile

- [ ] Crear/usar proyecto Google Cloud y OAuth consent apropiado; no hay coste
  de aplicación confirmado en este repo, pero puede requerir billing/quotas según
  políticas vigentes. Verificar documentación oficial al configurarlo.
- [ ] Obtener autorización de una cuenta manager del GBP de Lisa.
- [ ] Configurar en Netlify: `GBP_OAUTH_CLIENT_ID`,
  `GBP_OAUTH_CLIENT_SECRET`, `GBP_OAUTH_REFRESH_TOKEN`, `GBP_ACCOUNT_ID` y
  `GBP_LOCATION_ID`.
- [ ] Ejecutar `refresh-gbp-review-summary` y verificar un objeto válido en Blobs.
- [ ] Probar `/api/google-review-summary` y la actualización diaria en homepage.
- [ ] Confirmar que el fallback sin número permanece correcto al simular error.
- [ ] Confirmar el link de reviews antes de activar copy dinámico definitivo.

### TinaCMS

- [ ] Verificar en un deploy de edición que Tina visual editing sigue funcionando
  con CSP/headers actuales.
- [ ] Confirmar que credenciales de producción están solo en Netlify/TinaCloud y
  que `.env` nunca se commitea.

## QA y rendimiento

- [x] Verificada `/journal/family-photo-locations-tri-cities/` en 1440×1000,
  1200×900, 900×900 y 390×844: sin overflow, 20/20 imágenes, cuatro body links,
  cinco FAQs, foco visible y consola limpia. Evidencia en
  `.codex-evidence/journal-locations-2026-08-08/`.
- [x] Revalidada la guía tras las correcciones de producción en 1728×963,
  1440×1000, 1200×1000, 900×1000 y 390×844: overflow horizontal 0, solapamiento
  de Seasons 0 px, líneas retiradas, contraste del script 7.10:1, nueva foto
  responsive y consola sin errores.
- [x] Rediseñada “Four Kinds” con las dos referencias aportadas y la homepage
  como autoridad: retícula 12 columnas / 2×2 / una columna, paisajes 3:2, un
  arco, un mat, alt text literal y asociación `aria-labelledby`. En los cinco
  viewports: overflow 0, solapamientos 0, imágenes completas y consola limpia.
- [ ] Rehacer 84 capturas actuales: 18 rutas primarias × 4 breakpoints y
  Portfolio/Privacy/Thank-you × 4. No reutilizar como prueba final las del
  2026-07-21.
- [ ] Para las 21 rutas verificar: overflow, crops, dimensiones, body ≥16px,
  arcos/overlaps móvil, teclado/focus, menú/current, reduced motion, consola/red,
  placeholders, máximo cuatro links, robots y dispositivo compositivo.
- [ ] Ejecutar Lighthouse mobile y desktop en las 21 rutas sobre build release;
  registrar Performance, Accessibility, Best Practices y SEO por ruta.
- [ ] Corregir LCP/CLS/fonts/images que fallen y repetir auditorías.
- [ ] Validar contraste normal/hover/focus/error/disabled y simulación de baja
  luminosidad en superficies oscuras.
- [ ] Crear un índice único que mapee ruta + viewport + screenshot + score; hoy la
  evidencia está distribuida entre `artifacts/`, `.artifacts/` y
  `.codex-evidence/`.
- [ ] Verificar que Portfolio solo eager-loads páginas inicialmente visibles.
- [ ] Verificar que Agentation/Tina/Portfolio/preloader no contaminan bundles de
  rutas que no los usan.

## SEO, indexación y lanzamiento

- [ ] Mantener staging globalmente noindex mientras haya rutas draft.
- [ ] Para cada ruta completada, actualizar status/fecha en
  `src/lib/page-manifest.ts` y comprobar membership de sitemap/llms.
- [ ] Revisar metadata, Service/Article/LocalBusiness/Breadcrumb/FAQ schema con
  contenido visible actual; no crear ratings no verificados.
- [ ] Actualizar `README.md` para reflejar las 21 rutas, forms reales, modos de
  deploy y comandos actuales.
- [ ] Crear un nuevo handoff final; conservar `docs/final-handoff.md` como
  evidencia histórica o renombrarlo explícitamente sin perder historial.
- [ ] Antes del cutover, recrawlear el dominio legado solo para URLs; comparar con
  `docs/legacy-redirect-inventory.md` y `public/_redirects`.
- [ ] Probar redirects uno-a-uno; evitar catch-all a homepage.
- [ ] Con autorización explícita: poner `SITE_MODE=release`, establecer el dominio
  custom como primario y verificar todos los canonicals.
- [ ] Regenerar sitemap/robots/llms en producción y enviarlo/verificarlo en Search
  Console si el cliente tiene acceso.
- [ ] Tras estabilizar producción, redirigir la subdomain Netlify al dominio
  primario según la estrategia aprobada.

## Diseño y contenido futuro dentro del alcance

- [ ] Revisar la card de Headshots de homepage cuando exista foto autorizada y
  confirmar que las cinco cards siguen en una fila desktop y escalan en tablet/
  móvil.
- [ ] Completar una página Reviews especializada cuando haya testimonios reales;
  no reutilizar una grilla genérica.
- [ ] Completar Pasco con composición propia cuando Lisa proporcione conocimiento
  local.
- [ ] Evaluar composición individual de Privacy/Thank-you sin afectar su noindex;
  Thank-you debe permanecer simple y cálida.
- [ ] Si el usuario desea Elopement en el futuro, primero definir servicio,
  precios, deliverables, copy, ruta y schema. No añadirlo solo porque una
  conversación dijo que add-ons podrían aplicar.

## Deuda técnica/documental

- [ ] Investigar por qué `npm run build:local` puede escribir IDs en
  `GuidedInquiry.astro` y `SessionPriceCalculator.astro`; decidir si se aceptan o
  si el proceso de build debe operar sobre copia.
- [ ] Si reaparece `Failed to load @astrojs/react/server.js`, documentar versión,
  lockfile y reparación exacta; el build actual pasa.
- [ ] Revisar `public/_redirects` durante QA de staging: contiene redirects de la
  subdomain Netlify hacia el dominio custom final.
- [ ] Evaluar si eliminar/migrar del JSON la dirección legada una vez confirmado
  que Tina/editorial no la necesita; mientras tanto mantenerla no publicada.
- [ ] Mantener `src/content/pending.ts` y este backlog sincronizados.
- [ ] No forzar `git add` de `.handoff/sessions/*.jsonl`; revisar y obtener
  autorización explícita antes de compartir cualquier transcript.

## Preguntas abiertas

- [ ] TODO(contexto): ¿qué ruta debe priorizarse después de Seniors? — Lisa/William.
- [ ] TODO(contexto): ¿qué foto autorizada debe usarse para Headshots en
  homepage? — Lisa/William.
- [ ] TODO(contexto): ¿se planea publicar Elopement en otra fase? — Lisa.
- [ ] TODO(contexto): ¿cuál es el link definitivo de Google Reviews? — Lisa.
- [ ] TODO(contexto): ¿quién aprueba formalmente Privacy y cuándo? — cliente.
- [ ] TODO(contexto): ¿las notificaciones Netlify de ambos forms ya existen y
  fueron probadas? — administrador de Netlify.
- [ ] TODO(contexto): ¿quién verificará los dashboards de Clarity y Google
  Analytics y el acceso a Search Console? — administrador del cliente.
- [ ] TODO(contexto): ¿existe un tablero de tareas externo? — William.

## Hecho recientemente

- [x] Corregida la autoridad visual a la homepage Netlify.
- [x] Migrada la paleta earth-and-gold.
- [x] Creadas y validadas 21 rutas Astro.
- [x] Centralizado el hero editorial con Seniors como base.
- [x] Integrados formularios reales de Netlify y Thank-you.
- [x] Implementado session estimates con precios centralizados.
- [x] Implementado preloader home-only con reveal directo.
- [x] Implementado carrusel/flip de reviews y clip de bronce.
- [x] Implementado pipeline GBP diario con fallback (credenciales aún pendientes).
- [x] Generados sitemap, robots y llms desde manifiesto/modo.
- [x] Añadidos redirects legacy por intención.
- [x] Integrados Microsoft Clarity y Google tag/GA4 en el layout global.
- [x] Fijado `itsakeeperphoto/itsakeeperphotography` como repositorio oficial en
  `AGENTS.md` y la memoria operativa.
- [x] Endurecido `scripts/handoff.sh` para impedir que transcripts locales entren
  en commits futuros.
- [x] Actualizado contenido/diseño reciente de Investment y Locations Guide.
- [x] Sincronizada la fuente editorial v2 de Locations Guide sin revelar spots,
  inventar fotografías ni resolver `[FECHA]` por inferencia.
- [x] Corregidos dos usos móviles del token inexistente `--space-7` y verificada
  la guía con build local y Playwright en cuatro breakpoints.
- [x] Publicada Family Photo Locations en el manifiesto release con fecha
  `2026-08-08`; validada en builds release y staging sin placeholders ni gates
  contradictorios.
- [x] Verificado `npm run build:local` el 2026-08-08.
- [x] Instalado el sistema de contexto persistente en la raíz.
