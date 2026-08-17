# 50 — Backlog y preguntas abiertas

> El primer ítem abierto de “Ahora” coincide con el siguiente paso de
> `20-estado.md`.
> Ningún pendiente editorial se resuelve por inferencia.

## Ahora — siguiente operación y ruta hacia producción

- [x] **0. Reparar el build Netlify del 2026-08-17.** Homepage dejó de apuntar
  a la variante ignorada `7-640.webp`, usa una fotografía vertical versionada
  y conserva su composición. Los seis JPEG que bloqueaban el gate de fuentes
  quedaron optimizados sin recorte; Tina, Astro, headers y 20/20 rutas pasan.
  Falta únicamente publicar el commit y confirmar el deploy remoto.
- [x] **0A. Corregir el crop móvil de Christina Bergstrom.** Home y Reviews
  comparten el ajuste nominal hasta 767 px; Playwright 390×844 confirma cabeza
  visible, WebP 400, sin overflow y sin cambios en las otras reseñas.
- [x] **0B. Evitar el OOM 137 de Netlify según ADR-068.** Tina y Astro se
  ejecutan secuencialmente para liberar la data layer antes del trazado SSR. La
  reproducción con adaptador Netlify real genera función, release y 20/20 con
  salida 0; falta confirmar el siguiente deploy remoto.

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
- [x] **14. Renovar hero y print Biography de Homepage según ADR-049.** El hero
  usa una pareja en campo abierto con art direction AVIF/WebP desktop/móvil; el
  retrato principal de Lisa sigue intacto y solo el print pequeño cambia a su
  retrato candid en blanco y negro. La media global de Open Graph/schema no
  cambió, ADR-048 sigue exacto y Seniors permanece byte-identical. Release
  21/21, Playwright en cinco anchos y revisión independiente están aprobados.
- [x] **15. Publicar Contact con gate de estimado según ADR-050 — histórico,
  supersedido parcialmente por ADR-053.** El gate, AJAX y los campos opcionales
  existieron en `dd4a590` y quedaron documentados sin borrar el historial. Su
  publicación `ready/index`, sitemap 10, `llms.txt` 9,
  `ContactPage`/breadcrumb y formulario único permanecen vigentes.
- [x] **16. Renovar la media Branding/Headshots según ADR-051.** Se incorporan
  18 JPEG Drive, 72 WebP regenerables, filenames/alt descriptivos y XMP de
  ciudad verificada sin GPS ni metadata sensible. Branding queda 13/11 y
  Headshots 14/11, máximo dos usos por fuente; release 21/21 y Playwright
  1440/1200/900/390 pasan. Ambas rutas siguen `draft/noindex` por entregables
  pendientes y no se borró media previa.
- [x] **17. Actualizar Kind Words según ADR-052.** Diez reseñas del PDF quedan
  destacadas en orden 1–10, cinco originales se confirmaron visualmente en
  Drive, siete JPEG nuevos se optimizaron y los tres exactos existentes se
  reutilizan. Tina, loaders, fallback GBP y tap coarse quedaron sincronizados;
  Astro/validador 21/21 y Playwright 1920/1440/1200/900/390 pasan.
- [x] **18. Restaurar Contact transparente según ADR-053.** Recibo y `$160`
  visibles en SSR, cálculo vivo, nombre/email/teléfono/historia requeridos,
  timing opcional y POST HTML nativo a `/thank-you/`; sin gate, AJAX, reveal,
  retry ni analítica personalizada. Tina release integral, validadores 21/21,
  Playwright 1440/1200/900/390 y no-JS 390 aprobados; Contact conserva
  `ready/index`, sitemap 10, `llms.txt` 9 y schema.
- [x] **19. Cerrar documentación del lote Senior Timing.** La implementación
  está en `bcbadae` y el cierre documental en `2c47def`; `main` quedó diez
  commits por delante de `origin/main` (`b504f84`) con worktree limpio. El
  usuario conserva la publicación del historial completo. Codex no ejecutó push
  ni `./scripts/handoff.sh`.
- [x] **19A. Rediseñar el artículo comparativo Newborn según ADR-055.**
  `NewbornComparisonPage` implementa Concept B / Impeccable, CSS `?url`, copy
  definitivo 1/8/7/3, tres anchors y nueve imágenes 7/2. Article + FAQPage +
  Breadcrumb, staging/release 21/21, Playwright 1440/1200/900/390 + spot 1728
  e Impeccable `[]` quedaron aprobados en `1dd00d3`.
- [x] **19B. Cerrar Branding vs. Headshots según ADR-056.** `b22c581` publica
  Comp C / Impeccable `Versus Axis`, renderer/CSS aislados, copy 1/8/6/3, tres
  anchors y 11 imágenes 8/3. Validadores 21/21, Playwright
  1440/1200/900/390/1728, 15 capturas, Impeccable `[]` y revisión independiente
  `PASS` sin P1/P2. La ruta queda `ready/index`, fecha `2026-08-11`, sitemap 11,
  `llms.txt` 10 y Article + FAQ + Breadcrumb; las páginas de servicio siguen
  `draft/noindex`.
- [x] **19C. Cerrar documentalmente Branding vs. Headshots.** El commit
  `a33f6ec` registra su publicación; el usuario lo subió a `origin/main` junto
  con el historial local anterior.
