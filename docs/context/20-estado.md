# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-17 16:40 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional actual:** `8045e79` —
`fix(build): separate Tina and Astro phases`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Base remota al inicio:** `3335478` — cierre documental de la reparación del
build Netlify.

**Estado Git:** antes del commit documental, `main` está un commit por delante
de `origin/main`. No se hizo push, deploy, Search Console ni mutación externa.

---

## Siguiente paso concreto

William publica los commits cuando lo decida y reintenta el deploy de Netlify.
Después se verifica Homepage y Reviews en móvil, un guardado controlado desde
Tina, Headshots 200/index, GA4/Clarity y el sitemap antes de enviarlo a Search
Console.

## Resultado funcional

- El deploy falló en `validate:tina`: Homepage referenciaba
  `/uploads/7-640.webp`, una variante local excluida por `.gitignore` y ausente
  en el clon limpio de Netlify. El JPG fuente `7.jpg` había sido eliminado.
- `why.frontImage` usa ahora
  `/uploads/pasco-family-mother-children-golden-hour.jpg`, fotografía vertical
  ya versionada. El alt describe literalmente a la mujer y los dos niños; no se
  restauró la foto eliminada ni se cambió CSS o composición.
- El primer error ocultaba un segundo gate: seis JPEG fuente superaban 2400 px.
  El optimizador oficial los redujo proporcionalmente a un total de 2.60 MiB,
  70.5% menos, sin recorte ni cambio de contenido.
- Headshots continúa `ready/index`; el release conserva 20 rutas públicas y
  13/13 URLs en sitemap/`llms.txt`.
- La tarjeta de Christina Bergstrom comparte ahora un identificador estable y,
  solo hasta 767 px, ancla su fotografía al borde superior. La cabeza queda
  visible en Home y Reviews sin cambiar dimensiones, orden ni otras reseñas.
- El segundo deploy llegó a construir todas las rutas, pero Netlify terminó el
  padre Tina con código 137 mientras Astro trazaba la función SSR. Tina y Astro
  ahora son comandos consecutivos: Tina termina/libera memoria antes de que
  comience `astro build`; se conservan todos los gates y outputs anteriores.

## QA ejecutada

- `npm run validate:tina` — PASS: 5 colecciones, 38 documentos, 20 rutas y 19
  contratos de renderer; toda media referenciada existe en git.
- `npm run optimize:source-images` — PASS: todos los JPEG están en o por debajo
  de 2400 px y 700 KiB.
- Tina local en puertos alternativos 4002/9001 + `astro build` — PASS: 20 rutas
  públicas y los cuatro artículos prerenderizados.
- `npm run install:netlify-headers` + `npm run validate:site` — PASS: 20 rutas
  en staging.
- `git diff --check` — PASS.
- Playwright 390×844 — PASS en `/` y `/reviews/`: fuente WebP 400 cargada,
  `object-position: 50% 0%`, cabeza visible y overflow horizontal 0.
- Detector Impeccable sobre componente/CSS — PASS `[]`.
- Tina sin subcomando, puertos 4002/9001 — PASS y salida 0; el proceso cerró su
  servidor antes de Astro.
- Astro con `NETLIFY=true`, contexto production y adaptador real — PASS: 20
  rutas, `Generated SSR Function` y salida 0 en 31.52 s.
- Headers release + `validate:site` — PASS 20/20.
- `npm run build` local llega hasta TinaCloud; no puede completar sin
  `TINA_PUBLIC_CLIENT_ID`/`TINA_TOKEN`. El log de Netlify confirma que esas
  variables sí están configuradas en el entorno remoto.

## Bloqueadores y pendientes operativos

- No queda un bloqueo de código conocido para el siguiente deploy. Falta que el
  usuario publique los commits y Netlify confirme el pipeline secuencial con
  sus secretos y límites reales.
- Realtime de GA4/Clarity, canonicals/headers y Search Console se verifican
  después de publicar.
- Las páginas pendientes de confirmación siguen siendo Seniors, Branding,
  Investment, Senior Timing y Newborn Comparison. Privacy permanece pendiente
  de revisión legal; Thank-you es noindex permanente.

## Operación Git

- Commit funcional actual: `8045e79`.
- Estado, backlog y bitácora forman el commit documental de cierre.
- No se ejecuta `./scripts/handoff.sh` porque hace push y el usuario autorizó
  commits locales, no pushes.
- No se prepararon transcripts `.handoff/sessions/*.jsonl` para commit.
