# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-18 09:49 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `f9865ba` — `fix(pasco): contain faq heading on desktop`
**Remoto oficial:** `origin` → `https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git:** implementación funcional commiteada; este cierre documental
queda en un commit local separado. No se hizo push, deploy ni mutación externa.

---

## Siguiente paso concreto

William puede hacer push de los commits locales. Después del deploy, verificar
la FAQ de `/pasco-wa-photographer/` en desktop ancho y continuar la comprobación
post-deploy de headers `X-Robots-Tag` e indexación descrita en ADR-070.

## Implementación cerrada

- La FAQ Pasco conserva cuatro preguntas nativas y su fuente schema 4:4.
- El encabezado sigue ocupando cuatro columnas desktop, pero su H2 ya no escala
  hasta `7rem`: queda entre `4rem` y `4.5rem`, limitado por su propio rail.
- `PASCO QUESTIONS` termina antes del divisor y de la columna de preguntas.
- No cambiaron copy, HTML, orden DOM, colores, fotografías, schema, estado
  `ready/index`, sitemap ni `llms.txt`.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  contratos de renderer.
- `npx astro build` — PASS: 20 rutas prerenderizadas.
- `npm run install:netlify-headers` + `npm run validate:site` — PASS 20/20 en
  staging.
- Playwright — PASS en 1728, 1440, 1200, 900 y 390 px: cero overflow; el título
  permanece dentro del header y separado de la lista en layouts de columnas.
- Interacción — PASS: cuatro `<details>`, segunda pregunta abre; consola 0/0.
- Impeccable detector layout/final — `[]`; `git diff --check` — PASS.
- `npm run build:local` llegó hasta Tina y no pudo abrir `::1:4001` por el
  sandbox. Las fases verificables se ejecutaron por separado sin errores.

## Pendientes operativos

- Hacer push y confirmar el deploy; el agente tiene prohibido hacer push.
- En producción, confirmar que las 18 URLs indexables no reciben noindex HTTP y
  solicitar indexación en GSC donde corresponda.
- Verificar TinaCloud autenticado y Realtime de GA4/Clarity en producción.
- Privacy conserva `draft/noindex`; Thank-you y 404 permanecen noindex por
  diseño.

## Operación Git

- Commit funcional local: `f9865ba`.
- El cierre documental se registra en un segundo commit local.
- No ejecutar `./scripts/handoff.sh` porque incluye push.
- No preparar `.handoff/sessions/*.jsonl` para commit.