- [x] **19D. Publicar el hub Journal según ADR-057.** `ffe5198` cambia la ruta a
  `ready/index`, añade `CollectionPage` + breadcrumb, conserva cuatro cards y
  originalmente expuso Locations, Branding vs. Headshots, Portfolio y Contact.
  ADR-061 sustituyó Portfolio por Reviews y actualizó la fecha a `2026-08-14`;
  el estado vigente valida 20/20 y crawler outputs 12/12.
- [x] **19D.1. Rediseñar y publicar Reviews según ADR-058.** La ruta usa
  `ReviewsPage`, el hero compartido, `KindWords` exacto y `JournalBook`;
  conserva diez testimonios atribuidos y schema sobrio. El follow-up ADR-059
  confirma el CTA Google, retira las líneas cruzadas y recupera el flip 3D. Queda
  `ready/index` con fecha `2026-08-12`; tras ADR-061 crawler outputs quedan
  12/12, con QA
  1920/1440/1200/900/390 e Impeccable limpio.
- [x] **19D.2. Retirar la ruta Portfolio según ADR-061.** Se eliminaron la página,
  el manifiesto y el pipeline Tina exclusivos; el libro permanece en Reviews,
  `/portfolio/` y las seis galerías legacy redirigen a `/reviews/`, y Journal,
  Thank-you y Footer ya no la enlazan. Staging/release validan 20/20;
  sitemap/`llms.txt` quedan 12/12. Playwright aprobó Reviews en cinco anchos,
  Thank-you en cuatro y Journal en 1440/390. Queda solo el smoke HTTP
  post-deploy de los redirects; no se hizo push.
- [x] **19D.3. Implementar el artefacto 404 según ADR-062.** `404.html` queda
  fuera del manifest/crawler outputs, usa el hero editorial compartido y una
  recuperación Home → Reviews. El servidor estático devuelve HTTP 404; meta,
  headers, ausencia de canonical/schema y cinco imágenes quedan validados.
- [ ] **19D.4. Recapturar el 404 después del fix desktop.** Repetir Playwright
  en 1440×1000, 1200×900, 900×900 y 390×844 cuando se restablezca la cuota
  local. El P1 de solapamiento ya fue corregido en CSS; falta solo evidencia
  visual post-fix para convertir el finish review condicional en PASS absoluto.
- [x] **19D.5. Simplificar y blindar TinaCMS según ADR-063.** El editor local
  presenta cinco colecciones y 38 documentos con títulos legibles, abre las 19
  Website Pages en su ruta exacta, oculta contratos técnicos, preserva sus
  renderers especializados tras refresh y habilita quick edit sin cambiar
  copy, CSS ni composición. `validate:tina` aprueba 5/38/20/19.
- [ ] **19D.6. Verificar TinaCloud después del próximo deploy.** Iniciar sesión
  como Editor, abrir Homepage y una muestra de cada familia, guardar y revertir
  un cambio controlado en una página draft, y confirmar preview, permisos y
  CSP/headers sin registrar credenciales ni contenido personal en git.
- [ ] **19E. Enviar a Lisa el checklist de confirmación.** Usar
  `docs/lisa-publication-confirmation-checklist.md` o `.docx`, registrar sus
  respuestas sin inferirlas y aplicarlas ruta por ruta. El documento cubre
  Seniors, Branding, Investment, Senior Timing y Newborn Comparison;
  Reviews se resolvió aparte en ADR-058; Privacy permanece fuera por
  instrucción del usuario. El 2026-08-17 quedaron resueltos el paquete
  individual de Headshots y la política de viaje; no usar la versión `.docx`
  anterior sin regenerarla.
- [ ] **19F. Publicar Newborn Comparison solo después de sus tres gates.**
  Resolver `[VALIDAR CON LISA]`,
  `[VALIDAR: formato exacto que ofrece Lisa]` y `[FECHA]`; hasta entonces
  conservar `draft/noindex`, header release, ausencia de fechas y exclusión de
  sitemap/`llms.txt`.
- [ ] **20. Verificar Homepage, About, Reviews, Contact, Richland, Kennewick,
  Pasco, Newborn y Journal después del push del usuario.** Confirmar en el dominio final status 200,
  meta index, canonical, ausencia de header noindex, membresía de sitemap/llms
  y lastmod:
  Richland/Kennewick/Pasco/Newborn/Contact `2026-08-17`; About `2026-08-10`;
  además del cierre Pasco
  sin panel, el nuevo fondo aprobado del hero About con crop `50% 24%` y la
  densidad Belief/Method corregida, incluido el inset tablet de 32 px. En `/`,
  comprobar la nueva pareja del hero y sus crops 29/58/42%, el print pequeño en
  blanco y negro, la carga AVIF sin JPEG paralelo, las cinco cards de ADR-048 y
  las diez reseñas Kind Words de ADR-052, incluido tap y resumen GBP vivo.
  En Contact, confirmar `$160` visible antes de completar datos, cálculo vivo y
  un envío nativo controlado hacia Thank-you; registrar solo recepción y
  navegación, sin guardar PII en git.
