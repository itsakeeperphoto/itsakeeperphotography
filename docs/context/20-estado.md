# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-08 09:36 -05  
**Actualizado por:** Codex / GPT-5.6  
**Rama:** `main`  
**Último commit local antes del cierre final:** `6b7005b` — `agents context and tag manager ids`
**Remoto:** `origin` → `https://github.com/williammelo533/itsakeeper-astro.git`

---

## Siguiente paso concreto

Resolver el registro de contenido pendiente de la siguiente ruta prioritaria
antes de habilitar su indexación. Empezar por
`src/content/pending.ts` y `content/pages/senior.json`: confirmar con Lisa el
número de imágenes incluidas por paquete, la oferta mencionada en Q54 y la fecha
editorial; luego actualizar la entrada de Seniors en
`src/lib/page-manifest.ts`, ejecutar `npm run build:local` y hacer QA Playwright
en 1440×1000, 1200×900, 900×900 y 390×844.

No cambiar una ruta a `ready/index` mientras alguno de sus hechos, media o QA
obligatorio siga pendiente.

---

## Resumen ejecutivo

- El repo contiene y construye 21 rutas públicas.
- La homepage, Family y Portfolio están marcadas `ready`; las restantes 17
  rutas están deliberadamente `draft/noindex` salvo Thank-you, que siempre es
  noindex.
- `npm run build:local` terminó correctamente el 2026-08-08 y validó las 21
  rutas en staging. El primer intento dentro del sandbox falló porque Tina no
  pudo escuchar en `::1:4001`; fuera del sandbox pasó.
- Los dos formularios son Netlify Forms reales; la recepción por email aún se
  debe confirmar/configurar en Netlify Dashboard.
- El resumen de reseñas GBP está implementado con refresh diario y cache, pero
  no está comprobado en vivo porque las cinco variables OAuth/GBP no están
  verificadas en este repositorio.
- Hay evidencia visual amplia, incluida una suite histórica de 84 capturas, pero
  no se volvió a ejecutar la matriz completa de Playwright/Lighthouse después de
  todos los cambios de agosto.
- Se instaló en la raíz el sistema de continuidad (`AGENTS.md`,
  `docs/context/`, `scripts/handoff.sh`).
- Durante la redacción apareció el commit local `6b7005b`, creado por otro
  actor/proceso del workspace, que guardó la primera mitad del contexto. Se
  preservó íntegro y el handoff final continúa encima de ese commit.
- El primer intento de ejecutar el handoff fue bloqueado porque habría subido un
  rollout potencialmente sensible. El script ahora conserva `*.jsonl` solo en
  local mediante `.handoff/sessions/.gitignore`; únicamente la documentación se
  comparte por git.

## Qué funciona hoy

### Build y validación

- `npm run build:local` construye Astro/Tina, genera 21 rutas, instala headers de
  staging y finaliza con `Validated 21 public routes in staging mode.`
- `scripts/validate-site.mjs` comprueba targets internos, límite de cuatro links
  de body, placeholders visibles, canonicals, robots, sitemap, llms, formularios
  Netlify y ausencia del handler falso `/api/inquiry`.
- `SITE_MODE=staging` produce canonicals Netlify y noindex global.
- El build revisado usó Node 26.4.0 y npm 11.17.0.

### Homepage `/`

- Conserva la base aprobada y la paleta terrosa/dorada.
- Incluye servicios, trust bar, bloque local de Richland/Kennewick/Pasco, FAQ,
  navegación real y footer expandido.
- `SitePreloader.astro` se carga solamente en homepage. La cámara SVG hace
  entrada/focus/flash y el obturador revela directamente el sitio; el wordmark
  posterior al flash fue eliminado por decisión del usuario.
- El preloader respeta reduced motion, no bloquea si JS falla, admite Escape/Tab
  y se elimina del DOM al terminar.
- `KindWords.astro` implementa polaroids colgantes en loop, clip de bronce y flip
  solo por hover/focus transitorio, sin botones persistentes.
- `GuidedInquiry.astro` es un Netlify Form progresivo y sigue siendo usable sin
  JavaScript.

### Páginas especializadas

