# 30 — Registro de decisiones (ADR)

> **Append-only.** Nunca editar o borrar una entrada existente. Si una decisión
> queda obsoleta, agregar una nueva y marcar la anterior como supersedida.
>
> Las entradas siguientes se registraron retrospectivamente el 2026-08-08 a
> partir del historial de trabajo y el estado verificado del repositorio. Cuando
> la fecha original exacta no fue verificable, se indica expresamente.

---

### ADR-001 — La homepage Netlify es la autoridad visual
- **Fecha:** 2026-08-08 (registro retrospectivo; decisión previa vigente)
- **Estado:** Aceptada
- **Contexto:** Al inicio se interpretó el dominio personalizado como sitio base,
  pero el usuario aclaró que estaba reconstruyendo desde cero y que este repo es
  el deployment de `itsakeeperphotography.netlify.app`.
- **Decisión:** El render Netlify aprobado manda sobre el dominio legado,
  inspiración y `DESIGN.md`, en ese orden.
- **Alternativas descartadas:** Copiar o modernizar
  `www.itsakeeperphotography.com` se descartó porque no es la fundación; imponer
  `DESIGN.md` sobre la homepage se descartó porque alteraría una composición ya
  aprobada.
- **Consecuencias:** Cambios de homepage deben ser contenidos; el dominio legado
  solo se usa para inventario de redirects antes del cutover.

### ADR-002 — Sistema editorial earth-and-gold, no template genérico
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Lisa se diferencia de la fotografía local light-and-airy; el
  sitio debe comunicar sombras cálidas antes de leer copy.
- **Decisión:** Usar la paleta oficial, superficies estratificadas, arcos,
  solapes, prints y hairlines de 1px; conservar formas rectangulares y motion
  pausado.
- **Alternativas descartadas:** Blanco/negro puros, azul, gold gradients,
  glassmorphism, sombras de tarjetas, bordes redondeados y grids de cards
  repetitivas se descartaron por romper el lenguaje de marca.
- **Consecuencias:** Cada ruta debe variar composición sin cambiar de sistema;
  contraste se corrige ajustando superficies, no abandonando la paleta.

### ADR-003 — Astro estático + TinaCMS + Netlify
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El sitio necesita velocidad fotográfica, contenido editable y
  hosting/formularios simples.
- **Decisión:** Mantener Astro como salida estática, Tina como capa editorial y
  Netlify como producción, forms, functions y blobs.
- **Alternativas descartadas:** Rehacer en otro framework o implementar backend
  propio se descartó por no aportar valor al sitio actual y aumentar operación.
- **Consecuencias:** El contenido es editable sin convertir todo el sitio en una
  SPA; integraciones dinámicas puntuales viven en Functions.

### ADR-004 — Manifiesto tipado de 21 rutas
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** La publicación parcial exige una fuente única para status,
  metadata, schema y crawling.
- **Decisión:** `src/lib/page-manifest.ts` define todas las rutas públicas y su
  estado de contenido/búsqueda.
- **Alternativas descartadas:** Duplicar listas en sitemap, robots, footer y
  páginas se descartó por drift; inferir readiness por existencia de archivo se
  descartó porque una página puede existir pero contener hechos pendientes.
- **Consecuencias:** Toda nueva ruta o cambio de indexación debe actualizar el
  manifiesto y pasar el validador.

### ADR-005 — Gating de staging y release por entorno
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** La base Netlify es staging mientras se completan datos; Google no
  debe indexar rutas incompletas.
- **Decisión:** `SITE_MODE=staging` usa origen Netlify y noindex global;
  `SITE_MODE=release` usa el dominio custom y respeta readiness por ruta.
- **Alternativas descartadas:** Publicar páginas delgadas, indexar staging o
  confiar solo en robots.txt se descartó por riesgo SEO y de contenido.
- **Consecuencias:** El build valida coherencia del contexto; `/thank-you/`
  siempre queda noindex y Privacy sigue noindex hasta aprobación.

### ADR-006 — Máximo cuatro enlaces internos dentro de main
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El brief exige que cada enlace editorial tenga propósito y que
  la CTA final a Contact siempre forme parte de la ruta.
- **Decisión:** Contar anchors same-origin dentro de `<main>`; header, footer,
  externos, email y teléfono no cuentan. No hay excepción para directorios.
- **Alternativas descartadas:** Eximir hubs/directorios o enlazar todas las cards
  se descartó porque diluye señal y contradice el límite explícito.
- **Consecuencias:** `scripts/validate-site.mjs` falla al quinto enlace; módulos
  pueden mostrar más opciones sin convertirlas todas en links de body.

### ADR-007 — Copy literal y placeholders no inventados
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** La voz procede de Lisa y varios hechos aún necesitan aprobación.
- **Decisión:** Conservar cada frase suministrada; registrar faltantes en
  `src/content/pending.ts`, mantener comentarios `CONTENT PENDING` cuando
  corresponda y no renderizar sustitutos.
- **Alternativas descartadas:** Reescribir para “mejorar SEO”, abreviar o usar
  stock/datos plausibles se descartó por riesgo de falsedad y pérdida de voz.
- **Consecuencias:** Varias rutas visualmente completas permanecen draft; avanzar
  depende de confirmaciones humanas.

### ADR-008 — Tina edita contenido, no la composición
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El sitio requiere composiciones altamente art-directed que no
  deben degradarse por combinaciones arbitrarias en CMS.
- **Decisión:** Tina expone campos de contenido y media; layout, tokens y
  dispositivos compositivos permanecen en componentes/CSS.
- **Alternativas descartadas:** Page builder libre o schemas de layout universales
  se descartaron porque producirían páginas templadas e inconsistentes.
- **Consecuencias:** Nuevos tipos de composición requieren código; ediciones de
  copy no lo requieren.

### ADR-009 — Hero de Seniors como componente base
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Family, Newborn y About tenían aperturas visualmente distintas; el
  usuario eligió explícitamente Seniors como estándar.
- **Decisión:** Centralizar estructura, tipografía, espaciado y prints laterales
  en `EditorialHero.astro`, adaptando copy/fotos por ruta.
- **Alternativas descartadas:** Mantener héroes totalmente independientes o
  elegir otro hero se descartó por inconsistencia y por preferencia expresa.
- **Consecuencias:** Branding, Investment, Journal, ciudades y otras páginas
  especializadas reutilizan el mismo lenguaje de apertura.

### ADR-010 — Variación de páginas mediante motivos existentes
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Repetir cuatro secciones en 18 páginas sería genérico, pero crear
  sistemas independientes rompería coherencia.
- **Decisión:** Variar orden, superficie, lado del arco, solapes y whitespace
  usando motivos de homepage/Portfolio: hero fotográfico, arch+print, ledger,
  review bands, paper/tape y crossing hairlines anclados.
- **Alternativas descartadas:** Cards iguales para todo o layouts ajenos se
  descartaron. Líneas decorativas flotantes también se eliminaron/reanclaron.
- **Consecuencias:** Cada ruta necesita criterio y QA propio; toda línea debe
  bordear, cruzar o extender geometría real.

### ADR-011 — Formularios reales con Netlify Forms
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Netlify es el host y el formulario previo simulaba éxito mediante
  `/api/inquiry` y logging de PII.
- **Decisión:** Usar forms HTML detectables estáticamente, honeypot, POST y
  `/thank-you/`; mantener fallback sin JavaScript.
- **Alternativas descartadas:** Endpoint externo, Resend/Astro propio y simulación
  local se descartaron por complejidad o falsedad del estado enviado.
- **Consecuencias:** El código no contiene credenciales de correo; entrega y
  notificaciones se gestionan en Netlify Dashboard.

### ADR-012 — “Session estimates”, no calculadora ni booking
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Contact se convirtió en una herramienta interactiva para que
  cliente y Lisa compartan una estimación sin contradecir contrato/pago posterior.
- **Decisión:** Llamarla “session estimates”; mostrar total y disclaimer de que
  Lisa confirma antes de contrato/pago.
