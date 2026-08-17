# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 18:05 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD de inicio:** `976efaa` — `docs(context): record confirmed page publication`
**Remoto oficial:** `origin` → `https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git:** corrección funcional, documentación y commit local pendientes
al redactar este estado. No se hizo push, deploy ni mutación en Search Console.

---

## Siguiente paso concreto

Crear el commit local. Cuando William haga push y Netlify publique ese commit,
verificar primero con `curl -I` que las 18 URLs indexables no reciban
`X-Robots-Tag: noindex`; después usar URL Inspection live test y solicitar
indexación para las rutas que Google había bloqueado.

## Diagnóstico confirmado en producción

- El dominio principal ya redirige correctamente de apex a `www`; Homepage y
  Family permitieron solicitar indexación.
- Seniors, Branding, Investment, Senior Timing y Newborn Comparison respondían
  200 y HTML `ready/index`, pero el header HTTP seguía enviando
  `X-Robots-Tag: noindex, nofollow, noarchive`; el error de GSC era real.
- La respuesta coincidía con el mirror raíz `release`, que conservaba gates
  editoriales antiguos y había divergido de `config/netlify-headers/release`.
- El hub Journal mostraba cuatro cards, pero Senior Timing y Newborn Comparison
  no tenían href; Footer también omitía ambas rutas. Locations mostraba un
  título anterior distinto al destino.

## Implementación local

- `release` y `staging` ahora coinciden byte por byte con sus fuentes en
  `config/netlify-headers/`; release solo mantiene noindex en Admin, Tina
  Island, Thank-you, Privacy y 404.
- `validate:site` compara ambos pares y falla si reaparece drift.
- Journal enlaza Locations, Senior Timing, Newborn Comparison y Branding vs.
  Headshots; Reviews y Contact completan seis anchors del cuerpo.
- Footer enlaza las cuatro guías y los títulos de las cards coinciden con sus
  páginas. El hub usa `lastModified: 2026-08-17` en manifest y sitemap.
- El sitemap y `llms.txt` continúan con las mismas 18 URLs canónicas.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  contratos de renderer.
- `SITE_MODE=release npx astro build` — PASS: 20 rutas prerenderizadas.
- `SITE_MODE=release npm run install:netlify-headers` — PASS.
- `SITE_MODE=release npm run validate:site` — PASS 20/20.
- Artefacto Journal — PASS: seis hrefs esperados y cuatro enlaces Footer.
- Artefacto `_headers` — PASS: ninguna regla noindex para rutas publicables.
- `npm run build:local` solo no completó porque el proceso Tina del usuario ya
  ocupa `:9000`; no se cerró y todas sus fases verificables pasaron separadas.

## Pendientes operativos

- Publicar el commit local; hasta entonces Google seguirá viendo el header del
  deploy anterior.
- Post-deploy: inspeccionar live Seniors, Branding, Investment, Senior Timing y
  Newborn Comparison y luego solicitar indexación. Repetir para el resto del
  sitemap por prioridad, sin reenviar URLs que aún muestren noindex.
- Verificar TinaCloud autenticado y Realtime de GA4/Clarity en producción.
- Privacy conserva `draft/noindex` hasta disponer de texto legal aprobado;
  Thank-you y 404 permanecen noindex por diseño.

## Operación Git

- Crear solo commit local; el usuario prohibió push desde el agente.
- No ejecutar `./scripts/handoff.sh` porque incluye push.
- No preparar `.handoff/sessions/*.jsonl` para commit.
