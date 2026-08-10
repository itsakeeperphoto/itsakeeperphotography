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
- [x] **3. Publicar Richland y completar su galería verificada.** Ruta
  `ready/index`, sitemap/llms/meta/headers/schema verificados en release y
  aislamiento staging conservado; el 2026-08-09 se añadieron diez fotografías
  de diez sesiones Richland distintas y se actualizó `lastModified`.
- [x] **4. Implementar y publicar Kennewick v2.** Reemplazar v1 por el copy
  definitivo centrado en estilo, publicar inicialmente sin galería, verificar
  diseño/schema en cuatro viewports y pasar la ruta a `ready/index` con
  sitemap/llms/header coherentes. La activación posterior está en el ítem 5.
- [x] **5. Rediseñar Kennewick y completar su galería según ADR-036/040.** Auditoría de ruta/copy/media,
  siete composiciones image-first, `EditorialHero`, seis fuentes Drive
  optimizadas, cinco sesiones seguras en galería, contratos SEO intactos y QA
  1440/1200/900/390 completados. Benton City permanece excluida.
- [x] **6. Rediseñar y publicar Pasco según ADR-039.** Dirección A+C aprobada,
  `EditorialHero`, diez fotografías de diez sesiones Drive verificadas, copy
  local, ocho anchors, schema/crawler gates y QA 1440/1200/900/390 completos.
- [x] **7. Publicar Newborn definitiva según ADR-041.** Fuente v2 reconciliada,
  dirección A+C, hero/proceso protegidos sin cambios, una foto Drive verificada,
  siete H2, cuatro anchors, FAQ/schema 8:8, crawler gates y QA
  1440/1200/900/390 completos. Q41 queda pendiente no bloqueante sin claim.
- [x] **8. Corregir la geometría final según ADR-042.** El commit `974d97c`
  deja el copy final Newborn dentro de su pista y `EXPECTING?` sin corte interno,
  reorganiza Richland como contact sheet 3/2/1 en dos bandas desktop y baja el
  crop Kennewick solo por encima de 1050 px. QA 1728/1440/1200/900/390 más 768,
  release 21/21 e Impeccable `[]` completos.
- [x] **9. Alinear el cierre Pasco con Richland según ADR-043.** El commit
  `ff0a075` reemplaza el panel marfil por la invitación full-bleed centrada,
  conserva copy/media/alt/SEO Pasco y usa crops deliberados por breakpoint.
  Release 21/21, Impeccable `[]` y Playwright 1728/1440/1200/900/390 aprobados.
- [x] **10. Rediseñar y publicar About según ADR-044.** Copy definitivo
  reconciliado con excepción explícita del hero protegido, dirección A+C,
  cuatro retratos Drive optimizados, autoridad verificable como ledger,
  `AboutPage`/`Person`/breadcrumb, cinco anchors y QA
  1440/1200/900/390 completos. La ruta queda `ready/index` sin claims
  pendientes.
- [x] **11. Actualizar solo el fondo del hero About según ADR-045.** El usuario
  aprobó `/uploads/about-lisa-photographing-tricities.jpg`, alt literal y crop
  `50% 24%` común; H1, intro, script, CTA, prints y geometría permanecen
  exactos. Release 21/21, Impeccable `[]` y Playwright
  1728/1440/1200/900/390 completos. La fuente anterior no se borró.
- [x] **12. Corregir la densidad About según ADR-046.** Belief ya no convierte
  la cita en una columna de una palabra y Method recupera un inset válido de
  20–32 px sin perder su retícula 4/2/1. Release 21/21, Impeccable `[]`,
  Playwright 1440/1200/900/390 y revisión 1728×997 completos; copy, media,
  schema, hero y estado `ready/index` permanecen exactos.
- [x] **13. Añadir breathing room tablet según ADR-047.** A 900 px, Method
  conserva dos columnas y ahora separa el ítem 01 de la hairline de segunda fila
  con 32 px exactos, frente a 8–10 px. Playwright 1440/1200/900/390, release
  21/21 e Impeccable `[]` completos; overflow permanece en cero.
- [ ] **14. Publicar los commits locales.** About está terminado en commits
  funcionales y documentales locales; el cierre quedará veintidós commits por
  delante de `origin/main`. El usuario publica todos los commits posteriores a
  `ff736c6`; Codex no ejecuta push.