- **Alternativas descartadas:** “Price calculator”, ocultar el total, presentar
  checkout o afirmar una reserva se descartó por tono, expectativas y entidades
  de Google.
- **Consecuencias:** El formulario capta intención detallada pero no cierra la
  transacción; Lisa continúa manualmente.

### ADR-013 — Precios centralizados y alcance cerrado del estimador
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El HTML de referencia y las imágenes de precios debían dejar una
  sola verdad numérica.
- **Decisión:** `src/lib/session-pricing.ts` contiene servicios, tres coberturas,
  tres colecciones, add-ons y cargo por personas. Los valores $25, $20, $75 y
  $15/person son definitivos. Newborn se añade; Pet/Elopement no se publican.
- **Alternativas descartadas:** Duplicar precios en copy/componentes, conservar
  “second location beyond package” o publicar servicios no aprobados se descartó.
- **Consecuencias:** Cambios de precio se hacen primero en esta librería y luego
  se revisa copy; el usuario ve un estimado reproducible.

### ADR-014 — El destinatario oculto no configura email
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** `PUBLIC_INQUIRY_NOTIFICATION_EMAIL` puede viajar en el formulario,
  pero Netlify Forms no lo interpreta como routing de notificación.
- **Decisión:** Conservarlo como dato/auditoría del build y configurar email para
  ambos forms en Netlify Dashboard.
- **Alternativas descartadas:** Suponer que el hidden field enviaría correo o
  implementar mailer propio se descartó.
- **Consecuencias:** Producción pretende `itsakeeperphoto@gmail.com`; pruebas
  usaron `globalbridge360@gmail.com`; la verificación es una tarea externa.

### ADR-015 — Preloader cinematográfico solo en homepage y sin wordmark intermedio
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El preloader debía aportar una apertura premium sin ralentizar la
  navegación interna. El primer diseño mostró el logo después del flash y el
  usuario pidió revelación directa.
- **Decisión:** Incluir `SitePreloader.astro` solo en `/`; después del flash el
  obturador abre directamente el sitio.
- **Alternativas descartadas:** Mostrarlo en todas las rutas, persistir estado en
  storage o mantener el wordmark post-flash se descartó por fricción/preferencia.
- **Consecuencias:** Se reproduce en cada carga nueva de homepage en memoria de
  página; otras rutas cargan normalmente; reduced motion salta la secuencia.

### ADR-016 — Reviews como polaroids en loop, flip no persistente
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** La primera versión de reviews quedó estática, no giraba y usaba
  clips cuadrados/botones que no correspondían al concepto.
- **Decisión:** Loop continuo arqueado, clip de bronce, flip 3D por hover/focus y
  reanudación al salir; ocultar scrollbar y botones Pause/Read note/Show photo.
- **Alternativas descartadas:** Click que deja la tarjeta fija, pausa manual,
  tape genérico o carrusel inmóvil en tablet/móvil se descartaron por feedback.
- **Consecuencias:** La interacción es efímera y el movimiento se detiene solo
  mientras se lee una card; reduced motion debe seguir siendo accesible.

### ADR-017 — Conteo GBP diario con cache y fallback sin cifra
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El texto “96 five-star reviews” no debe quedar congelado ni
  inventado.
- **Decisión:** Job diario consulta GBP, guarda resumen en Netlify Blobs y un
  endpoint GET/HEAD lo sirve a homepage. Si falla, mostrar link sin número.
- **Alternativas descartadas:** Hardcode diario, scraping público o romper la UI
  sin credenciales se descartó por fragilidad y precisión.
- **Consecuencias:** Requiere Google Cloud/OAuth y perfil autorizado; no emitir
  AggregateRating hasta validar datos y atribución.

### ADR-018 — Portfolio se conserva y Journal es el hub de planificación
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El plan original enumeró 18 páginas, pero el deployment ya tenía
  un Portfolio con composición de libro aprobada.
- **Decisión:** Mantener `/portfolio/` como ruta pública adicional; `/journal/`
  se convierte en hub editorial y enlaza Portfolio desde contexto/footer.
- **Alternativas descartadas:** Reemplazar Portfolio por Journal o borrar el
  flipbook se descartó por destruir una pieza aprobada.
- **Consecuencias:** El sitio tiene 21 rutas públicas totales contando utilidades;
  Portfolio está en sitemap pero no en llms.

### ADR-019 — Dirección legada y mapa no se publican
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El JSON heredado contiene `62 Canyon St`, pero el brief pide no
  publicar street address/map pin.
- **Decisión:** Renderizar “Richland, Washington · Serving Richland, Kennewick
  and Pasco”; schema solo locality/region/country.
- **Alternativas descartadas:** Conservar map URL, pin o address completa se
  descartó por privacidad y falta de confirmación pública.
- **Consecuencias:** Futuros componentes deben evitar leer el campo legado sin
  filtro explícito.

### ADR-020 — Redirects uno-a-uno y cutover bajo autorización
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El dominio final ya tiene URLs históricas y no conviene perder
  intención SEO.
- **Decisión:** Mantener redirects relevantes uno-a-uno en `public/_redirects`;
  no redirigir todo a homepage; no tocar DNS/dominio primario sin permiso.
- **Alternativas descartadas:** Catch-all homepage o cutover automático se
  descartaron por mala UX, soft-404s y riesgo operativo.
- **Consecuencias:** Antes del lanzamiento hay que probar legacy inventory y
  canonicals en el dominio final.

### ADR-021 — Generación de crawler outputs desde manifiesto
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Sitemap, robots y llms deben cambiar juntos cuando una ruta pasa
  de draft a ready.
- **Decisión:** Generarlos en routes Astro desde `page-manifest.ts` y el modo de
  deploy.
- **Alternativas descartadas:** XML/TXT estáticos editados a mano se descartaron
  por desincronización.
- **Consecuencias:** El build puede fallar si la membresía no corresponde; el
  lanzamiento solo requiere cambiar estado verificado y reconstruir.

### ADR-022 — QA visual continuo y evidencia, no solo revisión de código
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** El proyecto tiene composiciones responsivas complejas y errores
  previos de overflow, líneas, imágenes aplastadas y contraste que no se ven en
  lectura estática.
- **Decisión:** Playwright en cuatro breakpoints por ruta y Lighthouse mobile/
  desktop antes de producción; guardar capturas.
- **Alternativas descartadas:** Verificar todo al final o considerar build verde
  como diseño terminado se descartó.
- **Consecuencias:** La evidencia del 2026-07-21 es histórica; cambios posteriores
  exigen una nueva corrida completa.

### ADR-023 — Herramientas de desarrollo no deben filtrarse a producción
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Agentation se instaló para feedback visual y Tina/React añaden
  tooling que no debe cargar indiscriminadamente.
- **Decisión:** Agentation es dev-only; registrar Tina islands y scripts por ruta;
  cargar Portfolio/inquiry/preloader únicamente donde se necesitan.
- **Alternativas descartadas:** Bundle global de herramientas o JS común grande
  se descartó por rendimiento.
- **Consecuencias:** Al agregar una interacción hay que revisar import boundary y
  bundle de homepage.

### ADR-024 — Las ubicaciones locales exactas requieren confirmación
- **Fecha:** 2026-08-08 (registro retrospectivo)
- **Estado:** Aceptada
- **Contexto:** Fotografías y competidores no prueban dónde Lisa trabaja ni qué
  recomienda; inventarlo dañaría confianza y SEO local.
- **Decisión:** La guía de lugares usa lenguaje útil sin atribuir ubicaciones no
  verificadas; nombres/comentarios específicos quedan pending.
- **Alternativas descartadas:** Inferir spots por imagen, reutilizar listas de
  competidores o publicar páginas locales delgadas se descartó.
- **Consecuencias:** Richland/Kennewick/Pasco y el artículo de locations siguen
  draft hasta recibir conocimiento de Lisa.