- [ ] En Journal, confirmar canonical/index, `CollectionPage` + breadcrumb,
  `lastModified: 2026-08-14`, membresía única en sitemap/`llms.txt`, cuatro
  anchors Locations/Branding/Reviews/Contact y ausencia de
  enlaces a Senior Timing/Newborn Comparison mientras continúen draft.
- [ ] En el mismo deploy, comprobar que Branding continúa `noindex`, ausente de
  sitemap/`llms.txt`, sin imágenes rotas y sirviendo WebP responsive. Confirmar
  que Headshots responde 200/index, aparece una vez en sitemap/`llms.txt` y
  conserva su paquete/schema confirmado. Branding sigue bloqueada por
  duración/entregables.
- [ ] Confirmar también que Senior Timing conserva `draft/noindex`, header
  release, exclusión de sitemap/`llms.txt`, schema sin fechas y las 11 imágenes
  responsive; el push del rediseño no autoriza su publicación.
- [ ] Confirmar también que Newborn Comparison conserva `draft/noindex`, header
  release, exclusión de sitemap/`llms.txt`, schema sin fechas, CSS aislado y las
  nueve imágenes responsive; el push del rediseño no autoriza su publicación.
- [ ] Confirmar que Branding vs. Headshots responde 200/index en producción,
  carece de header noindex, conserva publicación `2026-08-11`, modificación
  `2026-08-17`, aparece una vez en sitemap y
  `llms.txt`, carga sus 11 imágenes responsive y mantiene el CSS aislado. Esta
  verificación no publica Branding ni Headshots service.
- [ ] **21. Verificar analítica en el deploy.** Confirmar una visita etiquetada en
  tiempo real en Microsoft Clarity y Google Analytics. Staging ya está excluido
  por código y no carga ninguno de los dos tags.
- [x] **22. Rediseñar el artículo Senior Timing según ADR-054.** Se implementó
  `SeniorTimingPage` con `EditorialHero`, contact sheet estacional, CSS `?url`,
  1 H1/8 H2/7 H3, cuatro anchors y 11 imágenes. La frase distrital no demostrada
  se sustituyó por guía basada en el deadline publicado por la escuela; Q54 y
  fecha no se inventaron. Staging/release 21/21, Playwright
  1440/1200/900/390 y revisión independiente `PASS`. La ruta permanece
  `draft/noindex`, con header y exclusión sitemap/llms intactos.
- [ ] **23. Completar el cluster Seniors con hechos confirmados.** Revisar
  `src/content/pending.ts` y `content/pages/seniors.json`; obtener de Lisa los
  outfits incluidos por paquete y la regla de outfit adicional, la oferta
  referida en Q54 y la fecha editorial
  de `/journal/when-to-book-senior-pictures-tri-cities/`. Los datos concretos de
  deadlines distritales son una mejora opcional y solo se añaden con fuente
  verificable. Actualizar copy sin reescribir su voz.
- [ ] Después de editar esos hechos, ejecutar `npm run build:local`, confirmar
  `Validated 20 public routes in staging mode.` y revisar inmediatamente
  `git status --short` por IDs de forms generados.
- [ ] Repetir Playwright para la página de servicio Seniors y el artículo en
  1440×1000, 1200×900, 900×900 y 390×844; verificar overflow, crops, foco,
  reduced motion, consola, body links, robots y composición.
- [ ] Solo si contenido, fecha y QA pasan, decidir por separado si Seniors y su
  artículo cambian a `ready/index`; entonces actualizar `lastModified`, headers
  y manifest, reconstruir y comprobar sitemap/robots/llms de release.

## Contenido pendiente registrado

La fuente canónica es `src/content/pending.ts`. Mantener este resumen sincronizado
sin reemplazar el archivo.

### Checklist de confirmación para Lisa

- [x] Creado `docs/lisa-publication-confirmation-checklist.md` y su versión
  compartible `.docx`, con datos actuales prellenados, decisiones explícitas y
  autorización final por ruta.
- [x] Alcance limitado a Seniors, Branding, Headshots, Investment, Senior
  Timing y Newborn Comparison. Privacy queda fuera; Reviews se completó
  posteriormente como rollout independiente en ADR-058.
- [x] Corregido el gate de Seniors: falta confirmar outfits incluidos por
  paquete y la regla de outfit adicional, no una cantidad de imágenes.
- [x] Registrada la inconsistencia transversal que Lisa debe resolver: el
  estimador aplica las mismas coberturas a cinco servicios, mientras el copy de
  Headshots describe una experiencia breve y el artículo Branding una sesión
  típicamente de medio día. No se armoniza por inferencia.
- [x] DOCX Letter de seis páginas, etiquetado, renderizado sin clipping y con
  auditoría de accesibilidad high/medium/low `0/0/0`.
- [ ] Enviar el documento a Lisa, recibir sus respuestas y registrar cada
  confirmación antes de editar o publicar una ruta.

### Homepage

- [x] Sustituido el hero visual por
  `/uploads/kennewick-couple-open-field-golden-hour.jpg`, con derivados
  AVIF/WebP desktop y móvil, focos aprobados y sin cambiar la media global de
  Open Graph/schema.
- [x] Desacoplado el print pequeño de Meet Lisa mediante
  `meetLisa.printImage`; el retrato principal permanece y el print nuevo es
  decorativo, lazy, centrado y sin zoom.
- [x] Confirmada sin cambios la selección de cinco cards de ADR-048; Seniors
  conserva bytes y digest exactos.
