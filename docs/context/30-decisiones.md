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
- **Estado:** Aceptada; SUPERSEDIDA POR ADR-052 únicamente para tap con puntero
  coarse. Hover/foco y loop permanecen vigentes.
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
- **Estado:** SUPERSEDIDA POR ADR-052 únicamente en el fallback editorial. El
  job diario, cache y requisito de payload válido permanecen vigentes.
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
- **Estado:** SUPERSEDIDA POR ADR-061.
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

### ADR-049 — Homepage separa hero visual, Open Graph y print decorativo de Lisa
- **Fecha:** 2026-08-11
- **Estado:** Aceptada.
- **Contexto:** En la revisión visual de `/` a 1728×963, el usuario pidió un
  hero más engaging y con fondo menos ruidoso, otra fotografía de Lisa en el
  print de Biography y fotografías actuales en el portfolio, conservando
  Seniors. ADR-048 ya había resuelto y protegido las cinco cards; quedaba
  cambiar solo las dos superficies fotográficas nuevas sin convertir una
  selección visual en un cambio de Open Graph/schema ni borrar fuentes usadas.
- **Decisión:** Usar
  `/uploads/kennewick-couple-open-field-golden-hour.jpg` como hero visual, con
  alt literal `A couple laughing together while walking through an open field
  in warm evening light`. Servir el encuadre completo AVIF/WebP 1440×960 en
  desktop/tablet y un recorte vertical AVIF/WebP 640×1024 en móvil; aplicar
  focos `50% 29%` por encima de 1050 px, `50% 58%` en tablet y `50% 42%` en
  móvil. Conservar sin cambios la media global de Settings usada por Open
  Graph/schema. Mantener el retrato principal en arco de Meet Lisa y desacoplar
  solo el print pequeño mediante el campo Tina opcional
  `meetLisa.printImage`, con fallback a `portrait`; el print usa
  `/uploads/about-lisa-camera-candid-black-white.jpg`, lazy WebP 640/400,
  `alt=""`, `aria-hidden`, foco central y cero zoom. Mantener exactamente la
  selección de portfolio de ADR-048 y el digest Seniors.
- **Alternativas descartadas:** Reutilizar el hero anterior con ramas, elegir
  un encuadre nuevo que perdiera a uno de los sujetos en móvil, descargar el
  JPEG fuente en paralelo, sustituir el retrato principal de Biography,
  cambiar la imagen global de Open Graph, volver a rotar las cards o borrar
  fotografías anteriores se descartó por ruido visual, accesibilidad,
  bandwidth, alcance o referencias activas en producción.
- **Consecuencias:** El commit funcional `ec4c734` añade cuatro derivados
  rastreados —desktop AVIF 86112 B, WebP 150604 B; móvil AVIF 43181 B, WebP
  72142 B— y conserva la fuente 2400×1600 de 549817 B con SHA-256
  `37cc4686f26b843e68b847ad033ed419fc668abd63d237040cd08fd845b0a43f`.
  Sus digests son, en ese orden,
  `d890163b2a6fc91704682273b7ffd8a479d38d19ad2d50150ffd170bbb8d5db1`,
  `7a14b42ef79a0671b9ef89f0bb2e31bf7bf8af483e19b249efb26778586275d2`,
  `1c6773948667cf3905fbbda6e7e42e9833fae8598e6e7857bd300f9d521a93a3` y
  `d5593ba07caf5e8ba2a3b231a4995b8ea37be3b3bf29c874f2a71d464d90c412`.
  Release valida 21/21 rutas. Playwright aprueba 1728×963, 1440×1000,
  1200×900, 900×900 y 390×844 con una sola petición AVIF del hero, sin
  JPEG, fallos same-origin, overflow ni pérdida de foco; los avisos 400 de
  Clarity en recargas repetidas son externos y se filtran por URL. La revisión
  independiente devuelve PASS. Los siete avisos `broken-image` del único pase
  de Impeccable son falsos positivos sobre regex del validador, refutados por el
  HTML construido y el navegador; el resultado no fue `[]`. Seniors sigue byte
  a byte intacta con SHA-256
  `1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c`.
  No se borró media ni se hizo push, deploy, DNS u otra mutación externa.

### ADR-050 — Contact revela el estimado solo después de una solicitud confirmada
- **Fecha:** 2026-08-11
- **Estado:** SUPERSEDIDA PARCIALMENTE POR ADR-053 únicamente en gate,
  transporte AJAX y campos opcionales. Permanecen vigentes la publicación
  `ready/index`, `lastModified`, sitemap/`llms.txt`, `ContactPage` +
  `BreadcrumbList`, el único form y la confirmación de Forms/notificaciones.
- **Contexto:** El estimador de `/contact/` mostraba el total antes de que la
  persona enviara sus datos. El usuario pidió invertir ese orden para crear
  anticipación: primero elegir la sesión y enviar el formulario, luego ver el
  estimado. También confirmó que Netlify Forms y sus notificaciones ya
  funcionan en producción y autorizó dejar la ruta `ready/index` dentro del
  sitemap. La página global de Privacy continúa sin revisión legal autorizada.