- **SUPERSEDIDA POR ADR-035:** únicamente la consecuencia que mantenía
  Kennewick en draft por falta de conocimiento local; la prohibición de inferir
  spots o atribuciones visuales sigue vigente.

### ADR-025 — Los transcripts de sesión no se publican por defecto
- **Fecha:** 2026-08-08
- **Estado:** Aceptada
- **Contexto:** `scripts/handoff.sh` respalda el rollout más reciente, pero un
  transcript puede contener información sensible y el primer push fue bloqueado
  precisamente por intentar incluirlo en el commit.
- **Decisión:** Mantener el backup `*.jsonl` solo en la máquina local y excluirlo
  con `.handoff/sessions/.gitignore`; `docs/context/` es la memoria compartida.
- **Alternativas descartadas:** Subir automáticamente todo el transcript se
  descartó por privacidad; eliminar el backup local se descartó porque sigue
  siendo útil como red de seguridad del dueño de la máquina.
- **Consecuencias:** Un agente remoto recibe contexto curado y sin secretos. Un
  transcript solo puede publicarse después de revisión y autorización explícita.

### ADR-026 — El repositorio oficial se verifica antes de editar o hacer push
- **Fecha:** 2026-08-08
- **Estado:** Aceptada
- **Contexto:** Existen dos clones/repositorios similares y una intervención de
  analítica se envió por error a `williammelo533/itsakeeper-astro` mientras el
  usuario revisaba `itsakeeperphoto/itsakeeperphotography`.
- **Decisión:** Declarar
  `https://github.com/itsakeeperphoto/itsakeeperphotography.git` como remoto
  oficial en `AGENTS.md` y exigir `git remote get-url origin` antes de toda
  edición o push.
- **Alternativas descartadas:** Confiar únicamente en el nombre de la carpeta o
  en el contexto de conversación se descartó porque ambos ya produjeron una
  asignación incorrecta.
- **Consecuencias:** Un agente debe detenerse si `origin` no coincide. El repo
  `williammelo533/itsakeeper-astro` no recibe cambios de este proyecto.

### ADR-027 — Clarity y Google tag se cargan desde el head compartido
- **Fecha:** 2026-08-08
- **Estado:** Aceptada
- **Contexto:** La memoria afirmaba que Clarity estaba instalado, pero los
  commits históricos habían usado un `Base.astro` temporal en la raíz y el
  layout real no contenía analítica. El usuario suministró ambos snippets.
- **Decisión:** Cargar Microsoft Clarity `xyqkkqom4v` y Google tag/GA4
  `G-0YW8M601L1` en el `<head>` de `src/layouts/Base.astro`, usando scripts
  inline sin transformación de Astro para conservar sus bootstraps.
- **Alternativas descartadas:** Duplicar los snippets por página o volver a
  crear un `Base.astro` en la raíz se descartó porque el layout bajo `src/`
  gobierna las 21 rutas. No se añadió gating porque la solicitud fue global.
- **Consecuencias:** Ambos tags aparecen en staging y release y pueden registrar
  tráfico de ambos entornos. Falta verificar los dashboards y completar la
  revisión humana de Privacy/consentimiento antes del lanzamiento.

### ADR-028 — El handoff excluye transcripts con controles redundantes
- **Fecha:** 2026-08-08
- **Estado:** Aceptada
- **Contexto:** El script asumía que `*.jsonl` estaba ignorado, pero este clon no
  tenía `.handoff/sessions/.gitignore`; el primer handoff preparó un transcript
  local antes de que el push fallara por permisos.
- **Decisión:** Mantener `*.jsonl` ignorado, excluirlo explícitamente del
  `git add` del handoff y abortar si Git detecta cualquier transcript rastreado o
  preparado para commit. `AGENTS.md` lo prohíbe expresamente.
- **Alternativas descartadas:** Confiar solo en un comentario del script o solo
  en `.gitignore` se descartó porque una configuración faltante o un archivo ya
  rastreado puede eludir una única barrera.
- **Consecuencias:** El backup permanece disponible en disco, pero no puede
  entrar silenciosamente en el historial. El transcript del intento fallido se
  retiró del índice antes de publicar y nunca llegó al remoto.

### ADR-029 — La guía de localizaciones enseña el criterio sin revelar spots
- **Fecha:** 2026-08-08
- **Estado:** Aceptada; precisa y supersede parcialmente las consecuencias de
  ADR-024 para esta ruta, no para las páginas de ciudad.
- **Contexto:** Lisa entregó una versión v2 que sustituye la lista de doce
  lugares por una guía sobre luz, estación y tipo de sesión. La implementación
  ya renderizaba ese copy, pero `paginas/15-journal-locations.md` conservaba la
  versión antigua y podía reintroducir ubicaciones explícitas en una edición
  futura.
- **Decisión:** Tratar el documento v2 como fuente editorial de
  `/journal/family-photo-locations-tri-cities/`, mantener anónimos los spots y
  no añadir fotografías ni hechos no aprobados. La ruta permanece
  `draft/noindex` mientras `[FECHA]` siga pendiente.
- **Alternativas descartadas:** Fusionar la lista v1, nombrar Chamna por
  inferencia o marcar la ruta lista sin fecha se descartó por confidencialidad,
  exactitud editorial y gating SEO.
- **Consecuencias:** El artículo queda completo salvo la fecha editorial; las
  páginas Richland, Kennewick y Pasco conservan sus propios pendientes de
  conocimiento local. Cualquier autorización futura para nombrar un spot debe
  documentarse en un ADR nuevo.
- **SUPERSEDIDA POR ADR-030:** solo la consecuencia que mantenía esta guía en
  `draft/noindex` por falta de fecha. El criterio de spots anónimos sigue
  vigente.

### ADR-030 — Family Photo Locations se publica con gates explícitos
- **Fecha:** 2026-08-08
- **Estado:** Aceptada; supersede el gate temporal de ADR-029 para esta ruta.
- **Contexto:** El usuario aprobó `2026-08-08` como fecha editorial y pidió
  terminar la guía para producción. Aunque el manifiesto podía pasarla a
  `ready/index`, `config/netlify-headers/release` mantenía un wildcard
  `/journal/*` que habría enviado `X-Robots-Tag: noindex` al artículo publicado.
  También pidió seis correcciones visuales y una foto autorizada para el cierre.
- **Decisión:** Marcar únicamente
  `/journal/family-photo-locations-tri-cities/` como `ready/index`, usar
  `2026-08-08` en Article y `lastModified`, incluirla en sitemap/llms y sustituir
  el wildcard de Journal por reglas noindex explícitas para el hub y los tres
  artículos draft. Mantener los spots anónimos como criterio final, no como
  pendiente. Usar como cierre decorativo la fotografía `010A6353 copy.jpg` del
  folder autorizado “Family Session - Richland”, con crop completo en móvil.
- **Alternativas descartadas:** Cambiar solo meta/sitemap se descartó porque el
  header HTTP lo contradecía; conservar `/journal/*` se descartó porque bloquea
  cualquier artículo publicado; nombrar Chamna o inventar datos se descartó por
  el criterio editorial aprobado; usar una imagen ajena al folder autorizado se
  descartó por trazabilidad.
- **Consecuencias:** El sitemap release contiene cuatro URLs y `llms.txt` tres.
  La guía emite LocalBusiness, WebSite, Article, FAQPage y BreadcrumbList
  parseables; FAQPage es válido pero no promete rich results de Google para un
  sitio comercial. Las páginas de ciudad y los otros artículos conservan sus
  propios gates. Todo futuro artículo de Journal debe recibir una regla header
  explícita o eliminar la que le corresponda al pasar a producción.

### ADR-031 — “Four Kinds” usa un contact sheet asimétrico y verificable
- **Fecha:** 2026-08-08
- **Estado:** Aceptada.
- **Contexto:** El usuario pidió rediseñar la sección con dos referencias de
  fotografía editorial. La retícula anterior ya era estable, pero seguía
  leyendo como una imagen principal seguida por tres cards equivalentes y no
  expresaba la jerarquía, los offsets ni el vacío de las referencias.