- [x] Actualizadas diez reseñas destacadas desde `Reviews.pdf`; cinco fotos
  tienen original idéntico en Drive y las otras cinco conservan la única
  evidencia visual exacta disponible. Copy, autores, tipos y alt están
  sincronizados; Charity permanece archivada sin borrar.
- [x] El fallback social proof queda en `100+ five-star Google reviews`, cifra
  aportada en el PDF. GBP solo lo sustituye cuando devuelve juntos rating y
  conteo válidos.
- [ ] Confirmar si se puede publicar la historia sobre health challenges y
  Grammy.
- [ ] Después del deploy, verificar que el endpoint GBP vivo sustituye el
  fallback con rating y conteo actuales; no copiar esos valores a schema.
- [x] Elegida por solicitud explícita del usuario la imagen Headshots
  `/uploads/review-lisa-griffith-headshot-tricities.jpg`; la card ya tiene alt
  literal, variantes responsive y contrato de regresión.

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

- [x] Renovadas las fotografías desde carpetas Drive verificadas de Richland,
  Kennewick y West Richland: 18 JPEG, 72 WebP regenerables, Branding 13/11 y
  Headshots 14/11, máximo dos usos por fuente, alt literal y XMP de ciudad sin
  GPS ni metadata privada. QA release/Playwright completo; no se borraron
  fuentes anteriores.
- [ ] Confirmar entregables, número de imágenes y duración de Branding.
- [x] Confirmados y aplicados el 2026-08-17 para Headshots individual:
  `$175 + tax`, 20–30 minutos, una descarga digital en alta resolución con uso
  comercial y galería online con compras adicionales. Equipos usan custom
  estimate sin tarifa inventada; `pending` queda vacío y schema/Playwright
  pasan. ADR-065 publica la ruta `ready/index`, `lastModified: 2026-08-17`,
  sitemap/`llms.txt` y retira su header release noindex.
- [ ] Revalidar que el copy de Branding coincide con
  `src/lib/session-pricing.ts` y no promete un número distinto.
- [x] El artículo comparativo usa ese inventario real sin media nueva y tiene
  fecha editorial autorizada `2026-08-11`; su publicación `ready/index` es
  independiente de los gates de duración/entregables de las páginas service.

### Newborn

- [x] Formato de servicio confirmado por Q53: principalmente in-home, con
  opción exterior según temporada; reconciliado en la ruta definitiva.
- [x] Publicada `ready/index` con A+C, siete H2, cuatro anchors, FAQ/schema 8:8,
  schema detallado y una fotografía Drive nueva verificada.
- [ ] Pendiente no bloqueante Q41: confirmar si Lisa tiene formación de
  seguridad newborn antes de añadir cualquier claim. Hoy no se publica.
- [x] Rediseño comparativo completo en `1dd00d3`: renderer especializado, copy
  1/8/7/3, nueve imágenes 7/2, schema seguro y QA integral; esto no publica la
  ruta.
- [ ] Resolver `[VALIDAR CON LISA]` sobre las afirmaciones del artículo.
- [ ] Resolver `[VALIDAR: formato exacto que ofrece Lisa]`, especialmente la
  combinación casa + golden hour posterior.
- [ ] Resolver `[FECHA]` con una fecha editorial real.

### Investment

- [ ] Confirmar cantidades/duraciones mencionadas de manera neutral en el copy.
- [ ] Revisar todo el copy contra `src/lib/session-pricing.ts`: las páginas deben
  describir una starting point/session estimate, no un precio contractual distinto.
- [ ] QA actual de sticky headings, timeline, policy section y final paper en los
  cuatro breakpoints; la evidencia actual es puntual.

### Contact

- [x] Publicada `ready/index`, `lastModified: 2026-08-17`, dentro de sitemap y
  `llms.txt`, con `ContactPage` y `BreadcrumbList` sin un `Service` inventado.
- [x] **Histórico ADR-050, supersedido parcialmente por ADR-053:** los cuatro
  checks siguientes registran el gate que existió en `dd4a590`; ya no describen
  el comportamiento actual.
- [x] Implementado un único `session-estimate`: nombre/email requeridos,
  teléfono/timing/historia opcionales y recibo oculto hasta la confirmación 2xx.
- [x] Implementados timeout de 15 s, guard de doble submit, preservación de
  datos, error enfocable, retry y freeze de controles tras el éxito.
- [x] Preservado el fallback HTML POST a `/thank-you/` y añadidos eventos Google
  tag sin PII y disclosure factual de Netlify Forms.
- [x] Verificados staging/release 21/21 y Playwright 1440/1200/900/390 con 2xx,
  5xx, fallo de red y doble clic mediante POST interceptados; no hubo envío real.
- [x] Restaurado en `df6db0f` el contrato transparente: recibo y `$160` visibles
  en SSR, cálculo vivo hasta `$955.98`, nombre/email/teléfono/historia
  requeridos, timing opcional y un único POST nativo a `/thank-you/`.
- [x] Retirados `fetch`, `preventDefault`, markup/estados locked/reveal,
  timeout/retry/freeze, `submission_id` y analítica personalizada del gate.