- **Decisión:** Conservar exactamente un form `session-estimate` en Contact.
  Mantener visibles opciones y precios parciales, pero ocultar semánticamente
  el total combinado y su desglose hasta que el mismo form reciba una respuesta
  HTTP `2xx` de Netlify. Requerir solo nombre y email; dejar teléfono, timing e
  historia opcionales. Enviar mediante POST URL-encoded same-origin, bloquear
  doble submit, congelar selecciones durante el request y definitivamente tras
  el éxito. Ante HTTP no exitoso, fallo de red o timeout de 15 segundos,
  conservar datos, mantener el recibo locked, restaurar controles, enfocar el
  error y permitir reintento. Sin JavaScript, conservar el POST HTML y la
  navegación a `/thank-you/`. Emitir eventos Google tag de interacción sin PII.
  Publicar Contact como `ready/index`, `lastModified: 2026-08-11`, con
  `ContactPage` y `BreadcrumbList`, sin inventar un `Service`, calle,
  coordenadas, reseñas ni rating. Mantener `/privacy/` `draft/noindex` como
  deuda legal separada y añadir junto al submit una divulgación factual del uso
  de los datos.
- **Alternativas descartadas:** Crear un segundo formulario oculto solo para
  Netlify, revelar al disparar el evento submit sin esperar al servidor, exigir
  teléfono o historia, borrar los datos después de un error, almacenar el
  unlock o PII en browser storage, adjuntar campos personales a analytics,
  declarar un `Service` sin contenido visible o publicar Privacy sin revisión
  se descartó por duplicación, falsos positivos de conversión, fricción,
  accesibilidad, privacidad o falta de evidencia.
- **Consecuencias:** El commit funcional `dd4a590` deja release con 10 URLs en
  sitemap y 9 entradas en `llms.txt`; staging conserva sitemap vacío y noindex
  global. Los validadores staging/release aprueban 21/21 rutas. Playwright
  aprueba 1440/1200/900/390
  con POST interceptados para 2xx, 5xx, fallo de red y doble clic: un solo POST,
  unlock exclusivo tras 2xx, datos preservados y retry en error, controles
  congelados tras éxito, foco accesible, fallback sin JavaScript y cero
  overflow. Ninguna prueba automatizada envió datos reales; la confirmación del
  funcionamiento productivo de Forms/notificaciones proviene del usuario. No
  se hizo push, deploy, DNS ni otra mutación externa.

### ADR-051 — Branding y Headshots usan media diversa con XMP local segura
- **Fecha:** 2026-08-11
- **Estado:** Aceptada.
- **Contexto:** Branding renderizaba 13 superficies desde solo cuatro fuentes y
  Headshots 14 desde cuatro; las repeticiones consecutivas debilitaban la
  lectura de servicios distintos. El usuario pidió renovar ambas rutas desde
  las carpetas Drive de branding de Richland, Kennewick y West Richland, evitar
  repeticiones y aplicar filenames, alt y geotag útiles para SEO. Los archivos
  fuente podían contener metadata privada o de cámara, y ambas páginas todavía
  tienen paquetes/entregables sin confirmar.
- **Decisión:** Incorporar 18 JPEG optimizados con filenames descriptivos en
  minúsculas/kebab-case y alt literal. Mantener Branding en 13 superficies/11
  fuentes únicas y Headshots en 14/11, con máximo dos usos por fuente, hero
  distinto del cierre y guardas de unicidad para el mosaico Branding y Team
  Headshots. Usar `config/image-seo-metadata.json` como allowlist y
  `scripts/lib/image-xmp.mjs` como única construcción de XMP. Incluir autoría,
  derechos, URL, título, descripción y ciudad/estado/país solo cuando la
  carpeta Drive la verifica; el retrato neutral queda sin ciudad. Excluir GPS,
  dirección, sublocation, fecha de captura, serial, nombre RAW, EXIF/IPTC/ICC,
  `OriginalDocumentID` e historial/identificadores `xmpMM`. Generar cuatro WebP
  por JPEG en 400/640/960/1440 y hacer que el manifiesto invalide esos
  derivados. Mantener ambas rutas `draft/noindex` y fuera de sitemap/`llms.txt`
  hasta resolver sus entregables; no borrar assets antiguos.
- **Alternativas descartadas:** Conservar la rotación de cuatro fotografías,
  borrar o sobrescribir fuentes previas, copiar toda la metadata de cámara,
  inventar coordenadas o una dirección, adjudicar ciudad al retrato neutral,
  usar filename como sustituto de alt o publicar las páginas solo por mejorar
  la media se descartó por repetición, riesgo de romper producción, privacidad,
  accesibilidad, claims locales no demostrados o gates editoriales abiertos.
- **Consecuencias:** El commit funcional `127c539` añade los 18 JPEG, manifiesto
  y helper XMP, actualiza contenido/componentes/optimizador/validador y añade el
  QA Playwright. Las 72 variantes WebP son regenerables. Release valida 21/21
  rutas y Playwright aprueba 1440/1200/900/390 con fuentes responsive, alt,
  diversidad, crops, consola/red y overflow correctos; la inspección visual de
  encuadres también pasa. Branding y Headshots conservan `draft/noindex`; no se
  borró media, no se hizo push, deploy, DNS ni otra mutación externa.