- **Decisión:** Mantener copy y cuatro assets, pero componerlos en 12 columnas:
  01 dominante 3:2, 02 horizontal desplazada, 03 como único arco y 04 como
  única impresión con mat marfil. A 768–1050 px se usa 2×2 y a ≤767 px una
  columna sin offsets. No se fuerzan los paisajes a retrato. Los alt texts se
  describen literalmente y cada artículo referencia su `h3` con
  `aria-labelledby`.
- **Alternativas descartadas:** Copiar cinta, papel rasgado, salpicaduras,
  rotaciones o sombras de las referencias se descartó por contradecir
  `DESIGN.md`; conservar cuatro cards equivalentes se descartó por falta de
  jerarquía; recortar las dos fotos 3:2 como arcos se descartó porque elimina
  personas o el contexto del río.
- **Consecuencias:** Esta sección depende de los ratios y safe crops actuales;
  un reemplazo de asset exige nueva revisión de `object-position`. El QA mínimo
  queda fijado en 1728, 1440, 1200, 900 y 390 px, con orden 01–04, imágenes
  completas, cero overflow y cero solapamiento con la sección siguiente.

### ADR-032 — Richland v2 prueba residencia y mantiene una única condición de publicación
- **Fecha:** 2026-08-08
- **Estado:** Aceptada.
- **Contexto:** El documento v2 suministrado para
  `/richland-wa-photographer/` reemplaza el inventario de spots por conocimiento
  local de primera mano, declara el formato newborn in-home y la política de
  viaje Tri-Cities, y deja pendiente solo una galería de 6–10 sesiones reales.
  También incluía Canyon Street y una dirección completa, en conflicto con la
  privacidad fijada por ADR-019.
- **Decisión:** Tratar v2 como fuente editorial y publicar todo su copy salvo la
  calle/dirección privada; conservar solo locality/region/country en schema.
  No renderizar “Recent Richland Sessions” hasta que cada ítem tenga fotografía
  con procedencia Richland y alt literal verificados. Mantener la ruta
  `draft/noindex`, fuera de sitemap/llms y con header HTTP noindex hasta cerrar
  esa galería. Traducir las referencias a un “light ledger” asimétrico de 12
  columnas, un solo arco y ratios fotográficos naturales; no copiar tape,
  rotaciones, rasgados, sombras ni falsos prints. Para cumplir ADR-006, el CTA
  del hero es un botón que desplaza al CTA final y el directorio de cinco
  servicios es informativo; los cuatro anchors de `<main>` son About, Locations
  Guide, Investment y Contact final.
- **Alternativas descartadas:** Publicar la dirección, reintroducir Howard Amon
  o Badger Mountain, completar la galería con filenames no verificados, forzar
  paisajes dentro de marcos verticales o marcar la ruta indexable solo porque el
  copy está completo se descartó por privacidad, exactitud y riesgo de página
  local sin evidencia suficiente.
- **Consecuencias:** Richland conserva una sola entrada en
  `src/content/pending.ts`; Newborn y travel dejan de ser preguntas para esta
  ruta según la fuente aprobada. Cualquier cambio a `ready/index` exige 6–10
  sesiones verificadas, nuevo QA responsive/schema y revisión explícita de los
  crawler gates. No cambian routing, tipos, Tina, manifiesto ni headers.
- **SUPERSEDIDA POR ADR-034:** únicamente la galería como requisito de
  publicación; la privacidad, exactitud y condición de no inventar media siguen
  vigentes.

### ADR-033 — El directorio Richland enlaza sus cinco servicios
- **Fecha:** 2026-08-08
- **Estado:** Aceptada; excepción limitada a ADR-006 y a la decisión de
  directorio informativo de ADR-032.
- **Contexto:** El usuario pidió que cada fila de “What I Photograph in
  Richland” redirija a la página del servicio y comunique esa acción con
  animación. Los cinco destinos ya estaban suministrados en el contenido, pero
  ADR-006 impedía renderizarlos como anchors y dejaba el listado sin navegación.
- **Decisión:** Convertir las cinco filas completas en anchors nativos hacia
  Senior, Family, Newborn, Branding y Headshots. Autorizar exclusivamente en
  `/richland-wa-photographer/` nueve anchors same-origin dentro de `<main>`:
  tres enlaces de prosa, cinco del directorio y la CTA final. El CTA del hero
  continúa como botón de scroll. La respuesta visual usa un barrido horizontal
  y desplazamientos de título/flecha SVG de 180–220 ms; el foco es inmediato y
  `prefers-reduced-motion` elimina transforms.
- **Alternativas descartadas:** Redirigir con `onclick` desde botones se
  descartó por semántica, teclado y comportamiento nativo; enlazar solo el
  título se descartó porque reduce el target; aplicar la excepción a todos los
  hubs se descartó porque diluiría el límite editorial global.
- **Consecuencias:** ADR-006 sigue siendo la regla por defecto; esta única ruta
  tiene una excepción trazable y no cambia sitemap, indexación ni el gate de la
  galería Richland. Cualquier nuevo directorio enlazado requiere aprobación y
  ADR propios.
- **SUPERSEDIDA POR ADR-034:** únicamente la consecuencia que no cambiaba
  sitemap/indexación; la excepción de nueve anchors sigue vigente.

### ADR-034 — Richland se publica sin esperar la galería opcional
- **Fecha:** 2026-08-08
- **Estado:** Parcialmente supersedida por ADR-040 en la galería y
  `lastModified`; sigue vigente la publicación independiente del gate original.
- **Contexto:** El usuario decidió añadir la galería después y autorizó ahora
  que `/richland-wa-photographer/` pase a producción. El copy local, diseño,
  privacidad, enlaces, FAQ y schema ya estaban completos y verificados; la
  sección “Recent Richland Sessions” no se renderiza mientras no tenga media
  real.
- **Decisión:** Tratar la galería como mejora posterior no bloqueante. Marcar
  Richland `ready/index` en contenido y manifiestos, usar `2026-08-08` como
  `lastModified`, incluir la canonical en sitemap y `llms.txt`, y retirar su
  `X-Robots-Tag` noindex de release. Staging conserva noindex global. Mantener
  la galería condicional: cuando se añada, cada fotografía debe tener
  procedencia Richland y alt literal verificados sin revelar el spot exacto.
- **Alternativas descartadas:** Dejar `ready/noindex` se descartó porque no
  cumple la autorización de indexar; añadir ítems vacíos o completar la galería
  con filenames se descartó porque inventaría evidencia; editar directamente
  el XML generado se descartó porque el manifiesto es la fuente canónica.
- **Consecuencias:** El sitemap release pasa de cuatro a cinco URLs y
  `llms.txt` de tres a cuatro. `src/content/pending.ts` deja de registrar la
  galería; el backlog la conserva como mejora opcional. Richland debe emitir
  meta robots index y no recibir un header HTTP noindex en release.

### ADR-035 — Kennewick v2 se publica sin galería y con directorio navegable
- **Fecha:** 2026-08-08
- **Estado:** Parcialmente supersedida por ADR-040 en la ausencia de galería y
  la fecha de modificación; el copy, publicación y excepción a ADR-006 siguen
  vigentes.
- **Contexto:** El usuario declaró definitivo el documento Kennewick v2. Este
  reemplaza los spots exactos de v1 por conocimiento local general y por el
  contraste entre la edición cálida/moody de Lisa y el estilo light and airy.
  El usuario decidió añadir después la galería de sesiones y autorizó terminar
  ahora la ruta como `ready/index` en sitemap.
- **Decisión:** Tratar v2 como única fuente editorial, retirar v1 y no atribuir
  fotografías Tri-Cities a Kennewick sin evidencia. La galería condicional no
  se renderiza y queda como mejora opcional. Publicar Kennewick `ready/index`
  después de QA con `lastModified: 2026-08-08`, sitemap/llms y headers
  coherentes. El directorio de cinco servicios se renderiza como navegación
  nativa porque el documento lo define así; autorizar únicamente en esta ruta
  nueve anchors same-origin dentro de `<main>`: tres enlaces de prosa, cinco de
  servicio y la CTA final. El CTA del hero desplaza al cierre.