- [x] Verificados Tina release integral `4002`/`9001`, staging/release 21/21,
  Playwright 1440/1200/900/390, navegación POST de documento y no-JS a 390 px;
  revisión final `PASS`, sin envíos reales.
- [x] Actualizado el 2026-08-17 el estimador transparente: paquetes filtrados
  por servicio, Headshots individual `$175 + tax`, equipos como custom estimate
  y viaje con 25 millas incluidas + `$2` por milla adicional. Playwright valida
  `$985.98` con 40 millas, el POST nativo y el fallback no-JS en
  1440/1200/900/390; no hubo envío real.
- [ ] Después del deploy transparente, realizar una prueba controlada del POST
  nativo y documentar recepción/navegación sin guardar PII en el repositorio.

### Journal

- [x] Hub publicado `ready/index` en `ffe5198`, `lastModified: 2026-08-14`,
  `CollectionPage` + breadcrumb y crawler outputs 12/12. Conserva cuatro cards,
  pero solo enlaza Locations y Branding vs. Headshots; Reviews y Contact
  completan los cuatro anchors. Senior Timing y Newborn Comparison permanecen
  visibles sin link mientras sigan draft.
- [x] Fecha editorial para Branding Photos vs Headshots: `2026-08-11`.
- [x] Fecha editorial para Family Photo Locations: `2026-08-08`.
- [ ] Datos de distritos/fechas escolares para Senior timing.
- [ ] Respuesta/offer de Lisa referida en Q54 para Senior timing.
- [ ] Fecha editorial para Senior timing.
- [x] Rediseño Senior Timing completo sin resolver los tres pendientes por
  inferencia: guía escolar neutral, Q54 omitida y schema/byline sin fecha; la
  ruta conserva `draft/noindex` y exclusión de crawler outputs.
- [x] Rediseño Newborn Comparison completo según ADR-055, sin inferir sus
  pendientes ni fechas.
- [ ] Validación de Lisa, formato exacto y fecha real para Newborn Comparison;
  mantener `draft/noindex` y exclusión crawler mientras falte cualquiera.
- [x] Cerrados QA y hash de Branding vs. Headshots en `b22c581`: diseño
  `Versus Axis`, renderer/CSS, copy, media, schema y gates de publicación
  aprobados sin P1/P2.

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
- [x] Política reconciliada el 2026-08-17: primeras 25 millas incluidas y `$2`
  por cada milla adicional; se retiró el claim absoluto “sin travel fee”.
- [x] Implementada `PascoPage.astro` con dirección A+C, hero compartido,
  directorio de cinco servicios, galería 10/10, FAQ 4:4 y cierre full-bleed.
- [x] Publicada `ready/index`, `lastModified: 2026-08-17`, sitemap/llms/header,
  Service/spatialCoverage/breadcrumb y QA en cuatro viewports.
- [ ] Mejora opcional: incorporar en el futuro sesiones Pasco verificadas de
  Newborn, Branding y Headshots para ampliar la prueba visual de servicios.

### Reviews

- [x] Auditadas y publicadas diez reseñas reales del inventario canónico de
  Homepage/PDF, en orden 1–10; Charity permanece archivada sin borrarse.
- [x] Conservados nombres, citas, tipo de sesión y alt text atribuidos de la
  fuente, sin anonimización ni reescritura inventada.
- [x] Confirmado por el usuario el link público oficial de Google Reviews:
  `https://g.page/r/CZnCWAWyBWnQEBM/review`; se guarda en Settings y se publica
  como CTA externo seguro.
- [x] Publicadas las categorías realmente disponibles —Family, Seniors,
  Couple, Branding y Headshots—; no se inventó una reseña Newborn ausente.
- [x] El usuario confirmó el 2026-08-17 que las diez citas son textos literales
  de reseñas reales del Google Business Profile. `Review`/`AggregateRating`
  sigue omitido deliberadamente: faltan URL, fecha y rating individual, y la
  política Google no habilita snippets autorreferenciales del propio
  LocalBusiness ni agregados importados desde otra plataforma.
- [x] Implementado renderer especializado sin grilla genérica: hero compartido,
  `At Ease`, `KindWords`, libro de seis páginas y cierre con anchor a Contact.
- [x] Aplicado feedback visual: sin reglas cruzadas, firma `arch`, contraste
  4.61:1, transición compacta hacia Journal y CTA Google animado con fallback
  reduced-motion.
- [x] Restaurado el giro físico del libro compartido con hojas `hard`, 1200 ms,
  sombra `0.50` y esquina inferior; validado `matrix3d` en cinco viewports. El
  libro permanece solo en Reviews tras retirar la ruta Portfolio.
- [x] Publicada `ready/index`, `lastModified: 2026-08-12`, sin header noindex y
  con membresía sitemap/`llms.txt`; release vigente queda 12/12.

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
  `ff736c6`. Codex no realizó el push.
- [x] El usuario publicó también el lote local posterior; al iniciar Contact,
  `main` y `origin/main` coincidían en `b504f84`. Codex no realizó el push.
- [x] El usuario publicó el lote local completo hasta `a33f6ec`, incluido
  Contact/reversión, media Branding/Headshots, Kind Words, Senior Timing,
  Newborn Comparison y Branding vs. Headshots con sus cierres documentales.
  `origin/main` apunta a `a33f6ec`; Codex no realizó el push.
