# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 12:55 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `dbc8371` —
`fix(cms): repair deleted homepage media reference`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Base remota al inicio:** `1d9009c` — merge que contiene el borrado de
`7.jpg` y los commits SEO anteriores.

**Estado Git:** antes del commit documental, `main` está un commit por delante
de `origin/main`. No se hizo push, deploy, Search Console ni mutación externa.

---

## Siguiente paso concreto

William publica los commits cuando lo decida. Después se recarga `/admin/`
contra el deploy nuevo y se realiza un guardado controlado de Homepage para
confirmar TinaCloud. En el mismo deploy se verifica Headshots 200/index,
Realtime de GA4/Clarity y el sitemap antes de enviarlo a Search Console.

## Resultado funcional

- El borrado de `public/uploads/7.jpg` dejó
  `content/homepage/index.json > why.frontImage` apuntando a un asset
  inexistente. JSON y schema eran válidos, pero el documento quedaba
  inconsistente para el editor.
- Homepage usa ahora `/uploads/7-640.webp`, variante versionada de la misma
  fotografía y suficiente para el marco de 398 px. No se restauró el JPG, no se
  inventó una imagen y no cambió la composición.
- El alt se corrigió a una descripción literal de la familia de ocho personas.
- `validate:tina` recorre los 38 documentos JSON y reporta cualquier referencia
  `/uploads/...` inexistente con archivo y ruta exactos.
- El usuario confirmó que las diez reseñas visibles son textos literales y
  reales del Google Business Profile. Se registra la procedencia, pero no se
  emite `Review`/`AggregateRating` autorreferencial: faltan rating, fecha y URL
  individual, y Google no habilita ese snippet para el propio LocalBusiness ni
  agregados importados.
- Headshots continúa `ready/index`; release conserva 20 rutas y 13/13 URLs en
  sitemap/`llms.txt`.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas, 19
  renderers y media referenciada existente.
- Tina/Astro aislado en 4002/9001/4322 — Homepage HTTP 200.
- Playwright 1440×900 — ambas imágenes de `#the-why` cargadas a 640 px, alt
  correcto y overflow 0.
- `/admin/` local abrió Homepage, mostró el nuevo Front photo y un cambio
  reversible produjo `Document saved!`, sin diálogo de error PUT.
- La única consola local fue `/api/google-review-summary` 404, esperada porque
  Astro dev no ejecuta la función Netlify GBP; no afecta Tina ni producción.
- JSON, `git diff --check` y guard de media — PASS.

## Bloqueadores y pendientes operativos

- El error está corregido y reproducido como PASS local. TinaCloud requiere
  recargar el editor después del deploy para descartar estado anterior en la
  pestaña y repetir un save autenticado.
- Para cualquier posible schema de reseñas faltan rating, fecha y URL
  individuales; aun con ellos, no se añadirá al LocalBusiness mientras la
  política Google lo considere autorreferencial.
- Realtime de GA4/Clarity, canonicals/headers y Search Console se verifican
  después de publicar.
- Las páginas pendientes de confirmación siguen siendo Seniors, Branding,
  Investment, Senior Timing y Newborn Comparison. Privacy permanece pendiente
  de revisión legal; Thank-you es noindex permanente.

## Operación Git

- Commit funcional: `dbc8371`.
- Arquitectura, ADR-066/067, backlog, estado y bitácora forman el commit
  documental de cierre.
- No se ejecuta `./scripts/handoff.sh` porque hace push y el usuario autorizó
  commits locales, no pushes.
- No se prepararon transcripts `.handoff/sessions/*.jsonl` para commit.