- **Alternativas descartadas:** Conservar Columbia Park u otros spots de v1,
  inventar una galería con portfolio genérico, escribir alt text Kennewick a
  partir de filenames o mantener la ruta noindex después de la autorización se
  descartó por exactitud y por contradecir el copy aprobado.
- **Consecuencias:** La página debe conservar solo el pendiente opcional de la
  galería fuera del gate de publicación. ADR-006 sigue siendo la regla general;
  cualquier otro directorio con más de cuatro enlaces requiere aprobación y
  ADR propios.

### ADR-036 — Kennewick adopta el lenguaje visual de Seniors
- **Fecha:** 2026-08-09
- **Estado:** Parcialmente supersedida por ADR-040 únicamente en la galería
  opcional; conserva la dirección visual y los contratos editoriales, de
  publicación y navegación de ADR-035.
- **Contexto:** El usuario rechazó el hero split y la dirección “Warm Proof /
  Tonal Contact Sheet” implementados en Kennewick. Fijó como autoridad visual
  directa `/senior-photographer-tri-cities-wa/`, mantuvo Homepage y `DESIGN.md`
  como autoridades del sistema y pidió revisar las referencias con
  `image-to-code` antes de cualquier implementación.
- **Decisión:** Reutilizar en Kennewick la gramática comprobada de Seniors:
  `EditorialHero` full-bleed con título centrado, CTA de scroll, dos prints
  decorativos y paper edge; secciones editoriales con arcos, impresiones,
  hairlines, superficies tonales, FAQ ledger y cierre fotográfico. No añadir
  una frase script si el contenido aprobado no la suministra. Antes de editar
  Astro/CSS se deben generar y aprobar composiciones frescas con
  `image-to-code`; después se implementará contra ellas usando solo fotografías
  existentes con descripción literal.
- **Alternativas descartadas:** Pulir el hero split, convertir las referencias
  en una copia literal, presentar fotografías genéricas como prueba de una
  sesión Kennewick o inventar una frase manuscrita se descartó por contradecir
  la instrucción visual, la trazabilidad de media y el copy v2.
- **Consecuencias:** Copy, nueve anchors, FAQ/schema 4:4, galería opcional,
  `ready/index`, sitemap, `llms.txt` y headers no cambian. El brief local y la
  arquitectura deben reemplazar la dirección anterior en el mismo commit que
  implemente el rediseño. El QA mínimo conserva 1440, 1200, 900 y 390 px,
  además de contraste, foco, reduced motion, crops y cero overflow.

### ADR-037 — Los originales web se limitan y las variantes se generan en paralelo
- **Fecha:** 2026-08-09
- **Estado:** Aceptada.
- **Contexto:** `public/` pesaba ~130 MiB y `dist/` ~148 MiB. Cuatro JPEG de
  24 MP sumaban 76.7 MiB; uno se publicaba además como Open Graph de un artículo
  listo y producción lo servía con 15,291,345 bytes. La regeneración limpia de
  172 variantes tardaba 114.80 s porque Sharp usaba effort 6 de forma
  secuencial. El usuario autorizó optimizar residuos con la condición de no
  borrar fotografías usadas en producción.
- **Decisión:** conservar y optimizar en sitio los JPEG usados que excedan
  2400 px o 700 KiB, con quality 82, `mozjpeg`, salida progresiva, metadatos y
  reemplazo temporal validado. Generar WebP 400/640/960/1440 con quality 72,
  effort 4 y hasta cuatro workers. Ejecutar el guard antes de variantes tanto
  en build local como Netlify; Netlify puede corregir el checkout efímero y el
  entorno local requiere `--write`. Retirar solo diez fuentes cuya ausencia de
  referencias quedó demostrada contra las 21 rutas, CSS, contenido, Tina,
  schema y Open Graph; Git conserva su recuperación.
- **Alternativas descartadas:** borrar originales todavía usados, migrar de
  inmediato todo el sitio a Netlify Image CDN, conservar JPEG de 24 MP como
  fallback o depender únicamente de caché se descartó por compatibilidad,
  alcance y porque no resolvía simultáneamente peso de deploy, bots sociales y
  tiempo de build.
- **Consecuencias:** `public/` queda en ~40 MiB y `dist/` en ~51 MiB; once JPEG
  usados mantienen composición y presencia de metadatos preexistentes. La fase
  limpia de variantes tarda 5.09 s y el build limpio esperado ronda 41 s.
  Cualquier fotografía futura que exceda el contrato debe optimizarse antes de
  quedar persistida; restaurar un asset retirado exige nueva referencia y QA.

### ADR-038 — Kennewick usa media verificada sin convertirla en una galería falsa
- **Fecha:** 2026-08-09
- **Estado:** Parcialmente supersedida por ADR-040 en la ausencia de galería,
  el mínimo/mezcla exigidos y el conteo de H2; la dirección visual, procedencia,
  exclusión de Benton y contratos restantes permanecen vigentes.
- **Contexto:** El usuario pidió ejecutar el rediseño image-first de Kennewick y
  suministró dos carpetas Drive tituladas `Couples - Kennewick` y
  `Senior Session - Kennewick`. Los 22 archivos descargados representan seis
  sesiones según XMP; `010A4575copy.jpg` y
  `sennior-session-benton-city.jpg` pertenecen a la misma sesión identificada
  como Benton City. Al excluirla quedan cinco sesiones candidatas, casi todas
  Seniors/Couples y ninguna Family, Newborn, Branding o Headshots. Dos tomas
  adicionales ya existían en producción con otro nombre.
- **Decisión:** Registrar siete composiciones image-first como autoridad visual
  canónica y traducirlas al sistema actual: `EditorialHero` compartido sin
  script, botón local hacia el cierre, arco de Lisa, un solo collage
  restringido, bloque local text-led, directorio ledger con fotografía, FAQ
  nativo y CTA final full-bleed. Publicar seis JPEG nuevos optimizados elegidos
  entre cuatro sesiones seguras; describir literalmente sus sujetos y no
  atribuir un spot exacto. Mantener vacía y fuera del DOM la galería “Recent
  Kennewick Sessions” hasta contar con 6–10 sesiones distintas y una mezcla que
  sostenga la amplitud de servicios. Actualizar `lastModified` a `2026-08-09`.
- **Alternativas descartadas:** activar la galería con varios frames de una
  misma sesión, usar los dos archivos asociados a Benton City, reutilizar
  portfolio Tri-Cities como evidencia local, convertir imágenes generadas en
  assets de producción o copiar marca, colores, tape y decoración de la
  referencia se descartó por atribución, SEO local y coherencia de marca.
- **Consecuencias:** La ruta conserva H1/copy exactos, seis H2, nueve anchors,
  cinco links de servicio, FAQ visible/schema 4:4 y un solo `Service` schema.
  Los seis JPEG cumplen 2400 px/700 KiB y generan variantes responsive. Las
  previsualizaciones quedan bajo `.impeccable/mocks/`; la media fuente de Drive
  usada entra en `public/uploads/`, pero los originales de auditoría permanecen
  ignorados. El gate futuro es diversidad de sesiones, no cantidad de archivos.

### ADR-039 — Pasco publica A+C con diez sesiones verificadas
- **Fecha:** 2026-08-09
- **Estado:** Aceptada; crea una excepción limitada a ADR-006.
- **Contexto:** El usuario pidió convertir `/pasco-wa-photographer/` en una
  service-area page especializada, usar el hero de Seniors/Newborn/Family,
  generar la dirección visual antes del código y auditar las carpetas Drive de
  Pasco. Aprobó combinar A “Open Horizon” con C “Long Horizon Archive”. Los 23
  originales descargados representan once sesiones según folder, XMP e
  identidad visual; diez podían seleccionarse sin reutilizar una sesión ni una
  captura ya presente en producción.
