# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 16:55 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional al iniciar:** `3261d30` — `docs(context): record sequential Netlify build`
**Remoto oficial:** `origin` → `https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git:** cambios funcionales y documentales de esta publicación quedan
pendientes de commit local. No se hizo push, deploy, Search Console ni mutación
externa.

---

## Siguiente paso concreto

Crear el commit local de publicación. William podrá hacer push cuando lo decida;
después del deploy se verifican 200/canonical/header de las cinco rutas, Realtime
de GA4/Clarity y se envía `/sitemap.xml` a Search Console.

## Resultado funcional

- Seniors, Branding, Investment, Senior Timing y Newborn Comparison están
  `ready/index`, fechadas `2026-08-17`, sin pendientes ni headers release
  `noindex`, y forman parte de sitemap y `llms.txt`.
- El sitemap release y `llms.txt` contienen las mismas 18 URLs canónicas. Las
  únicas rutas públicas fuera son Privacy —pendiente legal— y Thank-you
  —noindex permanente—; 404 tampoco pertenece al manifiesto.
- Lisa confirmó para Seniors 2/3/4 outfits en #ONE/#TWO/#THREE, sin recargo por
  cambio; cambiarse consume tiempo de sesión. Class of 2027 sigue vigente.
- El fee de sesión y las fotografías se compran por separado. La fecha se
  reserva con un retainer aplicado al fee; el saldo vence a más tardar el día
  de la sesión; la revisión guiada suele ocurrir unas dos semanas después.
- Senior, Family y Newborn conservan sus colecciones personales. Newborn se
  recomienda con al menos dos horas. Branding usa las coberturas generales,
  pero cada imagen final cuesta `$75` e incluye uso comercial.
- La galería digital final permanece activa aproximadamente un mes con
  descargas ilimitadas; el álbum móvil de cortesía no expira y es para consulta,
  no para impresión.
- Senior Timing no inventa fechas distritales: manda revisar el deadline de la
  escuela. Los dos artículos ahora emiten fechas estructuradas reales.
- Todas las URLs indexables emiten exactamente un `LocalBusiness` y `WebSite`,
  tipo principal correcto y el schema específico aplicable. `#business` es el
  `@id` canónico y `sameAs` enlaza el perfil Google verificado
  `https://g.page/r/CZnCWAWyBWnQEBM`; no se inventa Knowledge Graph MID,
  dirección, coordenadas, Review ni AggregateRating.
- GA4 `G-0YW8M601L1` y Clarity `xyqkkqom4v` siguen cargándose una sola vez solo
  en release.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  contratos de renderer.
- `npx astro build` — PASS en staging y release; 20 rutas prerenderizadas.
- `npm run install:netlify-headers` + `npm run validate:site` — PASS 20/20 en
  staging y release.
- Auditoría JSON-LD de las 18 URLs del sitemap — PASS: LocalBusiness/WebSite
  únicos, página principal presente, Google `sameAs` correcto y schemas
  Service/Article/FAQ/Breadcrumb según ruta.
- Sitemap/`llms.txt` — PASS 18/18, con `lastmod` `2026-08-17` en las cinco rutas.
- `npm run build:local` no pudo iniciar un segundo servidor Tina porque el
  proceso del usuario ya ocupa `:9000`; no se cerró. Sus fases comprobables se
  ejecutaron por separado y pasaron.

## Bloqueadores y pendientes operativos

- No queda ninguna de las cinco páginas comerciales/editoriales pendiente de
  `ready/index`.
- Privacy requiere texto legal aprobado y seguirá fuera del sitemap.
- El smoke autenticado de TinaCloud, el deploy real, GA4/Clarity Realtime y
  Search Console solo pueden verificarse después de publicar.

## Operación Git

- Debe crearse un commit local; no ejecutar push.
- No ejecutar `./scripts/handoff.sh` porque incluye push y el usuario autorizó
  únicamente commits.
- No preparar `.handoff/sessions/*.jsonl` para commit.