- [ ] **15. Verificar About, Richland, Kennewick, Pasco y Newborn después del
  push del usuario.** Confirmar en el dominio final status 200, meta index,
  canonical, ausencia de header noindex, membresía de sitemap/llms y lastmod:
  ciudades `2026-08-09`; Newborn y About `2026-08-10`; además del cierre Pasco
  sin panel, el nuevo fondo aprobado del hero About con crop `50% 24%` y la
  densidad Belief/Method corregida, incluido el inset tablet de 32 px.
- [ ] **16. Verificar analítica en el deploy.** Confirmar una visita etiquetada en
  tiempo real en Microsoft Clarity y Google Analytics, y decidir si staging se
  filtra o se excluye antes de interpretar métricas.
- [ ] **17. Completar Seniors con hechos confirmados.** Revisar
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

- [x] Publicada `ready/index` con dirección A+C, nueve H2, cinco anchors,
  autoridad editorial y schema `AboutPage`/`Person`/breadcrumb.
- [x] Reemplazado únicamente el fondo del hero por la fotografía de Lisa
  trabajando aprobada por el usuario; crop `50% 24%` en desktop/móvil y nueva
  baseline DOM protegida. La fuente anterior continúa en producción.
- [x] Corregida la densidad de Belief y Method sin tocar contenido: cita
  balanceada en tres líneas, sección reducida a 1324.2 px a 1728 y ledger 4/2/1
  con inset responsive válido.
- [x] Corregido el ritmo tablet Method: 32 px entre la última línea de la
  primera fila y la hairline de la segunda a 900 px, dos columnas y overflow 0.
- [x] Verificada la publicación de portada de Lisa en Tri-Cities MOM Magazine,
  agosto/septiembre de 2019, mediante su edición primaria en Issuu.
- [x] Eliminados del copy publicado el condicional y todos los placeholders; el
  estado de la página no depende de hechos sin confirmar.
- [ ] Opcional/no bloqueante: confirmar hobbies o referencias de salud solo si
  Lisa quiere ampliar la página; hoy no se publican.
- [ ] Opcional/no bloqueante: confirmar nombre y año exactos del premio antes de
  añadir cualquier claim o propiedad `award`; hoy no se publica.
- [ ] Opcional/no bloqueante: confirmar permiso para la referencia/foto Grammy;
  hoy no se publica.
- [ ] Opcional/no bloqueante: confirmar certificaciones, seguro y membresías;
  hoy no se publican ni se modelan en schema.

### Branding y Headshots

- [ ] Confirmar entregables, número de imágenes y duración de Branding.
- [ ] Confirmar duración y entregables de Headshots.
- [ ] Revalidar que el copy de ambos coincide con
  `src/lib/session-pricing.ts` y no promete un número distinto.

### Newborn

- [x] Formato de servicio confirmado por Q53: principalmente in-home, con
  opción exterior según temporada; reconciliado en la ruta definitiva.
- [x] Publicada `ready/index` con A+C, siete H2, cuatro anchors, FAQ/schema 8:8,
  schema detallado y una fotografía Drive nueva verificada.
- [ ] Pendiente no bloqueante Q41: confirmar si Lisa tiene formación de
  seguridad newborn antes de añadir cualquier claim. Hoy no se publica.
- [ ] Validar con Lisa las afirmaciones del artículo comparativo in-home vs.
  studio antes de publicarlo.
- [ ] Asignar una fecha editorial real al artículo comparativo Newborn.

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
- [x] Añadidas diez sesiones reales con procedencia Richland, diez fechas XMP y
  `OriginalDocumentID` distintos, alt literal y cero nombres de spot exacto.
- [x] Reorganizada la galería como contact sheet determinista 3/2/1: dos bandas
  completas de cinco imágenes en desktop, dos columnas en tablet y una en móvil.

### Kennewick

- [x] Sustituido v1 por el copy v2 aprobado, sin publicar spots exactos ni
  presentar portfolio general como prueba local.
- [x] Política de travel Tri-Cities y argumento de estilo incorporados desde el
  documento definitivo; ruta publicada `ready/index` con schema y crawler
  outputs verificados localmente.
- [x] Directorio de cinco servicios enlazado; excepción de nueve anchors
  limitada por ADR-035.
- [x] Rediseñada según ADR-036/038 con `EditorialHero`, siete composiciones
  canónicas, seis JPEG Drive optimizados y QA Playwright en cuatro viewports.