- **Decisión:** Implementar `PascoPage.astro` con `EditorialHero` sin frase
  script, botón hacia `#pasco-final`, arco introductorio, dos secciones de
  paisaje, directorio ledger de cinco servicios, galería exacta de diez
  sesiones, planificación estacional, cuatro FAQ nativas y cierre full-bleed.
  Publicar diez JPEG optimizados —tres family/large-family y siete senior— con
  alt literal y sin inferir landmarks ni revelar meeting points. Autorizar ocho
  anchors exactos en `<main>`: About, Locations Guide, cinco servicios y
  Contact. Marcar Pasco `ready/index`, `lastModified: 2026-08-09`, añadir un
  `Service` con `areaServed` Pasco y mantener fuera dirección Pasco,
  coordenadas, Review y AggregateRating. Servir el CSS Pasco como asset Vite
  enlazado solo en esa ruta para no aumentar cada HTML editorial.
- **Alternativas descartadas:** copiar marca, colores, tape o textos de la
  referencia; usar fotografías generadas en producción; presentar varios
  frames de una misma sesión como diez sesiones; atribuir portfolio genérico a
  Pasco; publicar puntos exactos o una dirección local; y mantener la ruta
  draft después de resolver copy, media y QA se descartaron por coherencia,
  trazabilidad, privacidad y calidad SEO local.
- **Consecuencias:** Release contiene siete URLs en sitemap y seis en
  `llms.txt`. Pasco conserva H1 exacta, ocho H2, ocho anchors, cinco servicios,
  galería 10/10 y FAQ visible/schema 4:4. Las diez fuentes suman ~5.2 MiB y sus
  40 WebP ~4.1 MiB; todas cumplen 2400 px/700 KiB. El CSS route-scoped evita
  ~20 KiB sin comprimir en cada ruta editorial ajena. Cualquier cambio futuro
  debe conservar diversidad de sesiones, alts literales, privacidad, canonical
  exacta y los gates de release.

### ADR-040 — Richland y Kennewick publican galerías con evidencia local estricta
- **Fecha:** 2026-08-09
- **Estado:** Parcialmente supersedida por ADR-042 únicamente en el punto visual
  de retícula Richland 4/2/1. Continúa aceptada y supersede ADR-034 en
  galería/`lastModified`, ADR-035 en ausencia de galería/`lastModified`, ADR-036
  en galería opcional y ADR-038 en ausencia, mínimo, mezcla y conteo de H2.
  Conserva los contratos restantes de esas decisiones.
- **Contexto:** El usuario pidió añadir a Richland y Kennewick una sección como
  `Recent Pasco Sessions` y autorizó auditar nuevas imágenes de Drive. Los diez
  seleccionados de Richland pertenecen a diez sesiones distintas según carpeta,
  fecha XMP, `OriginalDocumentID` e identidad visual. En Kennewick continúan
  existiendo solo cinco sesiones seguras al excluir los dos archivos de Benton
  City; la galería usa una imagen de cada una, incluidas tres tomas alternativas
  optimizadas y dos fuentes ya presentes en producción.
- **Decisión:** Activar `Recent Richland Sessions` con exactamente diez ítems y
  `Recent Kennewick Sessions` con exactamente cinco. Cada ítem requiere imagen
  única, alt literal y caption visible, sin nombrar el spot ni añadir anchors.
  Los componentes rechazan galerías no vacías parciales, duplicadas o
  incompletas; los validadores comparan allowlists literales y preservan siete
  H2 y nueve anchors en ambas rutas. La autorización expresa de cinco sesiones
  Kennewick reemplaza solo el mínimo previo de seis: no autoriza inventar una
  sexta ni reutilizar otra toma de una sesión ya contada. Richland actualiza
  `lastModified` a `2026-08-09`.
- **Alternativas descartadas:** Contar varios frames de una sesión como sesiones
  distintas, usar Benton City, tratar West Richland o portfolio genérico
  Tri-Cities como prueba Richland/Kennewick, renombrar bytes duplicados o dejar
  ausente una sección solicitada pese a disponer de evidencia suficiente se
  descartó por atribución, SEO local y trazabilidad.
- **Consecuencias:** Se incorporan trece JPEG optimizados (10 Richland y 3
  Kennewick) de 5.92 MiB y 52 variantes WebP regenerables. Richland usa retícula
  4/2/1; Kennewick usa panorama destacado y retícula 3/2/1. Las rutas mantienen
  sus nueve anchors, FAQ/schema y estado `ready/index`. Cualquier expansión
  futura exige una sesión nueva verificable y debe pasar build release/staging,
  allowlists y QA responsive antes de publicación.

### ADR-041 — Newborn publica el híbrido definitivo A+C sin inventar seguridad
- **Fecha:** 2026-08-10
- **Estado:** Aceptada.
- **Contexto:** La fuente externa Newborn v2 confirmó mediante Q53 que las
  sesiones ocurren principalmente en casa y pueden incorporar exterior según
  la temporada, por lo que el formato dejó de ser un bloqueador. El usuario
  aprobó A como dirección compositiva base y C como donante de la declaración
  `No hard deadline` y el FAQ master-detail, pero protegió sin cambios el
  `EditorialHero` existente y el bloque completo `What Your Newborn Session
  Looks Like`. Q41 no confirma todavía formación de seguridad newborn.
- **Decisión:** Reconciliar la v2 externa en `paginas/04-newborn.md` como única
  autoridad editorial vigente del repositorio y publicar el híbrido real:
  conservar exactos hero y proceso; usar el posicionamiento in-home/baby-led en
  las demás secciones; incorporar una sola fotografía Drive verificada; y
  marcar la ruta `ready/index`, `lastModified: 2026-08-10`, en sitemap release y
  `llms.txt`. Fijar siete H2, cuatro anchors exactos dentro de `<main>`, ocho FAQ
  visibles y ocho entidades schema 1:1, más un `Service` detallado, un
  `WebPage` y un `BreadcrumbList`. Mantener Q41 como pendiente no bloqueante y
  no publicar ningún claim de formación, certificación o posing seguro.
- **Alternativas descartadas:** Reemplazar también las dos regiones protegidas
  con el texto v2, mantener la ruta draft hasta resolver Q41, inferir formación
  de seguridad, imponer una ventana estricta de dos semanas, añadir enlaces a
  Investment/Reviews o publicar fotografía generada desde los mocks se
  descartó por contradecir la aprobación, la exactitud del servicio y el
  contrato visual existente.
- **Consecuencias:** Release pasa a ocho URLs en sitemap y siete entradas en
  `llms.txt`; staging conserva noindex global. La nueva fuente
  `newborn-family-at-home-west-richland.jpg` queda en 1600×2400 y 412 KiB, con
  variantes WebP ignoradas/regenerables. Los validadores staging/release pasan
  21/21, el detector Impeccable devuelve `[]` y Playwright aprueba
  1440/1200/900/390 sin overflow, fallos de runtime, imágenes ni foco. Cualquier
  claim futuro de seguridad requiere confirmación explícita de Q41 y nueva
  reconciliación de copy/schema.

### ADR-042 — Los fixes de geometría desktop preservan contenido y crops móviles
- **Fecha:** 2026-08-10
- **Estado:** Aceptada; supersede ADR-040 solo en la retícula Richland 4/2/1.
- **Contexto:** La revisión visual a 1728×963 mostró tres defectos aislados: el
  copy del cierre Newborn excedía su pista y quedaba cortado contra la imagen;
  las diez sesiones Richland formaban una composición 4/2/1 irregular, distinta
  de las otras páginas locales; y el crop desktop del cierre Kennewick cortaba
  la cabeza del hombre. El contenido, las fotografías y los contratos SEO ya
  estaban aprobados y no requerían sustitución.