### ADR-052 — Kind Words publica diez reseñas verificadas sin inventar media ni schema
- **Fecha:** 2026-08-11
- **Estado:** Aceptada; supersede ADR-016 solo para tap con puntero coarse y
  ADR-017 solo para el fallback editorial.
- **Contexto:** La homepage mostraba seis testimonios, varios sin atribución o
  con fotografías desactualizadas. El usuario entregó `Reviews.pdf` con diez
  reseñas y pidió contrastarlas con la carpeta Assets de Google Drive. Solo
  cinco fotografías del PDF tenían un original visualmente idéntico en Drive;
  en los otros cinco casos, los archivos de carpetas homónimas mostraban
  personas o familias distintas.
- **Decisión:** Tratar el PDF como autoridad del copy y exigir coincidencia
  visual exacta antes de asociar una foto de Drive. Publicar diez testimonios
  `featured` en orden 1–10; conservar a Charity Neville como registro histórico
  `featured: false` y no borrar ni sobrescribir sus assets. Incorporar siete
  JPEG 800×1000, sRGB y ≤700 KiB con alt literal; reutilizar los tres assets
  locales exactos restantes. Ampliar el contrato Homepage/Tina de seis a diez.
  Mantener `100+ five-star Google reviews` como fallback respaldado por el PDF
  y reemplazarlo solo cuando GBP entregue juntos rating y conteo válidos. En
  puntero coarse, un tap alterna frente/reverso; hover, foco, Escape, scroll de
  citas y reduced motion conservan sus contratos. No emitir `Review` ni
  `AggregateRating` en JSON-LD sin URLs, fechas y procedencia estructurada de
  cada reseña.
- **Alternativas descartadas:** Sustituir personas por candidatos no idénticos
  de Drive, inferir ubicación desde filenames, corregir la gramática de las
  citas, borrar el testimonio anterior, publicar un número GBP incompleto,
  dejar el reverso inaccesible en touch o añadir schema de reseñas no trazable
  se descartó por fidelidad, privacidad, accesibilidad y riesgo de claims.
- **Consecuencias:** El commit funcional `4cabb15` deja 10/10 órdenes únicos y
  siete nuevas fuentes con WebP 400/640 regenerables. `npx astro build`, headers
  staging y el validador aprueban 21/21 rutas. Playwright aprueba
  1920/1440/1200/900/390 con ancho de documento exacto, 10 tarjetas, imágenes
  cargadas, tap coarse front→back→front, foco/Escape, reduced motion y cero
  errores de consola. El build Tina integral no se repitió porque el data layer
  largo del usuario ocupa `:9000`; no se detuvo ese proceso. No hubo push,
  deploy, edición de Drive ni borrado de media.

### ADR-053 — Contact restaura un estimado transparente con submit HTML nativo
- **Fecha:** 2026-08-11
- **Estado:** Aceptada; supersede ADR-050 únicamente en gate, transporte AJAX y
  campos opcionales. Preserva todos los contratos de publicación, schema,
  crawler outputs, formulario único y operación de Netlify confirmada en
  ADR-050.
- **Contexto:** Después de implementar y documentar el estimated receipt gated,
  el usuario pidió revertir esos dos cambios y volver al comportamiento
  transparente: ver el precio antes de enviar y usar la navegación normal del
  formulario. La solicitud no revocó la publicación de Contact ni autorizó
  retirar la ruta de sitemap, `llms.txt` o schema. Netlify Forms y sus
  notificaciones ya estaban confirmados como funcionales en producción.
- **Decisión:** Renderizar en SSR el recibo completo y los totales desktop/móvil
  visibles en `$160`; mantener el calculador vivo para actualizar líneas,
  fotografía, región polite, campos ocultos y total antes del contacto. Exigir
  nombre, email, teléfono e historia; dejar preferred timing opcional. Conservar
  un único form `session-estimate` con `POST`, `action="/thank-you/"`, detección
  Netlify, honeypot y selecciones crudas. No interceptar submit: el navegador
  envía URL-encoded como navegación de documento con o sin JavaScript. Eliminar
  `fetch`, `preventDefault`, reveal condicionado a 2xx, estados
  locked/submitting/unlocked, timeout, retry, freeze tras éxito,
  `submission_id` y eventos personalizados del gate. Mantener Contact
  `ready/index`, `lastModified: 2026-08-11`, en sitemap 10 y `llms.txt` 9, con
  `ContactPage` y `BreadcrumbList` y sin `Service`, calle, coordenadas,
  `Review` ni `AggregateRating`.
- **Alternativas descartadas:** Conservar el gate, mostrar un total visual pero
  mantenerlo oculto semánticamente, usar un híbrido AJAX/navegación, pedir
  preferred timing como obligatorio, retirar Contact del índice o crear un
  segundo form para Netlify se descartó por contradecir la reversión solicitada,
  duplicar transporte o deshacer contratos SEO ya aprobados.