- [x] Excluidos ambos frames de la sesión identificada como Benton City y las
  dos capturas duplicadas de producción; ninguna fotografía existente fue
  borrada.
- [x] Añadida `Recent Kennewick Sessions` con cinco sesiones seguras, alt
  literal y cero anchors; no se fabricó una sexta sesión.
- [x] Ajustado el cierre full-bleed solo en desktop a
  `object-position: 50% 20%`; tablet y móvil conservan el crop anterior.
- [ ] Mejora opcional: ampliar la galería solo cuando exista una sesión
  Kennewick nueva y verificable, idealmente Family, Newborn, Branding o
  Headshots; no reutilizar otra toma de las cinco sesiones actuales.

### Pasco

- [x] Sustituido el copy thin por contenido local específico sobre luz abierta,
  agricultura, ríos, temporadas y planificación, sin publicar meeting points.
- [x] Seleccionadas diez fotografías de diez sesiones Pasco verificadas, con alt
  literal; tres family/large-family y siete senior.
- [x] Confirmada en la fuente aprobada la cobertura Tri-Cities sin travel fee.
- [x] Implementada `PascoPage.astro` con dirección A+C, hero compartido,
  directorio de cinco servicios, galería 10/10, FAQ 4:4 y cierre full-bleed.
- [x] Publicada `ready/index`, `lastModified: 2026-08-09`, sitemap/llms/header,
  Service/spatialCoverage/breadcrumb y QA en cuatro viewports.
- [ ] Mejora opcional: incorporar en el futuro sesiones Pasco verificadas de
  Newborn, Branding y Headshots para ampliar la prueba visual de servicios.

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
- [x] El usuario publicó los siete commits locales pendientes, incluidos
  Kennewick, sus composiciones y `bd833f6`; `main` y `origin/main` coinciden en
  `ff736c6`. Codex no realizó el push. Ejecutar ahora el chequeo remoto del
  ítem 7 y la observación de bandwidth de QA.
- [ ] Publicar los veintidós commits funcionales/documentales locales creados
  después de `ff736c6` al completar este cierre, incluidos `b3bb362`,
  `0f9989c` y el commit documental posterior. Codex no ejecuta push; el usuario
  conserva esa operación.
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

- [x] Reducir originales web usados: once JPEG optimizados, incluidos los ocho
  mayores de 80.38 MiB a 3.30 MiB, sin eliminar ninguna foto referenciada.
- [x] Retirar diez fuentes sin uso demostrado en las 21 rutas/CSS/Tina/schema y
  confirmar cero referencias `/uploads/` faltantes en release.
- [x] Paralelizar Sharp y bajar effort 6→4: generación limpia 114.80 s→5.09 s;
  `public` ~130→40 MiB y `dist` ~148→51 MiB.
- [x] Aislar el CSS nuevo de Pasco como asset Vite enlazado solo en esa ruta;
  evita ~20 KiB sin comprimir en cada HTML editorial ajeno y tiene gate contra
  futuros leaks.
- [x] Añadir galerías de sesiones verificadas a Richland (10) y Kennewick (5):
  13 JPEG nuevos optimizados de 165.81 a 5.92 MiB, 52 variantes WebP, cero
  duplicados nuevos, cero anchors y QA responsive en ocho combinaciones.
- [x] Publicar Newborn definitiva: una fuente Drive de 13.13 MiB/4000×6000
  optimizada a 412 KiB/1600×2400, CSS podado 39.4%, Impeccable `[]`,
  validadores 21/21 staging/release y Playwright 1440/1200/900/390 sin fallos.
- [x] Rebaselined el hero About después del cambio de fondo autorizado:
  fotografía y alt exactos, crop `50% 24%`, DOM SHA protegido, release 21/21,
  Impeccable `[]` y Playwright 1728/1440/1200/900/390 aprobados sin alterar la
  geometría ni borrar la fuente anterior.
- [x] Reequilibradas Belief y Method de About: `8ch` dejó de evaluarse en el
  font del body, la cita usa 12ch/balance y separaciones 32 px, y el padding con
  `--space-7` inválido fue reemplazado por tokens 20–32 px. Playwright
  1728/1440/1200/900/390, release 21/21 e Impeccable `[]` aprobados.
