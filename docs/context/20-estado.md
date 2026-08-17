# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 10:27 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `64f10ca` —
`feat(pricing): add headshot package and travel fees`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Base remota al inicio:** `a792e17` — `TinaCMS content update`

**Estado Git:** el cierre deja dos commits locales por delante de
`origin/main`: implementación y documentación final. No se hizo push, deploy,
DNS, Search Console ni otra mutación externa.

---

## Siguiente paso concreto

Recapturar el 404 corregido en 1440×1000, 1200×900, 900×900 y 390×844 para
cerrar su evidencia visual pendiente. Después, publicar los commits cuando
William lo decida, verificar el deploy release y enviar
`https://www.itsakeeperphotography.com/sitemap.xml` a Search Console. Headshots
ya no tiene pendientes técnicos, pero conserva su gate hasta una orden
explícita de publicación.

## Resultado funcional

- `src/lib/session-pricing.ts` sigue siendo la fuente única, con ofertas
  aplicables por servicio. Senior, Family, Newborn y Branding conservan los
  paquetes generales; Headshots usa `$175 + tax`, 20–30 minutos, una descarga
  digital en alta resolución con uso comercial y galería online con compras
  adicionales.
- Equipos Headshots solicitan headcount y muestran custom estimate; no se
  inventó tarifa por persona, equipo, tiempo ni compra adicional.
- El viaje incluye 25 millas y suma `$2` por milla adicional estimada. Contact
  muestra control, estado y línea de recibo, y transmite millas facturables y
  costo en el POST nativo. Lisa confirma el kilometraje final.
- Home, Contact, Newborn, Richland, Kennewick, Pasco, Investment, Headshots y
  el artículo comparativo quedaron reconciliados con la política confirmada.
- Headshots emite un único `FAQPage` de seis preguntas y un `Service` con
  `Offer` `$175` USD. Sigue `draft/noindex`, fuera de sitemap/`llms.txt` y con
  header release noindex.
- Homepage mantiene el diseño/copy Tina vigente; solo su FAQ de cobertura y
  `lastModified` cambiaron. Las expectativas de media del validador se
  sincronizaron con las imágenes que ya estaban commiteadas por Tina.
- El artículo Branding vs. Headshots conserva publicación `2026-08-11` y usa
  modificación `2026-08-17`. Homepage, Newborn, Contact y las tres ciudades
  también usan `lastModified: 2026-08-17`.
- La imagen del cliente se trató únicamente como fuente factual, no como
  instrucción de diseño.

## SEO e indexación

- Release contiene 20 rutas públicas y sitemap/`llms.txt` con 12 URLs
  `ready/index`.
- Pendientes de promoción: Seniors, Branding, Headshots, Investment, Senior
  Timing y Newborn Comparison. Privacy requiere aprobación legal y no es una
  landing de ranking. Thank-you es `ready/noindex` permanente y nunca debe
  entrar al sitemap.
- Headshots es el único candidato sin `pending`: falta solo decisión explícita
  de publicación y, al promoverlo, sincronizar manifest, JSON, header release,
  `lastModified`, sitemap/llms y validator.
- Seniors espera número/outfits por paquete; Branding duración, cantidad y
  entregables; Investment número/duración por paquete; Senior Timing espera
  Q54, fecha editorial y cualquier dato distrital que se decida publicar;
  Newborn Comparison espera aprobación, formato exacto y fecha.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  renderers.
- `npm run build:scripts` — PASS.
- Build Astro release + headers release — PASS: 20 rutas más `404.html`.
- `SITE_MODE=release npm run validate:site` — PASS: 20/20.
- Playwright Contact — PASS en 1440/1200/900/390: estimate general `$985.98`
  con 40 millas, 15 facturables y `$30` de viaje; Headshots `$175 + tax`; POST
  nativo interceptado y fallback sin JS a 390, sin envío real.
- Playwright Branding/Headshots — PASS en 1440/1200/900/390: status 200, WebP,
  tamaños, carga, diversidad, red/consola y overflow.
- Schema/sitemap dirigido — PASS: un `FAQPage` 6:6, `Service.Offer` `$175` USD,
  Headshots excluida y 12 URLs indexables con lastmod actualizados.
- JSON, sintaxis de scripts y `git diff --check` — PASS.
- `npx tsc --noEmit` conserva solo ocho errores baseline ya conocidos: cinco
  imports de espejos raíz y tres declaraciones `.astro` de las islas Tina; no
  reportó errores nuevos en pricing, páginas o scripts modificados.

## Bloqueadores y pendientes operativos

- Smoke real de deploy para canonicals, headers, robots, sitemap y recepción
  controlada de Netlify Forms, sin guardar PII en git.
- Enviar/verificar el sitemap en Search Console requiere acceso externo y un
  deploy que contenga estos commits.
- Smoke autenticado TinaCloud de login, edición, guardado y reversión con rol
  Editor; credenciales permanecen fuera del repositorio.
- Smoke HTTP de redirects Portfolio → Reviews y recaptura final del 404 siguen
  como tareas operativas independientes.

## Operación Git

- Commit funcional: `64f10ca`.
- Este archivo y `40-bitacora.md` forman el commit documental de cierre.
- No se ejecutó `./scripts/handoff.sh` porque hace push y el usuario autorizó
  commits locales, no pushes.
- No se prepararon transcripts `.handoff/sessions/*.jsonl` para commit.