- **Consecuencias:** El commit funcional `df6db0f` deja visibles en SSR el
  recibo y `$160`, y Playwright confirma el cálculo `$160` → `$955.98` y un POST
  nativo de documento a `/thank-you/` en 1440/1200/900/390; el contexto sin
  JavaScript a 390 px conserva recibo SSR, validación y payload crudo. El build
  Tina release integral usó puertos `4002`/`9001`; validadores staging y release
  aprobaron 21/21 rutas y la revisión final independiente devolvió `PASS`.
  Todos los POST se interceptaron: no hubo envío real, push, deploy, DNS ni otra
  mutación externa. Forms/notificaciones productivas permanecen confirmados por
  el usuario.

### ADR-054 — Senior Timing adopta un field guide image-first sin fabricar el gate editorial
- **Fecha:** 2026-08-11
- **Estado:** Aceptada.
- **Contexto:** El artículo Senior Timing usaba `ContentPage` genérico aunque
  su copy, oportunidad SEO y secuencia estacional requerían una lectura
  editorial propia. El documento definitivo conservaba tres pendientes: fechas
  distritales, la oferta Q54 y `[FECHA]`. La frase sobre deadlines locales no
  tenía evidencia publicada, la pregunta Q54 no estaba confirmada y no existía
  una fecha autorizada. El usuario pidió rediseñar con fotografía real y
  preservar la verdad SEO, no resolver esos datos por inferencia.
- **Decisión:** Usar
  `.impeccable/mocks/senior-timing-03-contact-sheet-field-guide.png` como comp
  canónico; rechazar `01-season-ledger` y `02-season-spine`. Crear
  `SeniorTimingPage.astro`, mantener `EditorialHero` y aislar
  `journal-senior-timing-page.css` con `?url`; ramificar tanto
  `journal/[slug].astro` como `EditorialPageRouter.astro` para conservar el
  renderer en SSR y refresco Tina. Fijar 1 H1, 8 H2, 7 H3, cuatro anchors, una
  contact sheet estacional 4/2/1 y 11 imágenes —nueve informativas y dos
  decorativas—. Incorporar el JPEG West Richland verificado con XMP allowlisted
  sin GPS ni metadata sensible. Sustituir la frase distrital por la recomendación
  de consultar el deadline publicado por cada escuela, cambiar `no conflicts`
  por `fewer school-schedule conflicts`, omitir Q54 y no mostrar fecha. Mantener
  el artículo `draft/noindex`, su header release y exclusión de sitemap/llms con
  los tres pendientes literales intactos. Emitir `Article`, `FAQPage` y
  `BreadcrumbList` derivados de contenido visible, sin fechas; usar
  `og:type=article` solo para páginas Article.
- **Alternativas descartadas:** Publicar fechas o deadlines por inferencia,
  mostrar Q54 como oferta vigente, añadir una fecha de build, cambiar a
  `ready/index` por calidad visual, usar las comps 01/02, conservar el renderer
  genérico, cargar CSS de ruta globalmente o tratar los dos prints redundantes
  como información se descartó por riesgo factual, de indexación,
  accesibilidad, duplicación visual o leakage.