- **Decisión:** Permitir que `.newborn-final__copy` se dimensione dentro de la
  pista disponible con `min-width: 0`, sin ancho fijo; ampliar la medida del H2,
  reducir su escala fluida desktop y usar `overflow-wrap: normal` para no partir
  `EXPECTING?` dentro de la palabra. Reorganizar Richland como contact sheet
  editorial determinista 3/2/1: tres columnas lógicas en desktop, diez
  fotografías repartidas en dos bandas completas de cinco, dos columnas en
  tablet y una en móvil. Aplicar al fondo final Kennewick
  `object-position: 50% 20%` únicamente desde 1051 px; conservar sin cambios el
  crop de tablet y móvil.
- **Alternativas descartadas:** Reescribir copy, reemplazar o borrar fotografías,
  conservar la retícula Richland 4/2/1 pese al desbalance, aplicar el crop
  Kennewick a todos los breakpoints o cambiar la altura de los cierres se
  descartaron por ampliar innecesariamente el alcance y arriesgar composiciones
  ya aprobadas.
- **Consecuencias:** No cambian contenido, media, schema, sitemap ni estado de
  indexación. El commit funcional `974d97c` pasa el validador release 21/21 y el
  detector Impeccable devuelve `[]`. Playwright verifica 1728/1440/1200/900/390
  sin overflow, solapamientos ni imágenes rotas dentro de las secciones; el H2
  Newborn conserva `EXPECTING?` en una sola línea de texto incluso a 768 px. El
  único fallo de red observado es la telemetría externa de Clarity en local.
  Cualquier ajuste futuro debe preservar la separación desktop/tablet en
  Kennewick y las diez sesiones únicas de Richland.

### ADR-043 — El cierre Pasco adopta la geometría de invitación Richland
- **Fecha:** 2026-08-10
- **Estado:** Aceptada; supersede ADR-039 únicamente en la composición visual
  del cierre Pasco. El resto de A+C y todos sus contratos de contenido, media,
  SEO y privacidad permanecen vigentes.
- **Contexto:** El feedback visual a 1728×963 pidió que `Let's Find Your Light`
  de Pasco quedara igual al cierre Richland. El bloque Pasco aún usaba el mock
  A+C original: 880 px de alto, panel marfil lateral de 640 px, copy izquierdo y
  escala menor. Richland usa una invitación full-bleed de 720 px, frame
  transparente centrado sobre 12 columnas, H2 mayor, wash umber y CTA outlined.
  La fotografía Pasco es landscape 3:2, mientras la donante Richland es portrait,
  por lo que copiar literalmente su focal point cortaba las cabezas adultas.
- **Decisión:** Portar a `pasco-page.css` la altura, retícula, tipografía,
  alineación, medida de párrafo, wash y estados del CTA Richland, manteniendo el
  DOM semántico Pasco, su alt significativo, su copy definitivo y su única
  anchor a Contact. Ocultar el eyebrow decorativo para reproducir la jerarquía
  donante sin añadir otro nivel visual. Usar `object-position: 62% 15%` en
  desktop para preservar las cabezas y conservar `59% 42%` por debajo de 768 px;
  la imagen continúa `cover` y no hereda el `contain` móvil de Richland.
- **Alternativas descartadas:** Reutilizar el CSS Richland global, vaciar el alt
  como si la imagen fuera decorativa, conservar el panel marfil, forzar una
  altura mayor por el copy Pasco, copiar `50% 48%` pese al head crop o mostrar
  los siete sujetos completos en 390 px —geométricamente imposible con cover—
  se descartaron por aislamiento, accesibilidad, igualdad visual y calidad del
  encuadre.
- **Consecuencias:** Pasco comparte la pista visual Richland en
  1728/1440/1200/900/390 sin compartir componente ni stylesheet. Conserva ocho
  H2, ocho anchors, galería 10/10, FAQ/schema 4:4 y estado `ready/index`. El
  manifest A+C conserva las referencias históricas, pero su cierre anterior con
  panel queda fuera de la lista canónica y documentado como supersedido.

### ADR-044 — About publica un archivo A+C con autoridad verificable
- **Fecha:** 2026-08-10
- **Estado:** Aceptada.
- **Contexto:** La fuente externa definitiva de About amplió la historia de
  Lisa, su método y su voz personal. El usuario pidió mantener el hero existente
  tal cual, aprobó la combinación A+C de las previsualizaciones image-first y
  pidió integrar bien la autoridad. La fuente anterior del repositorio aún
  trataba la ruta como borrador y mezclaba datos publicables con una cifra de
  reseñas, salud, premio, Grammy y credenciales sin evidencia suficiente. La
  edición agosto/septiembre de 2019 de Tri-Cities MOM Magazine sí permite
  verificar una portada con Lisa mediante la publicación primaria en Issuu.
- **Decisión:** Reconciliar `paginas/08-about.md` y `content/pages/about.json`
  con el copy definitivo, dejando el hero anterior como excepción protegida de
  copy, DOM, media, crops y geometría. Materializar A `Keeper Archive` como
  estructura base y C `Through Her Lens` como donante del método, retratos y
  autoridad: arco de origen, ledger del nombre, una composición fotográfica por
  historia, método 4/2/1, retratos de Lisa en solape controlado, prueba como
  ledger de cuatro filas y CTA full-bleed. Publicar exactamente un H1, nueve H2
  y cinco anchors —hash del hero, Seniors, Investment, Issuu y Contact—. Modelar
  la ruta como `AboutPage` con una sola `Person` Lisa Weiss, breadcrumb y
  referencia única desde `LocalBusiness.founder`; incluir la portada verificable
  como `subjectOf`, sin `Service`, FAQ, reseñas, rating, premio, credencial,
  calle ni coordenadas. Marcar `/about/` `ready/index`,
  `lastModified: 2026-08-10`, e incluirla en sitemap release y `llms.txt`.
- **Fotografía:** Usar cuatro retratos autorizados de la carpeta Drive
  `MY NEW branding pics ( Lisa )`, optimizados a 1600×2400, sRGB, sin metadata
  y entre 298–487 KiB, más WebP responsive regenerables. No borrar, reemplazar
  ni renombrar media ya usada; preservar byte-identical las tres fuentes que
  construyen el hero.
- **Alternativas descartadas:** Rediseñar el hero, publicar badges o stats cards,
  convertir About en una `Service`, enlazar Reviews sin respaldo, inferir datos
  pendientes, usar imágenes generadas como fotografía de producción, copiar la
  marca/colores/textos de la referencia o dejar la ruta `noindex` pese a que el
  cuerpo publicable ya estaba completo se descartó por aprobación explícita,
  E-E-A-T, trazabilidad y consistencia visual.
- **Consecuencias:** Release pasa a nueve URLs en sitemap y ocho entradas en
  `llms.txt`; staging conserva noindex global. El stylesheet About se entrega
  solo en su ruta mediante `?url`, el contrato HTML preserva la dirección y los
  validadores bloquean cambios al hero, links, headings, schema o claims. El
  validador release aprueba 21/21 rutas y Playwright aprueba
  1440/1200/900/390 sin overflow, imágenes rotas, errores locales ni desviación
  del hero mayor a 1 CSS px. La revisión final independiente devuelve `PASS`
  sin defectos materiales. Los hechos excluidos pueden reconsiderarse solo con
  evidencia y autorización nuevas; no son bloqueadores de la página actual.

### ADR-045 — About reemplaza únicamente el fondo de su hero
- **Fecha:** 2026-08-10
- **Estado:** Aceptada; supersede ADR-044 únicamente en la media y el crop del
  fondo del hero. El copy, la estructura, los prints, la geometría y todos los
  contratos editoriales, SEO y de autoridad de ADR-044 permanecen vigentes.
- **Contexto:** Después de publicar About A+C, el usuario señaló en una revisión
  a 1728×997 una fotografía concreta de Lisa trabajando y pidió reemplazar con
  ella la imagen de fondo que mostraba su rostro. La solicitud fue explícita y
  limitada al fondo; no autorizó rediseñar el hero ni eliminar la fuente
  anterior, que continúa utilizada por otras rutas de producción.