- [x] Añadido padding inferior tablet a los ítems Method 01–02: gap medido
  8–10→32 px a 900, dos columnas, overflow 0, Playwright About completo,
  release 21/21 e Impeccable final `[]`.
- [x] Corregir el lote de geometría desktop sin cambiar contenido ni media:
  Newborn final sin clipping, Richland 3/2/1 en bandas completas y Kennewick con
  crop desktop protegido. Release 21/21, Impeccable `[]` y Playwright
  1728/1440/1200/900/390 sin overflow, solapamientos ni imágenes de sección
  rotas; solo falló la telemetría externa de Clarity en local.
- [ ] Después del push/deploy autorizado, verificar en el log Netlify que el
  guard de fuentes y las variantes terminan, comprobar que
  `journal-family-children-golden-hour-tricities.jpg` baja de 15,291,345 a
  ~530,418 bytes y observar bandwidth por asset durante 48 horas.
- [ ] Si el consumo sigue alto tras el deploy, revisar Netlify Analytics/logs
  para distinguir tráfico real, previews activos, hotlinking y bots antes de
  añadir rate limiting o migrar transformaciones a Netlify Image CDN.
- [ ] Repetir PageSpeed/Lighthouse cuando la cuota deje de responder HTTP 429;
  no inferir LCP/INP/CLS desde el peso del artefacto.
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
- [x] Verificada Pasco en 1440×1000, 1200×1000, 900×1000 y 390×844: overflow 0,
  diez sesiones, H1 + ocho H2 contenidos, ocho anchors, cuatro FAQ, texto de
  lectura ≥16 px, foco marfil, reduced motion y cero imágenes rotas.
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

- [ ] Resolver con el usuario la divergencia de host observada el 2026-08-09:
  Netlify redirige `www` al apex, pero `SITE_ORIGIN` release y los canonicals
  locales usan `www`. Alinear solo después de confirmar cuál será el dominio
  primario; no cambiar DNS por inferencia.
- [ ] Mantener staging globalmente noindex mientras haya rutas draft.
- [ ] Para cada ruta completada, actualizar status/fecha en
  `src/lib/page-manifest.ts` y comprobar membership de sitemap/llms.
- [x] Pasco actualizado a `ready/index`, añadido a sitemap/llms con canonical y
  `lastModified: 2026-08-09`; al cerrar ese rollout release contenía siete URLs.
- [x] Newborn actualizado a `ready/index`, `lastModified: 2026-08-10`, sitemap y
  `llms.txt`; release contiene ahora ocho URLs y conserva staging noindex.
- [x] About actualizado a `ready/index`, `lastModified: 2026-08-10`, sitemap y
  `llms.txt`; release contiene ahora nueve URLs y ocho entradas citables.
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
- [x] Completar Pasco con composición A+C propia, conocimiento local y diez
  sesiones verificadas.
- [x] Completar Newborn con composición A+C, fuente v2 reconciliada, hero y
  proceso protegidos, ocho FAQ y prueba in-home verificada.
- [x] Completar About con composición A+C, hero protegido salvo la sustitución
  explícita de fondo registrada en ADR-045, fuente v2 reconciliada, método
  visible, densidad Belief/Method corregida según ADR-046/047 y autoridad
  verificable sin badges ni claims pendientes.
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
- [ ] Auditar los ~196 MiB/200 archivos ya rastreados bajo `.artifacts/` antes
  de retirarlos del índice. El directorio local completo ocupa ~628 MiB porque
  también contiene originales/evidencia ignorados. La regla nueva de
  `.gitignore` protege evidencia nueva, pero no elimina archivos existentes; no
  borrar sin clasificar recuperabilidad y valor documental.
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
- [x] Publicada Newborn definitiva `ready/index` con dirección A+C, fuente v2
  reconciliada, regiones protegidas intactas y QA final en cuatro viewports.
- [x] Alineados los cierres Newborn/Kennewick y la galería Richland en desktop,
  preservando copy, fotografías, tablet, móvil y contratos SEO.
- [x] Sustituido solo el fondo del hero About por el retrato aprobado de Lisa
  fotografiando, con crop común `50% 24%` y regresión responsive completa.
- [x] Corregida la densidad About sin tocar estructura: Belief queda horizontal
  y balanceada; Method conserva 4/2/1 con inset responsive válido.
- [x] Completado el ritmo Method tablet con 32 px antes de la segunda fila a
  900 px, sin cambiar retícula, contenido ni overflow.