- **Consecuencias:** Staging y release validan 21/21 rutas. Playwright aprueba
  1440/1200/900/390 con headings, anchors, schema, carga responsive, foco,
  acordeones, reduced motion, crops, consola/red y overflow correctos. El único
  hallazgo real de Impeccable —transición de `width`— se corrigió con
  `transform: scaleX()`; diez avisos `broken-image` sobre regex fueron refutados
  por las 11 imágenes cargadas. La revisión final independiente devolvió
  `PASS` sin P1/P2 y confirmó ausencia de regresiones `og:type`. El commit
  funcional `bcbadae` (`feat(journal): redesign senior timing guide`) contiene
  la implementación; el cierre documental permanece en el worktree para un
  commit local separado. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`.

### ADR-055 — Newborn Comparison adopta House Archive sin fabricar su publicación
- **Fecha:** 2026-08-11
- **Estado:** Aceptada.
- **Contexto:** El artículo comparativo Newborn caía en `ContentPage`, había
  perdido el capítulo Outdoor y el cierre del copy definitivo, y el ejemplo de
  schema no coincidía con sus FAQ visibles. La fotografía local no demostraba
  las cuatro escenas sugeridas por sus alt aspiracionales. Además permanecían
  tres gates literales: `[VALIDAR CON LISA]`,
  `[VALIDAR: formato exacto que ofrece Lisa]` y `[FECHA]`.
- **Decisión:** Adoptar Concept B / Impeccable `The house as archive` y crear
  `NewbornComparisonPage.astro` para SSR y refresh Tina, con CSS de ruta
  procesado por `?url`. Restaurar el copy definitivo completo y fijar 1 H1, 8
  H2, 7 H3, tres FAQ, tres anchors Family → Newborn → Contact y nueve imágenes
  existentes —siete informativas y dos decorativas— con alt literales. Emitir
  exactamente un `Article`, un `FAQPage` derivado 1:1 de lo visible y un
  `BreadcrumbList`. Mantener `draft/noindex`, header release, exclusión de
  sitemap/`llms.txt` y ausencia de fechas hasta resolver los tres gates.
- **Alternativas descartadas:** Usar los Concepts A/C, conservar el renderer
  genérico, fabricar una fotografía studio, publicar los alt aspiracionales,
  derivar FAQ distintos de la UI, cargar CSS global o promover a `ready/index`
  por calidad visual se descartó por menor claridad, falta de evidencia,
  accesibilidad, leakage o riesgo factual/SEO.
- **Consecuencias:** El pase final corrigió crops, espaciado y balance del
  díptico, y añadió un guard del orden literal de párrafos. Staging y release
  aprobaron 21/21 rutas; Playwright pasó 1440/1200/900/390 más spot-check 1728,
  e Impeccable devolvió `[]`. La implementación está en `1dd00d3`
  (`feat(journal): redesign newborn comparison guide`). Antes del commit
  documental `main` está 12 commits por delante de `origin/main`; el cierre
  queda sin stage para un commit local separado, que lo dejaría ahead 13. No se
  hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### ADR-056 — Branding vs. Headshots publica un Versus Axis sin convertir comparación editorial en paquete
- **Fecha:** 2026-08-11
- **Estado:** Aceptada.
- **Contexto:** El artículo
  `/journal/branding-photos-vs-headshots/` caía en `ContentPage` aunque su copy
  comparaba dos productos visualmente distintos y ya contaba con fotografía
  real auditada. Conservaba `[FECHA]`, `draft/noindex` y exclusión crawler. El
  usuario autorizó publicarlo el `2026-08-11`, delegó la selección de dirección
  y pidió continuar sin una pausa adicional. Las páginas de servicio Branding
  y Headshots mantienen pendientes propios de duración/entregables; el copy del
  artículo contiene comparaciones editoriales, no especificaciones
  contractuales de paquetes.
- **Decisión:** Adoptar Comp C / Impeccable
  `.impeccable/mocks/branding-headshots-comparison-c-versus-axis.png`, `Versus
  Axis`: un headshot singular enfrenta una biblioteca Branding asimétrica de
  persona, proceso y lugar mediante una costura central `VS`, seguida por la
  tabla fuente. Crear `BrandingHeadshotsArticlePage.astro` para SSR y refresh
  Tina, y aislar `journal-branding-vs-headshots-page.css` mediante `?url` para
  que solo esta ruta lo reciba. Fijar el copy definitivo en 1 H1, 8 H2, 6 H3,
  tres FAQ, checklist semántico de cinco ítems, tabla accesible de seis filas y
  tres anchors Branding → Headshots → Contact; el hero usa botón local. Usar
  once fuentes existentes y únicas, ocho informativas y tres decorativas, sin
  editar media compartida. Publicar `ready/index` con `lastModified`,
  `datePublished` y `dateModified` `2026-08-11`, retirar el header release
  noindex, enlazar la card del hub y añadir la URL a sitemap/`llms.txt`. Emitir
  exactamente un `Article`, un `FAQPage` 1:1 y un `BreadcrumbList`, sin
  `Service`, `Offer`, duración/precio estructurado, reseñas, rating, calle ni
  coordenadas. Mantener las páginas Branding y Headshots `draft/noindex` hasta
  resolver sus gates separados.
- **Alternativas descartadas:** Comp A `Proofbook`, Comp B `Dossier`, conservar
  el renderer genérico, cargar el CSS en todas las rutas, simular la comparación
  con cards, usar una costura como badge, generar personas/escenas nuevas,
  duplicar imágenes o transformar `1–3 portraits`, `Under an hour` y `Half a
  day, typically` en schema de paquetes se descartó por menor claridad,
  leakage, pérdida semántica, falta de evidencia o riesgo de promesa comercial.
- **Consecuencias:** El commit funcional `b22c581` eleva release a 11 URLs en
  sitemap y 10 entradas en `llms.txt`, conserva staging globalmente noindex y
  mantiene nueve rutas editoriales `draft/noindex` más Thank-you noindex
  permanente. Los validadores staging/release aprobaron 21/21 rutas y la suite
  dedicada pasó en 1440×1000, 1200×900, 900×900, 390×844 y 1728×963, con 15
  capturas finales. El pase corrigió contraste Headshot a 4.6104:1, foco del
  ledger a 13.479:1 y tabla/body móvil a ≥16 px; la costura `VS` queda vertical
  en 900–1728 y horizontal en 390, con `figureGap` 174.375 px ≥ seam 88 px a
  1440. Impeccable devolvió `[]` y la revisión independiente `PASS` sin P1/P2,
  con cero overflow o errores runtime. El build default inicial solo chocó con
  el servidor preexistente en `:9000`; los builds definitivos se ejecutaron
  aislados. No se hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### ADR-057 — Journal se publica como colección sin enlazar artículos draft y los gates restantes se consultan en un solo documento
- **Fecha:** 2026-08-11
- **Estado:** Aceptada; SUPERSEDIDA PARCIALMENTE POR ADR-061 únicamente en el
  enlace secundario a Portfolio, la fecha de Journal y los conteos derivados.
- **Contexto:** El hub `/journal/` tenía copy, composición y cards completos,
  pero seguía `draft/noindex` y fuera de crawler outputs. Dos de sus cuatro
  artículos —Senior Timing y Newborn Comparison— todavía conservan gates
  factuales y de fecha. Publicar el hub con anchors hacia esas rutas transferiría
  navegación interna a páginas deliberadamente no indexables. El usuario pidió
  publicar Journal y preparar una lista completa para Lisa con la información
  que falta antes de publicar las demás rutas, excluyendo Reviews y Privacy
  porque las gestionará directamente.
- **Decisión:** Mantener intactos firma `overlap`, cuatro cards, copy y orden del
  hub. Cambiar Journal a `ready/index`, `lastModified: 2026-08-11`,
  `sitemap: true` y `llms: true`; retirar su header release noindex y emitir un
  único `CollectionPage` más `BreadcrumbList` Home → Journal. Enlazar solo las
  cards Locations Guide y Branding vs. Headshots, añadir Portfolio como enlace
  editorial secundario y conservar Contact como CTA final. Senior Timing y
  Newborn Comparison permanecen visibles como cards sin anchor; retirar además
  sus enlaces del footer y de cualquier ruta `ready/index`. Newborn conserva el
  copy relacionado y pierde únicamente el link. Registrar las decisiones que
  Lisa debe confirmar en
  `docs/lisa-publication-confirmation-checklist.md` y su versión Word: Seniors,
  Branding, Headshots, Investment, Senior Timing y Newborn Comparison. El
  checklist separa coberturas de colecciones, corrige que el gate Seniors es
  outfits por paquete —no número de imágenes— y deja fuera Reviews/Privacy.
- **Alternativas descartadas:** Enlazar las cuatro cards a pesar del estado
  draft, ocultar completamente los dos artículos pendientes, publicar sus
  rutas junto con el hub, inventar fechas/entregables, mezclar Reviews o Privacy
  en el cuestionario, o resolver inconsistencias comerciales desde el
  estimador se descartó por coherencia de indexación, continuidad editorial,
  exactitud y alcance explícito del usuario.
- **Consecuencias:** El commit funcional `ffe5198` eleva release a 12 URLs en
  sitemap y 11 entradas en `llms.txt`; staging conserva sitemap vacío y noindex
  global. Los validadores aprobaron 21/21 rutas en ambos modos. Playwright pasó
  Journal en 1440/1200/900/390 sin overflow, imágenes rotas ni errores runtime,
  y la suite Newborn volvió a pasar en los mismos anchos. La revisión
  independiente devolvió `PASS` sin P1/P2. El DOCX del checklist tiene seis
  páginas Letter, está etiquetado y su auditoría de accesibilidad reporta
  high/medium/low `0/0/0`. Ninguna respuesta del checklist se considera
  confirmada hasta recibirla de Lisa; las seis rutas conservan sus gates
  independientes. No se hizo push, deploy, DNS ni `./scripts/handoff.sh`.

### ADR-058 — Reviews convierte palabras verificadas en prueba fotográfica y se publica sin fabricar rating

- **Fecha:** 2026-08-12
- **Estado:** Aceptada; SUPERSEDIDA PARCIALMENTE POR ADR-061 únicamente en la
  conservación de una segunda instancia pública del libro en Portfolio.
- **Contexto:** `/reviews/` caía en el renderer genérico y no mostraba el
  inventario real ya utilizado en Homepage, aunque existían diez testimonios
  atribuidos y fotografiados. El usuario pidió auditar copy/media, conservar el
  hero de Seniors/Newborn/Family, reutilizar exactamente `What Tri-Cities
  Clients Remember`, incorporar el libro interactivo de Portfolio, previsualizar
  antes de codificar y publicar `ready/index`. La referencia aportaba una
  topología editorial útil, pero su marca, paleta, textos y sujetos no podían
  copiarse. No existe aún una URL pública oficial de Google ni campos
  individuales completos de URL/fecha/rating/procedencia para schema de reseña.
- **Decisión:** Adoptar Comp C / Impeccable `Words Become Pictures / At Ease,
  on Purpose`, seed `c2ad8044`; conservar las comps A/B como alternativas no
  seleccionadas. Crear `ReviewsPage.astro` y CSS `?url` de ruta; usar el
  `EditorialHero` compartido con hero B/N y dos prints, seguido de `At Ease`, el
  `KindWords` exacto de Homepage, un libro de seis páginas y un cierre B/N con
  único CTA a Contact. Extraer `JournalBook.astro` de Portfolio para reutilizar
  la misma fuente de páginas sin duplicar el wrapper, aislar memoria/IDs/ARIA
  por instancia, cargar Reviews lazy y conservar Portfolio eager. Pasar las
  conexiones Testimonial/Journal por contenido estático y Tina. Publicar
  Reviews como `ready/index`, `lastModified: 2026-08-12`, sitemap/`llms.txt`,
  `WebPage` y `BreadcrumbList`; mantener el resumen social como texto y omitir
  `Review`/`AggregateRating` hasta contar con evidencia estructurada suficiente.
- **Alternativas descartadas:** Conservar el fallback genérico, usar una grilla
  de cards, duplicar el libro completo, copiar marca/copy/colores de la
  referencia, inventar una reseña Newborn, un enlace Google, rating o fechas,
  y seleccionar A/B se descartó por menor prueba visual, autorreferencia,
  mantenimiento duplicado, riesgo factual o menor claridad narrativa.
- **Consecuencias:** El contrato visible queda en 1 H1, 4 H2, 6 H3, diez
  testimonios originales, seis páginas lazy y un anchor. Staging/release
  validan 21/21; release contiene 13 URLs en sitemap y 12 entradas en
  `llms.txt`. Playwright aprueba 1440/1200/900/390, teclado, page flip, reduced
  motion, crops, tipografía sin clipping, assets, red/consola, overflow cero y
  regresión de Portfolio. El detector propio devuelve `[]`; el aviso compilado
  restante es preexistente y ajeno a Reviews. El revisor independiente entrega
  `disposition: ship`, `ceiling: reached` y ningún fix material. El link oficial
  de Google permanece como mejora no bloqueante. No se hizo push, deploy, DNS
  ni `./scripts/handoff.sh` porque el script termina con `git push` y la política
  operativa vigente reserva el push al usuario.

### ADR-059 — Reviews confirma el CTA Google y recupera un giro de álbum 3D

- **Fecha:** 2026-08-12
- **Estado:** Aceptada; supersede parcialmente ADR-058 en el enlace externo, la
  firma visual de At Ease y la física del libro; SUPERSEDIDA PARCIALMENTE POR
  ADR-061 únicamente en la instancia eager y regresión de Portfolio.
- **Contexto:** El usuario revisó `/reviews/` a 1920×963 y confirmó cinco ajustes:
  añadir un CTA directo para dejar una reseña, devolver al libro una animación de
  hojas claramente tridimensional, compactar el paso de KindWords al Journal,
  retirar las líneas que formaban una intersección en At Ease y aclarar el
  resumen `100+ five-star Google reviews`. La auditoría midió solo 2.05:1 de
  contraste, unos 314 px entre resumen y siguiente introducción, y comprobó que
  PageFlip 2.0.7 sí funcionaba pero interpretaba las hojas como `soft`; por eso
  aplicaba clip/curva 2D sin caras `rotateY`. El usuario aportó como fuente la
  URL directa `https://g.page/r/CZnCWAWyBWnQEBM/review`.