- [ ] Publicar cuando el usuario decida el lote Journal actual: funcional
  `ffe5198` más su cierre documental. Antes del commit docs `main` está un commit
  por delante de `origin/main`; después quedará dos por delante. Codex no
  ejecuta push y el usuario conserva esa operación.
- [x] Excluir `.handoff/sessions/*.jsonl` mediante `.gitignore`, pathspec y
  abortar el handoff si un transcript aparece rastreado o preparado.

### Analítica

- [x] Instalar Microsoft Clarity globalmente con project ID `xyqkkqom4v`.
- [x] Instalar Google tag/GA4 globalmente con measurement ID
  `G-0YW8M601L1`.
- [ ] Verificar tráfico en tiempo real en ambos dashboards desde el deploy
  oficial.
- [x] Excluir staging y desarrollo por código; GA4 y Clarity se cargan una sola
  vez únicamente en `SITE_MODE=release`.

### Netlify Forms

- [x] El usuario confirmó el 2026-08-11 que Netlify Forms está configurado y
  funcionando en producción.
- [x] El usuario confirmó el 2026-08-11 que las notificaciones de producción
  están configuradas y funcionando.
- [x] **SUPERSEDIDO POR ADR-053:** no ejecutar la prueba real de unlock 2xx
  prevista para ADR-050; el gate y su transporte AJAX ya no existen.
- [ ] Después de desplegar ADR-053, enviar un estimate de prueba con etiqueta
  clara; verificar recepción y navegación nativa a Thank-you. El QA
  automatizado interceptó los POST y no sustituye esta prueba real.
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
- [ ] Confirmar que el fallback aprobado `100+ five-star Google reviews`
  permanece visible al simular error o payload incompleto.
- [x] Confirmado el link directo de reviews y almacenado en
  `settings.social.googleProfile`; el copy dinámico de conteo/rating conserva su
  gate separado de credenciales y payload GBP.

### TinaCMS

- [x] Auditar cinco colecciones, 38 documentos, 20 rutas y 19 renderers;
  proteger filenames, routing, campos técnicos y composición visual.
- [x] Añadir navegación de preview determinista, títulos/labels editoriales y
  quick edit en las 19 páginas sin cambiar su diseño público.
- [x] Unificar SSR/refresh, dividir queries Basic/Contact/Site, conservar las
  interacciones tras reemplazo de isla y ejecutar `validate:tina` antes de
  dev/build. Gate actual: 5/38/20/19 PASS.
- [x] Reparar Homepage después de borrar `7.jpg`: conservar la misma foto con
  `/uploads/7-640.webp`, alt literal y guard global que rechaza cualquier media
  `/uploads/...` inexistente. Tina local guardó el documento con éxito.
- [ ] Verificar en un deploy autenticado que Tina visual editing, guardado y
  permisos funcionan con CSP/headers actuales.
- [ ] Confirmar que credenciales de producción están solo en Netlify/TinaCloud y
  que `.env` nunca se commitea.

## QA y rendimiento

- [x] Reducir originales web usados: once JPEG optimizados, incluidos los ocho
  mayores de 80.38 MiB a 3.30 MiB, sin eliminar ninguna foto referenciada.
- [x] Retirar diez fuentes sin uso demostrado en las 20 rutas/CSS/Tina/schema y
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
- [x] **Histórico ADR-050:** publicado localmente el gate Contact en `dd4a590`:
  staging/release 21/21
  y Playwright 1440/1200/900/390 con 2xx, 5xx, fallo de red y doble clic,
  interceptando todos los POST. Verificados unlock exclusivo tras 2xx, un solo
  request, preservación de datos/retry, freeze tras éxito, foco, no-JS y
  overflow 0; no se enviaron datos reales.
- [x] Restaurado el estimate transparente en `df6db0f`: Tina release integral
  con puertos `4002`/`9001`, staging/release 21/21 y Playwright
  1440/1200/900/390 con recibo SSR `$160`, cálculo `$955.98`, campos nativos,
  ausencia de gate y POST URL-encoded como navegación de documento. No-JS a
  390 px y revisión final independiente `PASS`; todos los POST se interceptaron
  y no hubo envío real.
- [x] Renovada la media Branding/Headshots en `127c539`: 18 JPEG ≤2400 px/
  700 KiB, 72 WebP regenerables, XMP segura y contratos de diversidad/alt.
  Release validó 21/21 y Playwright aprobó 1440/1200/900/390 con crops, red,
  consola y overflow correctos.
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
- [x] Verificada
  `/journal/when-to-book-senior-pictures-tri-cities/` en staging/release 21/21
  y Playwright 1440×1000, 1200×900, 900×900 y 390×844: 1/8/7 headings,
  cuatro anchors, 11 imágenes, schema sin fechas, foco/acordeones, reduced
  motion, crops, red, consola y overflow correctos; revisión independiente
  `PASS` sin P1/P2.
- [x] Verificada
  `/journal/in-home-vs-studio-newborn-photography/` en staging/release 21/21 y
  Playwright 1440×1000, 1200×900, 900×900 y 390×844, más spot-check 1728:
  1/8/7/3, tres anchors, nueve imágenes 7/2, párrafos exactos, FAQ/schema,
  foco, crops, CSS aislado, red, consola y overflow correctos; Impeccable `[]`.