- Hero editorial común basado en Seniors mediante
  `src/components/EditorialHero.astro`.
- Implementaciones dedicadas para Family, Seniors, Newborn, Branding,
  Headshots, About, Investment, Contact, Journal, Richland, Kennewick y la guía
  de localizaciones.
- `ContentPage.astro` sigue sirviendo rutas genéricas/draft.
- Investment incorpora copy ampliado y composiciones de precios/timeline/papel.
- La guía `/journal/family-photo-locations-tri-cities/` incorpora el documento
  actualizado y evita inventar nombres de lugares.
- El Portfolio conserva el libro/flipbook desplegado y su carga especializada.

### Session estimates y contacto

- `src/components/SessionPriceCalculator.astro` y
  `src/scripts/session-price-calculator.ts` proporcionan un estimado interactivo
  con avance suave a la siguiente elección y respeto por reduced motion.
- La fuente numérica única es `src/lib/session-pricing.ts`; incluye Newborn y no
  publica Pet/Elopement.
- El recibo desktop es sticky y existe barra total móvil en
  `src/styles/contact-page.css`.
- El formulario `session-estimate` envía selecciones, desglose, total y versión
  de precios a `/thank-you/` mediante Netlify Forms.
- El copy lo presenta como “session estimate”, no como booking, contrato ni
  pago.

### SEO y crawling