- **Decisión:** Guardar la URL confirmada en `settings.social.googleProfile` y
  hacer que `KindWords` exponga un CTA opt-in solo en Reviews, con `target` nueva
  y `noopener noreferrer`; el resumen continúa como texto estático y Homepage
  permanece sin el nuevo botón. Animar el CTA mediante relleno de papel y
  desplazamiento de flecha CSS, sin loop y sin transición bajo reduced motion.
  Usar marfil para el resumen sobre oliva. Eliminar las dos reglas de At Ease
  tanto del DOM como del CSS y cambiar la firma de Reviews de `crossing-line` a
  `arch`, conservando arco y print superpuesto. Retirar el `min-height`
  artificial de KindWords y reducir el padding superior del Journal. Para el
  libro compartido, declarar cada hoja `data-density="hard"`, mantener el motor
  StPageFlip existente, girar desde la esquina inferior durante 1200 ms y usar
  sombra máxima `0.50`; no añadir GSAP a la física de página. Mantener el
  crossfade actual bajo reduced motion y la política lazy/eager separada entre
  Reviews y Portfolio. Al entrar KindWords en viewport, activar las imágenes
  originales y clonadas del loop como eager de prioridad baja; así se conserva
  el lazy inicial de una sección lejana y se evita que el auto-pan muestre
  placeholders aún no solicitados.