- [x] Verificada `/journal/branding-photos-vs-headshots/` en staging/release y
  Playwright 1440×1000, 1200×900, 900×900, 390×844 y 1728×963: 1/8/6/3, tres
  anchors, checklist/lista, tabla de seis filas, 11 imágenes 8/3, fecha,
  FAQ/schema, foco, acordeones, reduced motion, CSS aislado, red, consola y
  overflow aprobados. Impeccable `[]`; revisión independiente `PASS` sin P1/P2.
- [x] Verificado `/journal/` en staging/release 20/20. El QA original cubrió
  1440/1200/900/390 y el cierre ADR-061 revalidó 1440/390: estado `ready/index`,
  cuatro cards, anchors exactos Locations/Branding/Reviews/Contact, cero links a
  artículos draft, `CollectionPage` + breadcrumb, imágenes cargadas, overflow 0
  y consola/runtime sin fallos.
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
- [ ] Rehacer 80 capturas actuales: 18 rutas primarias × 4 breakpoints y
  Privacy/Thank-you × 4. No reutilizar como prueba final las del
  2026-07-21.
- [ ] Para las 20 rutas verificar: overflow, crops, dimensiones, body ≥16px,
  arcos/overlaps móvil, teclado/focus, menú/current, reduced motion, consola/red,
  placeholders, máximo cuatro links, robots y dispositivo compositivo.
- [ ] Ejecutar Lighthouse mobile y desktop en las 20 rutas sobre build release;
  registrar Performance, Accessibility, Best Practices y SEO por ruta.
- [ ] Corregir LCP/CLS/fonts/images que fallen y repetir auditorías.
- [ ] Validar contraste normal/hover/focus/error/disabled y simulación de baja
  luminosidad en superficies oscuras.
- [ ] Crear un índice único que mapee ruta + viewport + screenshot + score; hoy la
  evidencia está distribuida entre `artifacts/`, `.artifacts/` y
  `.codex-evidence/`.
- [ ] Verificar que el libro de Reviews conserva carga lazy hasta aproximarse a
  viewport.
- [ ] Verificar que Agentation/Tina/libro/preloader no contaminan bundles de
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
- [x] Contact actualizado a `ready/index`, `lastModified: 2026-08-11`, sitemap y
  `llms.txt`; release contiene ahora diez URLs y nueve entradas citables, con
  `ContactPage`/breadcrumb y sin `Service` inventado.
- [x] Branding vs. Headshots actualizado a `ready/index`, publicación y
  modificación `2026-08-11`, sin header release noindex y con membresía en
  sitemap/`llms.txt`; el release contiene ahora 11 URLs y 10 entradas citables.
  Emite `Article`, `FAQPage` y `BreadcrumbList` sin estructurar paquetes.
- [x] Journal hub actualizado a `ready/index`, `lastModified: 2026-08-11`, sin
  header release noindex y con membresía en sitemap/`llms.txt`; release contiene
  ahora 12 URLs y 11 entradas citables. Emite `CollectionPage` y
  `BreadcrumbList`, y no enlaza los dos artículos que siguen draft.
- [x] Reviews actualizado a `ready/index`, `lastModified: 2026-08-12`, sin
  header release noindex y con membresía en sitemap/`llms.txt`; release contiene
  ahora 13 URLs y 12 entradas citables. Emite `WebPage` y `BreadcrumbList`, sin
  schema de reseñas o rating fabricado.
- [x] Headshots actualizado a `ready/index`, `lastModified: 2026-08-17`, sin
  header release noindex y con membresía en sitemap/`llms.txt`; tras retirar
  Portfolio, el estado vigente queda 13/13. Emite WebPage, Service + Offer,
  FAQPage y BreadcrumbList con el paquete confirmado.
- [x] Newborn Comparison rediseñado con Article/FAQPage/Breadcrumb y sin fechas;
  conserva `draft/noindex`, header release y exclusión sitemap/`llms.txt` hasta
  resolver sus tres gates literales.
- [x] Revisar metadata y schema de las 13 URLs indexables: un LocalBusiness y
  WebSite canónicos, tipo principal correcto, Breadcrumb/Service/Article/FAQ
  según contenido visible, perfil Google Business por `sameAs`, sin calle/geo
  privada ni ratings no verificables. Validator release/staging PASS.
- [ ] Actualizar `README.md` para reflejar las 20 rutas, forms reales, modos de
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

- [x] Actualizadas las cards Family, Newborn, Branding y Headshots de homepage;
  Seniors permanece byte a byte intacta. Playwright confirma cinco columnas en
  1728/1440/1200, 2–2–1 en 900 y una columna en 390.
- [x] Renovados el hero visual y el print pequeño Biography de Homepage con art
  direction responsive, accesibilidad y guardas de carga; el retrato principal,
  Open Graph/schema y las cinco cards protegidas no cambiaron.
- [x] **Histórico ADR-050:** Contact fue convertido en un estimador gated con
  receipt locked y estados 2xx/error/no-JS; ADR-053 supersedió ese patrón sin
  borrar su registro.
- [x] Contact actual usa estimate transparente: recibo/total SSR visibles,
  cálculo vivo, viaje confirmado y paquete Headshots separado, con submit HTML
  nativo; preserva `ready/index`, form único y schema sobrio.
