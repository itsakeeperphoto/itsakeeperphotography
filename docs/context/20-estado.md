# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 21:33 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `b22c581` —
`feat(journal): publish branding versus headshots guide`

**Cierre documental anterior:** `9540fe2` —
`docs(journal): record newborn comparison redesign`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git antes del commit documental:** `main` está 14 commits por delante
de `origin/main` (`b504f84`). El worktree contiene únicamente este cierre en
los nueve archivos documentales autorizados y permanece unstaged. El commit
local esperado `docs(journal): record branding versus headshots publication`
lo dejaría ahead 15. No se hizo stage, commit documental, push, deploy, DNS ni
`./scripts/handoff.sh` durante este cierre.

---

## Siguiente paso concreto

Revisar y commitear localmente el cierre documental Branding vs. Headshots.
Incluir únicamente los nueve archivos autorizados, usar
`docs(journal): record branding versus headshots publication` y no ejecutar
push, deploy ni `./scripts/handoff.sh`; el usuario conserva la publicación.

Después del push/deploy autorizado, verificar en el host final que
`/journal/branding-photos-vs-headshots/` responde 200/index, no recibe header
noindex, aparece una sola vez en sitemap y `llms.txt`, sirve sus once imágenes
responsive y conserva el CSS aislado. Esa comprobación no publica las páginas
de servicio Branding ni Headshots.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- El release contiene 11 URLs en sitemap y 10 entradas en `llms.txt`; la nueva
  ruta pertenece a ambas salidas.
- Branding vs. Headshots quedó publicado localmente como `ready/index`, con
  fecha editorial `2026-08-11`, renderer especializado y dirección Comp C /
  Impeccable `Versus Axis` en `b22c581`.
- El artículo preserva comparación editorial y no convierte frases del copy en
  duración, precio o entregables contractuales.
- Branding service y Headshots service siguen `draft/noindex`; Newborn
  Comparison y Senior Timing conservan sus gates independientes.
- El QA funcional final está aprobado; falta el commit documental local y la
  verificación del deploy que el usuario decida publicar.

## Branding vs. Headshots en `b22c581`

### Render y dirección

- `BrandingHeadshotsArticlePage.astro` sustituye el fallback genérico solo para
  `/journal/branding-photos-vs-headshots/` tanto en SSR como en refresh Tina.
- `journal-branding-vs-headshots-page.css` se procesa mediante `?url` y se
  enlaza solo en esa ruta; no filtra reglas a las otras veinte páginas.
- Comp C / Impeccable `Versus Axis` es canónica: un headshot singular enfrenta
  una biblioteca Branding asimétrica mediante una costura central `VS`.
- Comp A `Proofbook` y Comp B `Dossier` quedaron auditadas y descartadas.
- La costura es vertical entre 900 y 1728 px y horizontal a 390 px; a 1440,
  `figureGap` mide 174.375 px frente a una costura de 88 px.

### Copy, semántica y enlaces

- Contrato visible exacto: 1 H1, 8 H2, 6 H3 y 3 FAQ.
- El bloque de decisión conserva una lista semántica de cinco ítems y una tabla
  accesible de seis filas.
- Los tres anchors de `<main>` son Branding, Headshots y Contact, en ese orden.
  `Read the comparison` en el hero es un botón local, no un cuarto anchor.
- El artículo permanece separado de las fichas de servicio; no promete paquetes
  ni levanta sus pendientes de cantidades, entregables o duración.

### Media

- La ruta reutiliza exactamente once fuentes existentes y únicas.
- Ocho imágenes son informativas y usan alt literal; tres son decorativas y
  usan alt vacío.
- Las tres superficies del hero cargan eager y solo el fondo tiene prioridad
  alta; las ocho imágenes de cuerpo cargan lazy/async con WebP responsive.
- No se añadió, copió, recodificó, renombró ni borró media compartida.

### SEO, schema y publicación

- `contentStatus=ready`, `searchVisibility=index`, `lastModified`,
  `datePublished` y `dateModified` usan `2026-08-11`.
- La card del Journal enlaza la ruta y release no aplica header noindex.
- Sitemap release contiene 11 URLs y `llms.txt` 10 entradas, con la ruta una
  sola vez en cada salida.
- Se emite un único `Article`, un único `FAQPage` derivado 1:1 de las tres FAQ
  visibles y un `BreadcrumbList` Home → Journal → Branding Photos vs.
  Headshots.
