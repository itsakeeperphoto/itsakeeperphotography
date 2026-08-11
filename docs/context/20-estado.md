# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 00:10 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `ec4c734` —
`feat(home): refresh hero and Lisa print`

**Cierre documental:** incluido en `HEAD` —
`docs(home): record homepage photography refresh`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** `main` queda limpio y veintiséis commits por delante
de `origin/main` (`ff736c6`), con la implementación y este cierre documental
incluidos en `HEAD`. No se hizo push, deploy, DNS ni otra mutación externa.

---

## Siguiente paso concreto

El usuario debe publicar los commits locales posteriores a `ff736c6` en el
remoto oficial. Cuando termine el deploy de Netlify, verificar `/` en el dominio
final a 1728/1440/1200/900/390: status 200, canonical `www`, meta index,
ausencia de `X-Robots-Tag: noindex`, membresía de `/sitemap.xml` y `/llms.txt`,
hero nuevo con crops 29/58/42%, una sola descarga AVIF sin JPEG paralelo, print
pequeño Biography en blanco y negro y las cinco cards exactas de ADR-048.

En el mismo deploy, repetir el QA pendiente de About, Newborn, Richland,
Kennewick y Pasco, comprobar sus `lastmod` y crawler outputs, y observar logs y
bandwidth durante 48 horas. No cambiar apex/`www`, DNS ni redirects hasta
resolver la divergencia de host documentada.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Richland, Kennewick,
  Pasco, Family Photo Locations y Portfolio. Thank-you es `ready/noindex`; las
  otras 11 rutas siguen `draft/noindex`.
- Release contiene nueve URLs en sitemap y ocho entradas en `llms.txt`;
  Portfolio queda fuera de `llms.txt`. Staging mantiene sitemap vacío y
  noindex global.
- Homepage queda `ready/index` con el hero, Biography y portfolio verificados.
  El refresh visual no cambió copy, schema, Settings, Open Graph ni el retrato
  principal de Lisa.
- `/about/` permanece `ready/index`, `lastModified: 2026-08-10`, con dirección
  A+C, autoridad verificable, fondo aprobado, Belief balanceada y Method 4/2/1.
- Newborn permanece `ready/index` con hero/proceso protegidos y Q41 opcional sin
  claim. Richland, Kennewick y Pasco siguen `ready/index` con galerías/cierres
  aprobados y `lastModified: 2026-08-09` en las rutas de ciudad.
- Los claims pendientes de reseñas, salud, premio, Grammy, certificaciones,
  seguro, membresías y Google Business no se publican.

## Homepage cerrado en `ec4c734`

### Hero art-directed

- Fuente visual:
  `/uploads/kennewick-couple-open-field-golden-hour.jpg`, 2400×1600,
  549817 B, SHA-256
  `37cc4686f26b843e68b847ad033ed419fc668abd63d237040cd08fd845b0a43f`.
- Alt: `A couple laughing together while walking through an open field in warm
  evening light`.
- Desktop: AVIF 86112 B y WebP 150604 B, 1440×960, foco `50% 29%` por
  encima de 1050 px.
- Tablet: fuente desktop con foco `50% 58%`.
- Móvil: recorte AVIF 43181 B y WebP 72142 B, 640×1024, foco `50% 42%`.
- SHA-256 de derivados, desktop AVIF/WebP y móvil AVIF/WebP:
  `d890163b2a6fc91704682273b7ffd8a479d38d19ad2d50150ffd170bbb8d5db1`,
  `7a14b42ef79a0671b9ef89f0bb2e31bf7bf8af483e19b249efb26778586275d2`,
  `1c6773948667cf3905fbbda6e7e42e9833fae8598e6e7857bd300f9d521a93a3` y
  `d5593ba07caf5e8ba2a3b231a4995b8ea37be3b3bf29c874f2a71d464d90c412`.
- El navegador compatible solicita una sola fuente AVIF; no descarga el JPEG en
  paralelo. La imagen anterior permanece porque Settings, Open Graph, schema y
  otras rutas todavía la referencian.

### Biography / Meet Lisa

- El retrato principal en arco sigue siendo
  `/uploads/lisa-photographer-tricities.jpg`.
