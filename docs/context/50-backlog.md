# 50 — Backlog y preguntas abiertas

> El ítem #1 de “Ahora” coincide con el siguiente paso de `20-estado.md`.
> Ningún pendiente editorial se resuelve por inferencia.

## Ahora — siguiente operación y ruta hacia producción

- [ ] **1. Publicar con una cuenta GitHub autorizada.** Ejecutar
  `gh auth login -h github.com`, confirmar `gh auth status` y hacer push del
  commit local a `itsakeeperphoto/itsakeeperphotography`.
- [ ] **2. Verificar analítica en el deploy.** Confirmar una visita etiquetada en
  tiempo real en Microsoft Clarity y Google Analytics, y decidir si staging se
  filtra o se excluye antes de interpretar métricas.
- [ ] **3. Completar Seniors con hechos confirmados.** Revisar
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
- [ ] Fecha editorial para Family Photo Locations.
- [ ] Datos de distritos/fechas escolares para Senior timing.
- [ ] Respuesta/offer de Lisa referida en Q54 para Senior timing.
- [ ] Fecha editorial para Senior timing.
- [ ] Validación de Lisa, formato exacto y fecha para Newborn comparison.

### Richland

- [ ] Lugares reales y comentario detallado de Lisa.
- [ ] Seleccionar imágenes reales con alt contextual.
- [ ] Confirmar formato de sesiones newborn en Richland.
- [ ] Confirmar política/costo de travel.

### Kennewick

- [ ] Lugares reales y detalles locales de Lisa.
- [ ] Seleccionar 6–10 imágenes reales y alt contextual.
- [ ] Confirmar política/costo de travel (Q53).

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

- [ ] Autenticar `gh` con una cuenta que tenga permiso de escritura en
  `itsakeeperphoto/itsakeeperphotography`; el intento con `williammelo533`
  recibió HTTP 403.
- [ ] Publicar el commit local pendiente y confirmar que `main` remoto avanza.
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
- [x] Verificado `npm run build:local` el 2026-08-08.
- [x] Instalado el sistema de contexto persistente en la raíz.
