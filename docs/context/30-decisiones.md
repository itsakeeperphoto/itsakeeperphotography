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
- **Estado:** Aceptada; supersede únicamente el gate de publicación de ADR-032
  y la consecuencia de indexación de ADR-033.
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
- **Estado:** Aceptada; precisa ADR-024 para Kennewick y crea una excepción
  limitada a ADR-006.
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