- `src/lib/page-manifest.ts` gobierna status, metadata, schema, sitemap, llms y
  dispositivos de composición para 21 rutas.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts` y `llms.txt.ts` son dinámicos por
  modo de deploy.
- En release están habilitadas para sitemap `/`, Family y Portfolio; en staging
  ninguna URL se presenta como indexable.
- `Base.astro` emite WebSite, LocalBusiness, WebPage/Service/Article según ruta y
  breadcrumbs cuando corresponde.
- No hay Review/AggregateRating schema no verificado.
- `public/_redirects` conserva redirects de host y equivalencias de intención
  para URLs legadas; el inventario está en `docs/legacy-redirect-inventory.md`.
- La dirección física legada no se muestra en footer ni LocalBusiness schema.

### Integraciones

- Netlify hosting/forms/functions/blobs están cableados en código y config.
- TinaCMS local y producción tienen modelos y visual editing.
- Microsoft Clarity está integrado en `src/layouts/Base.astro` con ID
  `xyqkkqom4v`.
- Agentation está disponible solo durante desarrollo.
- Google Drive fue fuente manual de assets durante diseño; no es dependencia de
  runtime.

## Estado de publicación por ruta

| Ruta | Estado actual | Sitemap release | Observación |
|---|---|---:|---|
| `/` | ready/index | Sí | Homepage y preloader home-only. |
| `/family-photographer-tri-cities-wa/` | ready/index | Sí | Único servicio marcado listo. |
| `/portfolio/` | ready/index | Sí | Excluido de llms. |
| `/thank-you/` | ready/noindex permanente | No | Destino de formularios. |
| Las otras 17 rutas | draft/noindex | No | Hechos/media/QA pendientes. |

## Qué está a medias

| Archivo / módulo | Estado | Qué falta exactamente |
|---|---|---|
| `src/content/pending.ts` | 40 pendientes explícitos | Resolver cada hecho/media con Lisa; es la fuente más fiable del backlog editorial. |
| `src/lib/page-manifest.ts` | Gating operativo | Cambiar cada ruta a ready/index solo después de resolver pendientes y QA; fechas `lastModified` deben reflejar cambios reales. |
| `content/homepage/index.json` | Headshots incompleto | `sessions.cards[4].image` está vacío; no añadir una foto sin selección/autorización actual. |
| `content/pages/senior.json` | Draft | Confirmar cantidad de imágenes por paquete, oferta Q54 y fecha del artículo relacionado. |
| `content/pages/newborn.json` | Draft | Confirmar formato exacto, safety/handling y fecha del artículo relacionado. |
| `content/pages/branding.json` | Draft | Confirmar entregables, número de imágenes y duración. |
| `content/pages/headshots.json` | Draft | Confirmar duración y entregables. |
| `content/pages/investment.json` | Draft | Copy/diseño actualizados; falta confirmar cantidades/duraciones neutrales y cerrar QA integral tras cambios. |
| `content/pages/about.json` | Draft | Confirmar hechos biográficos, premio, publicación, certificaciones/seguro/membresías y permiso Grammy. |
| `content/pages/reviews.json` | Draft | Sustituir/autorizar 8–12 reseñas reales, atribución, nombres, link oficial y categorías. |
| `content/pages/richland.json` | Draft | Confirmar lugares/detalles locales, imágenes/alt, formato newborn y travel. |
| `content/pages/kennewick.json` | Draft | Confirmar lugares/detalles, 6–10 imágenes/alt y travel. |
| `content/pages/pasco.json` | Draft y layout genérico | Confirmar lugares, imágenes y travel; diseñar/QA cuando haya contenido real. |
| `content/pages/privacy.json` | Draft/noindex | Revisión legal/factual humana obligatoria. |
| `content/pages/journal-*.json` | Draft | Confirmar fechas y hechos específicos registrados en pending. |
| `netlify/functions/refresh-gbp-review-summary.mts` | Código completo, integración no verificada | Configurar OAuth/IDs en Netlify, ejecutar refresh y confirmar cache/endpoints reales. |
| `src/components/KindWords.astro` | Fallback funciona | Sin credenciales GBP muestra link sin número. Confirmar URL pública oficial de reseñas. |
| Netlify Form notifications | No verificadas desde repo | Configurar notificación email para `session-inquiry` y `session-estimate`; probar envío etiquetado en deploy preview y producción. |
| `README.md` | Obsoleto | Aún describe homepage/formulario falso como bloqueador y no refleja las 21 rutas actuales. |
| `docs/final-handoff.md` | Histórico | Fue correcto el 2026-07-21; no actualizar como si probara cambios posteriores. Crear evidencia nueva. |
| `artifacts/`, `.artifacts/`, `.codex-evidence/` | Evidencia parcial/histórica | Consolidar una nueva matriz de 84 capturas y nuevos reportes Lighthouse para el estado actual. |
| `public/_redirects` | Configurado, no validado post-cutover | Comprobar cada legacy URL en el dominio final antes/después de hacer primario el dominio. |

## Registro exacto de contenido pendiente

El listado canónico es `src/content/pending.ts`. A fecha de este handoff contiene
40 entradas agrupables así:

- Homepage: historia de salud/Grammy y cifra “96 five-star reviews”.
- About: hobbies/salud, nombre del premio, enlace de MOM Magazine, permiso para
  Grammy, certificaciones/seguro/membresías y un marcador condicional.
- Branding/Headshots/Investment: duración, entregables y cantidades.
- Artículos: fechas; datos de distritos para seniors; respuesta de Lisa Q54;
  validación/formato del newborn comparison.
- Kennewick/Pasco/Richland: lugares reales, comentario local, imágenes/alt,
  travel y formato newborn.
- Privacy: aprobación legal.
- Reviews: suficientes reseñas reales con permiso, nombres, categorías,
  atribución y enlaces oficiales.
- Seniors: número de imágenes por paquete.

No reemplazar estas entradas por inferencias ni datos de competidores.

## Bloqueadores externos

1. **Lisa / cliente:** hechos biográficos, premios, permisos, políticas,
   entregables, cantidades y conocimiento local detallados arriba.
2. **Cuenta Netlify:** configurar y verificar notificaciones reales de ambos
   formularios. El correo final solicitado es `itsakeeperphoto@gmail.com`; el
   correo de pruebas previo fue `globalbridge360@gmail.com`.
3. **Google Cloud/GBP:** crear/autorizar OAuth para una cuenta manager del perfil
   y cargar cinco variables de entorno. La implementación no permite demostrar
   el conteo dinámico sin ello.
4. **Autorización de lanzamiento:** cambiar dominio primario/DNS y activar
   `SITE_MODE=release` solo por instrucción explícita.
5. **Revisión legal:** aprobar el contenido de Privacy antes de indexarlo.

## Preguntas abiertas para el humano

- TODO(contexto): ¿qué ruta draft debe priorizarse para pasar a producción
  después de Family: Seniors, Investment u otra?
- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿se publicará Elopement en una fase futura? El estimador actual
  lo excluye aunque una conversación previa dijo que ciertos add-ons también le
  aplicarían.
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién hará y documentará la revisión legal de Privacy?
- TODO(contexto): ¿ya están creadas en Netlify las notificaciones de los dos
  formularios y se recibieron envíos de prueba?
- TODO(contexto): ¿existe un tablero de tareas externo que deba enlazarse?

## Cómo levantar el proyecto

Desde la raíz:

```bash
npm install
cp .env.example .env
# Completar solo credenciales propias; no commitear .env.
npm run dev
```

`npm run dev` ejecuta primero el build/minificado de scripts y luego Tina local
con Astro. La URL habitual la imprime Astro. Tina usa el puerto local 4001.

Para una verificación reproducible sin depender de TinaCloud:

```bash
npm run build:local
npm run preview:static
```

Si el entorno aislado impide abrir `::1:4001`, ejecutar `build:local` en una
terminal local con permisos de red/listener. No modificar código para resolver
un `EPERM` del sandbox.

## Cómo verificar que funciona

### Verificación automatizada mínima

```bash
npm run build:local
git status --short
```

Resultado esperado:

- 21 rutas generadas.
- `Validated 21 public routes in staging mode.`
- Ningún cambio fuente inesperado. Si aparecen solamente IDs generados en los
  `<form>` de `GuidedInquiry.astro` o `SessionPriceCalculator.astro`, no asumir
  que son cambios deseados; revisar y restaurar antes de commitear.

### QA visual requerido para una ruta que se vaya a declarar lista

Usar `playwright-cli` en:

- 1440×1000
- 1200×900
- 900×900
- 390×844

Comprobar: overflow horizontal, crops/dimensiones, body ≥16px, arco/overlap en
móvil, teclado/focus, menú/current page, reduced motion, consola/red, ausencia de
placeholder leakage, máximo cuatro links internos de body, robots correcto y
dispositivo compositivo. Guardar capturas con ruta/viewport identificables.

### Auditoría de release

Construir con el entorno release autorizado y ejecutar Lighthouse mobile y
desktop para Performance, Accessibility, Best Practices y SEO. Objetivos
históricos del proyecto: Performance móvil ≥90, desktop ≥95, las otras
categorías ≥95, LCP ≤2.5 s, CLS ≤0.1 y cero fallos críticos de contraste.

No usar los resultados del 2026-07-21 como sustituto de una corrida actual.

## Deuda técnica consciente

- `README.md` y `docs/final-handoff.md` no representan el estado actual.
- Varias rutas poseen diseño terminado pero siguen draft por datos, media o QA;
  no confundir “se ve completa” con “lista para indexar”.
- Pasco, Reviews, Privacy, Thank-you y algunos artículos todavía usan
  `ContentPage.astro`; esto es válido para gating, pero no cumple aún la promesa
  de composición individual de cada ruta si se decide publicarlas.
- Las carpetas de evidencia crecieron de manera fragmentada; falta un índice de
  capturas y scores actuales por ruta.
- El recuento GBP depende de OAuth y de un job programado externo; solo el
  fallback está verificable sin credenciales.
- No existe un test automatizado de entrega de correo, porque el receptor se
  configura fuera del repo.
- El build local tiene un efecto lateral posible sobre IDs de formularios.
- La copia de dirección legada permanece en el JSON de settings como dato no
  publicado; requiere cuidado en futuros componentes/schema.

## Evidencia disponible

- `docs/final-handoff.md`: handoff histórico del 2026-07-21, incluida lista de
  84 capturas y scores de aquel estado.
- `artifacts/qa/`: matriz original y capturas adicionales.
- `artifacts/playwright/`: verificaciones puntuales de Family FAQ, Journal,
  Kennewick, reviews y preloader.
- `.artifacts/`: About, Branding, Headshot, centralización de heroes, homepage y
  Newborn.
- `.codex-evidence/`: iteraciones recientes de Contact, Investment y Richland.

Estas evidencias prueban iteraciones concretas, no la release actual completa.