- **Alternativas descartadas:** Añadir GSAP o un segundo motor de flip, mantener
  hojas `soft` con más duración, ocultar las reglas solo con `display:none`,
  convertir el resumen social en enlace, aplicar el CTA también a Homepage o
  derivar schema de reseñas desde la URL global se descartó por duplicación,
  menor profundidad perceptiva, DOM muerto, cambio de contrato compartido o
  evidencia estructurada insuficiente.
- **Consecuencias:** Reviews contiene ahora dos anchors dentro de `<main>`, en
  orden Google externo → Contact interno. El resumen logra 4.61:1 y el gap
  CTA→Journal mide 184/172.8/148/144/144 px en
  1920/1440/1200/900/390. A mitad del giro, Playwright verifica estado
  `flipping`, caras `matrix3d` y sombras rígidas; reduced motion conserva
  crossfade sin transiciones y Portfolio mantiene seis hojas con su primera
  página eager/high. Release valida 21/21 rutas, sitemap 13 y `llms.txt` 12;
  no cambian `WebPage`/`BreadcrumbList` ni la omisión de
  `Review`/`AggregateRating`. El detector Impeccable devuelve `[]`. No se hizo
  push, deploy, DNS ni `./scripts/handoff.sh`; el usuario conserva el control del
  push.

### ADR-060 — Thank-you confirma recepción sin convertirse en una segunda landing

- **Fecha:** 2026-08-13
- **Estado:** Aceptada; SUPERSEDIDA PARCIALMENTE POR ADR-061 únicamente en el
  destino y texto de su anchor final.