- [x] Renovadas Branding y Headshots con fotografía Drive local, diversidad
  protegida, filenames/alt descriptivos y XMP de ciudad segura. Headshots ya
  resolvió su paquete individual y está `ready/index`; Branding continúa
  `draft/noindex` hasta confirmar duración y entregables.
- [x] Completar Reviews con `Words Become Pictures`, testimonios reales,
  `KindWords` exacto y libro reutilizable; no se usó una grilla genérica.
- [x] Completar Pasco con composición A+C propia, conocimiento local y diez
  sesiones verificadas.
- [x] Completar Newborn con composición A+C, fuente v2 reconciliada, hero y
  proceso protegidos, ocho FAQ y prueba in-home verificada.
- [x] Completar Newborn Comparison con Concept B / House Archive, renderer y
  CSS aislados, copy 1/8/7/3, media existente 7/2 y QA responsive; su publicación
  continúa como pendiente editorial separado.
- [x] Cerrado Branding vs. Headshots en `b22c581` con Comp C / Versus Axis,
  renderer y CSS aislados, copy 1/8/6/3, media existente 8/3, QA final y
  publicación `ready/index`.
- [x] Publicado Journal hub en `ffe5198` sin rediseñarlo: cuatro cards visibles,
  dos artículos listos enlazados, dos draft sin anchor, Reviews y Contact;
  schema de colección, gates crawler y regresión responsive aprobados.
- [x] Completar About con composición A+C, hero protegido salvo la sustitución
  explícita de fondo registrada en ADR-045, fuente v2 reconciliada, método
  visible, densidad Belief/Method corregida según ADR-046/047 y autoridad
  verificable sin badges ni claims pendientes.
- [x] Rediseñada Thank-you con `Your Message Is With Me`, renderer/CSS aislados,
  hero compartido, copy factual, un único anchor a Reviews y QA responsive;
  permanece `ready/noindex` y fuera de sitemap/`llms.txt`. Privacy conserva su
  evaluación independiente.
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
- [x] Resuelto: Headshots usa
  `/uploads/review-lisa-griffith-headshot-tricities.jpg` por instrucción
  explícita del usuario.
- [ ] TODO(contexto): ¿se planea publicar Elopement en otra fase? — Lisa.
- [ ] TODO(contexto): ¿cuál es el link definitivo de Google Reviews? — Lisa.
- [ ] TODO(contexto): ¿quién aprueba formalmente Privacy y cuándo? — cliente.
- [x] Resuelto por confirmación del usuario el 2026-08-11: Netlify Forms y sus
  notificaciones están configurados y funcionando en producción. ADR-053
  retiró el gate; queda una prueba controlada del POST nativo tras el deploy.
- [ ] TODO(contexto): ¿quién verificará los dashboards de Clarity y Google
  Analytics y el acceso a Search Console? — administrador del cliente.
- [ ] TODO(contexto): ¿existe un tablero de tareas externo? — William.

## Hecho recientemente

- [x] Simplificado TinaCMS con previews deterministas para 19 páginas,
  quick edit completo, campos de sistema protegidos, queries por necesidad y
  validación 5 colecciones/38 documentos/20 rutas/19 renderers, sin rediseño.
- [x] Corregida la autoridad visual a la homepage Netlify.
- [x] Migrada la paleta earth-and-gold.
- [x] Creadas y validadas 20 rutas Astro; la antigua Portfolio fue retirada y
  conserva un 301 hacia Reviews.
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
- [x] Renovados hero y print Biography de Homepage en `ec4c734`, con AVIF/WebP
  art-directed, una sola descarga del hero, portfolio ADR-048 intacto y QA en
  cinco anchos.
- [x] **Histórico ADR-050:** publicado localmente Contact en `dd4a590` con gate tras 2xx, un único
  `session-estimate`, error/retry/no-JS, analítica sin PII, schema sobrio,
  sitemap 10, `llms.txt` 9 y QA mockeado en cuatro anchos.
- [x] Restaurado Contact transparente en `df6db0f`: `$160` visible en SSR,
  cálculo vivo, campos requeridos restaurados y POST nativo a `/thank-you/`,
  sin AJAX/gate/reveal/retry ni eventos personalizados; QA integral PASS y SEO
  publicado intacto.
- [x] Renovada la fotografía de Branding/Headshots en `127c539`: 18 JPEG Drive,
  72 WebP regenerables, 11 fuentes únicas por ruta, alt literal, XMP local sin
  GPS y QA responsive completo, sin borrar media de producción ni publicar las
  rutas draft.
- [x] Rediseñado Newborn Comparison en `1dd00d3` con House Archive, renderer/CSS
  aislados, copy definitivo completo, nueve imágenes existentes y QA integral,
  preservando `draft/noindex` y sus tres gates de publicación.
- [x] Publicado Journal hub en `ffe5198` con `ready/index`, cuatro anchors
  seguros, `CollectionPage` + breadcrumb, sitemap 12, `llms.txt` 11 y QA
  responsive completo; los dos artículos pendientes permanecen sin links.
- [x] Rediseñado y publicado Reviews con dirección `Words Become Pictures`,
  hero compartido, diez testimonios, `JournalBook`, un único CTA, sitemap 13,
  `llms.txt` 12 y QA responsive/accesible completo.