- **Decisión:** Usar `/uploads/about-lisa-photographing-tricities.jpg` como
  fondo del hero, con alt literal `Lisa holding a camera to her face among dry
  grass and shrubs.` y `object-position: 50% 24%` tanto en desktop como en
  móvil. Conservar exactos H1, intro, script, CTA hash, dos prints laterales,
  estructura DOM y geometría responsive. Proteger la nueva salida con el
  fingerprint DOM SHA-256
  `7788c70630779dbd4405b8eebc4856ea3700a3896003c74962a596d08286bf17`
  y mantener `/uploads/lisa-photographer-tricities.jpg` sin borrar ni
  reprocesar.
- **Alternativas descartadas:** Cambiar también los prints o el copy, aplicar
  crops distintos sin necesidad entre desktop y móvil, retirar la fuente
  anterior, volver a optimizar fotografías ya publicadas o modificar las
  secciones A+C se descartó por exceder el feedback y arriesgar contratos ya
  aprobados.
- **Consecuencias:** El commit funcional `bd40b70` conserva `/about/`
  `ready/index`, metadata, sitemap, `llms.txt`, schema, anchors y autoridad sin
  cambios. Release valida 21/21 rutas; Impeccable devuelve `[]`; Playwright
  aprueba 1728×997 y 1440/1200/900/390 sin desviación de geometría, imágenes
  rotas ni fallos locales. No se hizo push ni otra mutación externa.

### ADR-046 — About corrige la densidad de Belief y Method sin cambiar estructura
- **Fecha:** 2026-08-10
- **Estado:** Aceptada; refina ADR-044 únicamente en la densidad visual de las
  secciones Belief y Method. Copy, DOM, media, schema, hero, navegación y
  publicación permanecen vigentes.
- **Contexto:** La inspección a 1728×997 mostró una cita Belief en columna de
  una palabra y un ledger Method con copy pegado a sus divisiones. En Belief,
  el `max-width: 8ch` vivía en el padre `blockquote`: el navegador calculaba
  `ch` con el font del body antes de que el párrafo adoptara la tipografía
  display, produciendo una medida cercana a 70 px, una cita de 495.9 px y una
  sección de 1738.5 px. En Method, el token inexistente `--space-7` invalidaba
  todo el shorthand `padding`, por lo que no existía inset horizontal efectivo.
- **Decisión:** Aplicar `12ch` directamente al H2 y al párrafo display de la
  cita, retirar el límite del `blockquote`, usar `text-wrap: balance`, reducir
  el máximo de la cita a `3.75rem` y cambiar las separaciones afectadas de 40 a
  32 px. Reemplazar el padding Method por
  `clamp(var(--space-5), 1.6vw, var(--space-8))`, compuesto únicamente por
  tokens existentes y limitado a 20–32 px. Mantener la retícula Method 4/2/1 y
  no introducir wrappers, contenido ni breakpoints nuevos.
- **Alternativas descartadas:** Fijar una altura arbitraria, reducir o editar la
  cita, definir globalmente `--space-7`, mover divisiones, alterar la retícula o
  ocultar overflow se descartó porque habría encubierto las causas y ampliado
  el cambio fuera de las dos reglas defectuosas.
- **Consecuencias:** A 1728×997, Belief baja de 1738.5 a 1324.2 px; la cita queda
  en 180 px y tres líneas, y las pistas se equilibran en 973.8 px de media y
  978.6 px de copy. Method resuelve un inset de 27.648 px y conserva 4/2/1 sin
  overflow. El commit `4774a25` mantiene `/about/` `ready/index`, copy, media,
  schema y hero exactos. Release valida 21/21 rutas, Playwright aprueba
  1440/1200/900/390 más la inspección 1728×997, e Impeccable devuelve `[]`. No
  se hizo push ni otra mutación externa.

### ADR-047 — Method conserva 32 px antes de la segunda fila en tablet
- **Fecha:** 2026-08-10
- **Estado:** Aceptada; refina ADR-046 únicamente en el ritmo vertical del
  ledger Method dentro de su layout de dos columnas. El resto del contrato de
  densidad y todos los contratos de contenido, media, schema, hero e indexación
  permanecen vigentes.
- **Contexto:** La revisión visual independiente posterior a ADR-046 detectó un
  defecto aislado a 900 px: aunque el inset horizontal ya era válido, la última
  línea del ítem 01 quedaba a aproximadamente 8–10 px de la hairline que abre la
  segunda fila. Los ítems mantenían `padding-bottom: 0` al pasar a la retícula
  de dos columnas, por lo que el texto y la división competían visualmente.
- **Decisión:** Dentro del rango tablet delimitado por los breakpoints
  existentes, `768px`–`1050px`, aplicar `padding-bottom: var(--space-8)`
  únicamente a los ítems Method 01 y 02 mediante
  `li:nth-child(-n + 2)`. Conservar el inset horizontal responsive de ADR-046,
  las hairlines, el DOM y la progresión 4/2/1; no añadir un valor de breakpoint,
  row gap ni reglas para los layouts de cuatro o una columna.
- **Alternativas descartadas:** Añadir padding inferior a los cuatro ítems en
  todos los breakpoints, introducir `gap` entre filas, mover la hairline,
  reducir copy o tipografía, o ocultar el borde se descartó porque alteraría el
  ledger fuera del ancho afectado o disimularía el problema.
- **Consecuencias:** A 900 px, la distancia desde la última línea del ítem 01 a
  la hairline de la segunda fila es exactamente 32 px; la retícula conserva dos
  columnas y overflow horizontal 0. El commit `0f9989c` mantiene `/about/`
  `ready/index`, copy, media, schema y hero exactos. Release valida 21/21 rutas,
  Playwright About vuelve a aprobar 1440/1200/900/390 e Impeccable devuelve
  `[]`. No se hizo push ni otra mutación externa.

### ADR-048 — Homepage renueva cuatro fotografías de servicios y congela Seniors
- **Fecha:** 2026-08-10
- **Estado:** Aceptada.
- **Contexto:** En la revisión visual de `/` a 1728×963, el usuario pidió
  actualizar las fotografías del portfolio de servicios y conservar la de
  Seniors. La fila ya tenía cinco categorías y una geometría responsive
  estable; el cambio autorizado era editorial, no un rediseño ni una licencia
  para borrar fuentes usadas en producción.
- **Decisión:** Mantener exactamente
  `/uploads/senior-portrait-golden-hour-richland.jpg` y sustituir únicamente
  Family, Newborn, Branding y Headshots por assets existentes, optimizados y
  literales: `about-belief-family-golden-hour-tricities.jpg`,
  `newborn-family-at-home-west-richland.jpg`,
  `about-lisa-camera-portrait-tricities.jpg` y
  `review-lisa-griffith-headshot-tricities.jpg`. Actualizar sus alt texts según
  lo visible, sin atribuciones geográficas no verificadas. Congelar el SHA-256
  de Seniors y el contrato exacto id/ruta/alt de las cinco cards en el
  validador y en Playwright.
- **Alternativas descartadas:** Reemplazar Seniors, descargar o generar media
  adicional, reoptimizar fuentes ya conformes, borrar fotografías anteriores,
  cambiar copy/enlaces o rediseñar la retícula se descartó por exceder el
  feedback y aumentar bandwidth o riesgo de regresión sin beneficio.
- **Consecuencias:** El commit funcional `82af21f` conserva el orden y copy de
  las cinco cards, carga variantes WebP existentes y mantiene el lote 640 px en
  aproximadamente 197 KiB. Release valida 21/21 rutas; Playwright aprueba
  1728/1440/1200/900/390 con 5/5/5/2–2–1/1 columnas, foco visible, cero
  overflow y media cargada. La revisión independiente no encontró defectos
  P1/P2 ni crops problemáticos. El detector Impeccable señaló cinco falsos
  positivos `broken-image` sobre expresiones regulares del validador, refutados
  por el HTML construido y la carga real en navegador. No se hizo push ni otra
  mutación externa.