- **Contexto:** `/thank-you/` era una utilidad genérica con un H1, una frase y
  un enlace a Home, aunque Contact ya la usa como destino del único POST nativo.
  El usuario pidió reconciliar la geometría de una referencia editorial con las
  páginas Seniors/Newborn/Family, auditar copy y fotografías, visualizar antes
  de codificar y recomendar la política SEO. La auditoría confirmó que Lisa lee
  cada inquiry, responde personalmente, suele hacer un par de preguntas y luego
  planifica por teléfono; no existe un tiempo de respuesta verificado. Como
  confirmación posterior al envío, la ruta no aporta intención de búsqueda
  independiente.
- **Decisión:** Adoptar Comp C / Impeccable `Your Message Is With Me`, surface
  seed `02ea6a91`, entre tres previsualizaciones generadas y conservar A/B como
  alternativas no seleccionadas. Crear `ThankYouPage.astro` y CSS `?url` de
  ruta; usar `EditorialHero` compartido con botón local, dos prints y seam;
  componer la nota con copy, retrato de Lisa en arco, print B/N superpuesto y
  tres próximos pasos semánticos; terminar con una sola fotografía full-bleed y
  un único anchor a Portfolio. Añadir una orquestación GSAP de entrada limitada
  a transform/opacity y conservar contenido visible sin dependencia de JS o
  bajo reduced motion. Mantener `ready/noindex`, `WebPage`, canonical propio,
  `sitemap:false`, `llms:false`, `primaryRoute:false`, sin `lastModified`, meta
  y header release `noindex,nofollow,noarchive`, y no bloquear la ruta mediante
  `robots.txt` para que los crawlers puedan leer el `noindex`.
- **Alternativas descartadas:** Mantener el renderer genérico, copiar marca,
  copy o color de la referencia, usar la comp como imagen final, añadir otro
  formulario/Contact CTA, prometer una respuesta en 24–48 horas, afirmar una
  reserva, indexar la utilidad, añadirla al sitemap o impedir crawling con
  `robots.txt` se descartó por menor confianza, duplicación de conversión,
  evidencia insuficiente o política SEO incorrecta.
- **Consecuencias:** El contrato visible queda en 1 H1, 3 H2, 3 H3, seis
  imágenes, un botón local y un anchor a Portfolio. El validador fija contenido,
  manifiestos espejo, aislamiento CSS, dirección, headings, acciones, media,
  schema y exclusión crawler. Staging/release aprueban 21/21; Playwright CLI
  pasa 1440×1000, 1200×900, 900×900 y 390×844 con seis imágenes cargadas, cero
  overflow y errores runtime, foco correcto, estados del CTA y reduced motion
  visible. El detector propio queda limpio; su único warning compilado procede
  de `journal-page.css` preexistente. El finish reviewer devuelve `SHIP`,
  `ceiling: reached` y ningún hallazgo material. No se hizo push, deploy, DNS ni
  `./scripts/handoff.sh`; el usuario conserva el control del push.

### ADR-061 — Portfolio se retira y Reviews conserva el libro como única superficie pública

- **Fecha:** 2026-08-14
- **Estado:** Aceptada; supersede ADR-018 y las cláusulas identificadas de
  ADR-057, ADR-058, ADR-059 y ADR-060.
- **Contexto:** El usuario pidió borrar `/portfolio/`, retirar su presencia de
  sitemap, footer y navegación, y dirigir los enlaces relacionados a
  `/reviews/`. Reviews ya contiene el mismo libro de seis páginas, por lo que
  mantener ambas rutas duplicaba superficie pública y complejidad del editor.
- **Decisión:** Eliminar la página, componente, query, loaders, isla, wrapper,
  familia y entrada de manifiesto exclusivos de Portfolio. Conservar
  `JournalBook`, `content/journal-pages/`, su colección Tina, estilos,
  controlador y dependencia `page-flip`, porque Reviews los consume; el router
  editorial de esa colección abre `/reviews/`. Journal y Thank-you enlazan
  Client Reviews; Footer conserva una sola entrada Reviews. `/portfolio/` y las
  seis galerías legacy redirigen directamente a `/reviews/` con 301. Journal
  pasa a `lastModified: 2026-08-14`; el release queda en 20 rutas y
  sitemap/`llms.txt` 12/12. Los validadores impiden regenerar HTML, enlaces o
  crawler outputs de Portfolio.
- **Alternativas descartadas:** Mantener Portfolio oculto o `noindex`, borrar
  también el libro, dejar un 404, duplicar Reviews en el footer o encadenar los
  redirects legacy a través de Portfolio se descartó por duplicación, pérdida
  de contenido aprobado, mala continuidad y mayor deuda operativa.
- **Consecuencias:** Tina y Astro compilan en staging y release; el validador
  activo aprueba 20/20 en ambos modos. Playwright confirma Reviews en cinco
  anchos, Thank-you en cuatro y Journal en desktop/móvil, sin overflow ni
  enlaces Portfolio; el libro conserva seis hojas, interacción 3D y fallback de
  movimiento reducido. El shell estático de `/admin/` carga y el router
  generado apunta a Reviews; su autenticación cloud no es comprobable desde el
  preview sin credenciales Tina. La ausencia del HTML y las reglas de redirect
  quedan verificadas localmente; el estado HTTP real se comprobará después del
  deploy. No se hizo push ni deploy.