- Solo el print pequeño cambia a
  `/uploads/about-lisa-camera-candid-black-white.jpg`.
- `meetLisa.printImage` es opcional en Tina; `MeetLisa.astro` usa `portrait`
  como fallback.
- El print es decorativo: `alt=""`, contenedor `aria-hidden`, carga lazy, WebP
  640 en desktop y 400 en móvil, `object-position: 50% 50%` y sin zoom.

### Portfolio preservado

- Orden: Seniors, Families, Newborns, Branding y Headshots.
- Seniors conserva
  `/uploads/senior-portrait-golden-hour-richland.jpg`, alt y SHA-256
  `1a85d3e4c31018b57001d63a2a782eee3fb037e92f054680d3030ed8dc8a679c`
  byte a byte.
- Family: `/uploads/about-belief-family-golden-hour-tricities.jpg`.
- Newborn: `/uploads/newborn-family-at-home-west-richland.jpg`.
- Branding: `/uploads/about-lisa-camera-portrait-tricities.jpg`.
- Headshots: `/uploads/review-lisa-griffith-headshot-tricities.jpg`.
- La retícula conserva 5/5/5/2–2–1/1 columnas en
  1728/1440/1200/900/390. No se borró ni reprocesó media de producción.

## Verificación ejecutada

- Build release Tina/Astro completado con data layer alterno; el validador
  aprobó `Validated 21 public routes in release mode.`
- `npm run optimize:source-images -- --dry-run`: todas las fuentes cumplen
  ≤2400 px/≤700 KiB.
- `npm run optimize:images`: variantes responsive al día.
- Playwright Homepage aprobó 1728×963, 1440×1000, 1200×900, 900×900 y
  390×844: hero, Biography y cards exactos, AVIF cargado, cero JPEG, cero
  overflow, foco de teclado visible y sin errores same-origin.
- Clarity puede devolver 400 externo después de recargas repetidas de QA; el
  filtro se limita a su URL y no oculta fallos del sitio.
- La revisión independiente devolvió `PASS`.
- Impeccable se ejecutó exactamente una vez. Reportó siete falsos positivos
  `broken-image` sobre expresiones regulares del validador, refutados por el HTML
  construido y la carga real del navegador; su resultado no fue `[]`.
- `node --check` pasó para el validador y el script Playwright.
- `git diff --check` pasó antes del cierre funcional; el cierre documental se
  vuelve a comprobar antes de su commit.

## Archivos del lote

Implementación funcional en `ec4c734`:

- `content/homepage/index.json`
- `src/components/MeetLisa.astro`
- `src/styles/styles.css`
- `tina/config.ts`
- `tina/tina-lock.json`
- `scripts/validate-site.mjs`
- `scripts/playwright-session-cards.js`
- cuatro variantes
  `public/uploads/kennewick-couple-open-field-golden-hour-{desktop,mobile}.{avif,webp}`

Documentación de este cierre:

- `paginas/01-home.md`
- `DESIGN.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Homepage | `ready/index`; hero/print/portfolio cerrados | Push del usuario y QA del deploy. |
| Documentación Homepage | Completa en `HEAD` | Sin trabajo parcial. |
| About | `ready/index` en `0f9989c` | Push del usuario y QA del deploy. |
| Newborn | `ready/index` | Verificar producción; Q41 sigue opcional y sin claim. |
| Richland/Kennewick/Pasco | `ready/index` | Verificar producción y crawler outputs tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y consumo Netlify 48 h tras deploy. |
| Seniors / Senior timing | Draft | Paquetes, oferta Q54, fechas editoriales y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| Reviews/Privacy | Draft | Reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
git rev-list --count origin/main..HEAD
SITE_MODE=release npm run validate:site
```

Para reconstruir Tina localmente, no detener el servidor largo del usuario en
`:9000`; usar un data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de publicar sus
propios commits, porque ese script hace push.

## Bloqueadores externos

1. El usuario debe publicar los commits locales en el remoto oficial.
2. Netlify debe completar el deploy antes del QA del dominio final.
3. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
4. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿Lisa quiere ampliar About/Homepage con alguno de los hechos
  hoy excluidos? Cada claim requiere evidencia y autorización.
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