- No se emiten `Service`, `Offer`, duración/precio estructurado, reseñas,
  `AggregateRating`, calle ni coordenadas.

## Verificación funcional registrada

- Build release definitivo: `PASS`; validador: `Validated 21 public routes in
  release mode`.
- Build/validador staging previo: `PASS`, 21/21 rutas.
- Suite Playwright dedicada: `PASS` en 1440×1000, 1200×900, 900×900, 390×844
  y 1728×963; produjo 15 capturas finales a las 21:24 en
  `.artifacts/branding-headshots-article/`.
- Detector Impeccable final: `[]`; revisión independiente: `PASS` sin P1/P2.
- Contraste del texto Headshot: 4.6104:1; contraste del foco ledger: 13.479:1;
  body y tabla móvil: mínimo 16 px.
- Cero overflow horizontal, clipping, errores runtime o fallos same-origin.
- El único P3 no funcional pertenece a los crops de evidencia de sección, que
  retienen skip-link/header enfocado; las capturas full-page están limpias y el
  comportamiento accesible es correcto.
- Un intento de build default se bloqueó únicamente porque el servidor largo
  del usuario ocupaba `:9000`; no se detuvo. Los builds definitivos se
  ejecutaron aislados y pasaron.

## Cierre documental actual

- `paginas/18-journal-branding-vs-headshots.md` — copy, media, schema,
  publicación y QA definitivos.
- `paginas/00-INDICE.md` — estado `ready/index` y orden de publicación.
- `STRUCTURE.md` — renderer, enlaces, búsqueda y salidas crawler.
- `DESIGN.md` — addendum 18 Comp C / Versus Axis.
- `docs/context/10-arquitectura.md` — SSR/Tina, CSS aislado, contrato y guardas.
- `docs/context/20-estado.md` — esta fotografía, reescrita al final.
- `docs/context/30-decisiones.md` — ADR-056 append-only.
- `docs/context/40-bitacora.md` — entrada append-only de publicación.
- `docs/context/50-backlog.md` — cierre cumplido y operaciones pendientes.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Branding vs. Headshots article | Implementación completa en `b22c581`; `ready/index` | Commit documental local y smoke test del deploy autorizado. |
| Newborn Comparison | Implementación completa en `1dd00d3`; `draft/noindex` | Aprobación Lisa, formato exacto y fecha real; después decisión de publicación y QA release. |
| Senior Timing | Renderer completo; `draft/noindex` | Fecha editorial; Q54/datos distritales solo con confirmación o fuente. |
| Seniors service | `draft/noindex` | Confirmar número de imágenes por paquete. |
| Branding / Headshots services | Media renovada; `draft/noindex` | Confirmar entregables, cantidades y duraciones. |
| Reviews | `draft/noindex` | Alcance, URL oficial y fuente estructurada. |
| Privacy | `draft/noindex` | Revisión factual/legal y consentimiento. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS/canonicals. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
git rev-list --count origin/main..HEAD
git diff --check
git diff -- paginas/18-journal-branding-vs-headshots.md paginas/00-INDICE.md STRUCTURE.md DESIGN.md docs/context/10-arquitectura.md docs/context/20-estado.md docs/context/30-decisiones.md docs/context/40-bitacora.md docs/context/50-backlog.md
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
```

No ejecutar `./scripts/handoff.sh` mientras el usuario conserve la política de
publicar sus propios commits, porque el script hace push. Si se reconstruye Tina
localmente y `:9000` está ocupado, usar un data layer/puerto aislado sin detener
el servidor del usuario; revisar `git status` después del build por IDs
generados.

## Bloqueadores externos y preguntas abiertas

1. El usuario decide cuándo crear el commit documental y publicar los 14/15
   commits locales; Codex no hace push.
2. Falta el smoke test de Branding vs. Headshots en el host final después del
   deploy autorizado.
3. Newborn Comparison conserva tres gates literales:
   `[VALIDAR CON LISA]`, `[VALIDAR: formato exacto que ofrece Lisa]` y
   `[FECHA]`.
4. Branding y Headshots service requieren confirmar entregables, cantidades y
   duraciones antes de cualquier publicación.
5. Senior Timing, Seniors, Reviews y Privacy conservan sus preguntas registradas
   en backlog; ninguna se resuelve por inferencia.
6. TODO(contexto): ¿el dominio canónico definitivo debe ser apex o `www`?
