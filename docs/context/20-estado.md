# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 10:11 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `dd4a590` —
`feat(contact): gate estimate behind inquiry`

**Cierre documental:** incluido en `HEAD` —
`docs(contact): record gated estimate publication`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** `main` queda limpio y dos commits por delante de
`origin/main` (`b504f84`): la implementación funcional y este cierre
documental. No se hizo push, deploy, DNS ni otra mutación externa.

---

## Siguiente paso concreto

El usuario debe publicar `dd4a590` y el commit documental inmediatamente
posterior en el remoto oficial. Cuando termine el deploy de Netlify, verificar
`/contact/` en el dominio final: status 200, canonical `www`, meta index,
ausencia de `X-Robots-Tag: noindex`, `lastmod: 2026-08-11`, membresía de
`/sitemap.xml` y `/llms.txt`, y gate visual/funcional en 1440, 1200, 900 y
390 px.

Después, ejecutar una prueba real controlada del nuevo gate: confirmar un solo
registro `session-estimate`, recepción de la notificación y reveal únicamente
tras la respuesta exitosa de Netlify. No guardar PII, payloads ni capturas con
datos personales en git. El usuario ya confirmó que Netlify Forms y las
notificaciones funcionan en producción; esta prueba posterior al deploy valida
la nueva capa AJAX, no reabre esa configuración.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Contact, Richland,
  Kennewick, Pasco, Family Photo Locations y Portfolio. Thank-you es
  `ready/noindex`; las otras 10 rutas siguen `draft/noindex`.
- Release contiene 10 URLs en sitemap y 9 entradas en `llms.txt`; Portfolio
  queda fuera de `llms.txt`. Staging mantiene sitemap vacío y noindex global.
- Contact queda `ready/index`, `lastModified: 2026-08-11`, con metadata y
  canonical release, sin regla noindex, y schema `ContactPage` más
  `BreadcrumbList`. No emite un `Service`, calle, coordenadas, reseñas ni
  rating inventados.
- `/privacy/` permanece `draft/noindex`. Su revisión legal de Netlify Forms,
  Microsoft Clarity, Google Analytics y consentimiento es una deuda separada y
  no se resolvió por inferencia.
- El usuario confirmó el 2026-08-11 que Netlify Forms y sus notificaciones están
  configurados y funcionando en producción.

## Contact cerrado en `dd4a590`

### Un solo formulario y un solo momento de conversión

- `/contact/` renderiza exactamente un form `session-estimate`; no existe un
  form oculto duplicado para Netlify.
- Nombre y email son los únicos datos de contacto requeridos. Teléfono,
  preferred timing e historia son opcionales.
- Session, Coverage, People, Keepsakes y add-ons conservan sus opciones y
  precios visibles; el total combinado y el desglose empiezan
  semánticamente ocultos.
- La CTA exacta es `Send My Details & Reveal My Estimate`.
- La microcopia aclara que el resultado no es booking ni pago y que los datos y
  elecciones se envían a Lisa mediante Netlify Forms para responder sobre la
  sesión.

### Gate AJAX y fallback

- JavaScript serializa el único form como
  `application/x-www-form-urlencoded` y hace POST same-origin a `/`.
- Solo `response.ok` desbloquea el recibo, muestra el total desktop/móvil,
  anuncia éxito y enfoca el título del recibo.
- Durante el request, los controles quedan congelados y el guard impide doble
  submit. Después del éxito permanecen congelados para que el recibo coincida
  con lo enviado.
- HTTP no exitoso, fallo de red o timeout de 15 segundos mantienen el recibo
  locked, conservan todos los valores, restauran controles, enfocan la alerta y
  permiten reintentar.
- Sin JavaScript, el HTML conserva Netlify detection, honeypot, campo
  `form-name`, POST y `action="/thank-you/"`; las selecciones crudas permiten
  recalcular manualmente.

### Analítica y privacidad

- Google tag recibe únicamente los eventos `contact_gate_view`,
  `estimate_started`, `contact_gate_submit_attempt`,
  `contact_gate_submit_success`, `contact_gate_submit_error` y
  `estimate_revealed`, sin nombre, email, teléfono, historia ni valor de campos.
- El disclosure inline describe el transporte y propósito de los datos; no se
  presenta como sustituto de una política legal.
- No se usa browser storage para persistir PII o el estado desbloqueado.

## Verificación ejecutada

- Build/validador staging: `Validated 21 public routes in staging mode.`
- Build/validador release: `Validated 21 public routes in release mode.`
- Release verificado con 10 URLs exactas en sitemap y 9 líneas exactas en
  `llms.txt`; Contact tiene `lastmod 2026-08-11`.
- Playwright aprobó 1440, 1200, 900 y 390 px con una respuesta 2xx mockeada:
  exactamente un POST, receipt desbloqueado, total `$955.98`, foco correcto,
  controles congelados y cero overflow.
- Playwright aprobó error 5xx a 1200 y fallo de red a 390: exactamente un POST,
  receipt bloqueado, datos preservados, alerta enfocada y reintento disponible.
- Playwright aprobó doble clic a 1440 con exactamente un POST.
- El contexto sin JavaScript confirmó método/action, Netlify detection,
  `form-name`, honeypot, detalles ocultos y mensaje de fallback.
- Todos los POST de Playwright fueron interceptados. El QA no envió datos
  reales ni comprobó el buzón; la confirmación de Forms/notificaciones en
  producción fue aportada por el usuario.
- `node --check` pasó para el validador y el script Playwright.
- `git diff --check` y el parseo Markdown pasaron antes del cierre documental.

## Archivos del lote

Implementación funcional en `dd4a590`:

- `config/netlify-headers/release`
- `content/pages/contact.json`
- `page-manifest.ts`
- `scripts/playwright-contact-gate.js`
- `scripts/validate-site.mjs`
- `src/components/SessionPriceCalculator.astro`
- `src/lib/page-manifest.ts`
- `src/pages/[slug].astro`
- `src/scripts/session-price-calculator.ts`
- `src/styles/contact-page.css`

Documentación de este cierre:

- `paginas/10-contact.md`
- `DESIGN.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Contact | `ready/index` en `dd4a590`; gate cerrado | Push del usuario, deploy y prueba real controlada. |
| Documentación Contact | Completa en `HEAD` | Sin trabajo parcial. |
| Netlify Forms/notificaciones | Usuario confirma funcionamiento en producción | Validar la nueva capa AJAX después del deploy. |
| Privacy | `draft/noindex` | Revisión factual/legal y decisión de consentimiento. |
| Homepage/About/Newborn/ciudades | `ready/index` | QA acumulado del dominio final tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y consumo Netlify 48 h tras deploy. |
| Seniors / Senior timing | Draft | Paquetes, oferta Q54, fechas editoriales y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| Reviews | Draft | Reseñas autorizadas y link oficial. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
git rev-list --count origin/main..HEAD
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
```

Para reconstruir Tina localmente, no detener el servidor largo del usuario en
`:9000`; usar un data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de publicar sus
propios commits, porque ese script hace push.

## Bloqueadores externos

1. El usuario debe publicar los dos commits locales de Contact.
2. Netlify debe completar el deploy antes del QA del dominio final y la prueba
   real del gate.
3. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
4. Privacy requiere revisión legal autorizada antes de su propia publicación.
5. Las verificaciones externas de analytics, GBP y Search Console continúan
   pendientes.

## Preguntas abiertas

- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién verificará Clarity, Google Analytics y Search Console?
