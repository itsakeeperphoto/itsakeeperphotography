# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 18:48 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `1dd00d3` —
`feat(journal): redesign newborn comparison guide`

**Inicio documental del rollout:** `2f5b807` —
`docs(context): start newborn comparison redesign`

**Cierre documental anterior:** `2c47def` —
`docs(journal): record senior timing redesign`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git antes del commit documental:** `main` está 12 commits por delante
de `origin/main` (`b504f84`). El worktree contiene únicamente este cierre en los
nueve archivos documentales autorizados y permanece unstaged. El commit local
`docs(journal): record newborn comparison redesign` lo dejará ahead 13. No se
hizo push, deploy, DNS ni `./scripts/handoff.sh`.

---

## Siguiente paso concreto

Revisar y commitear localmente este cierre documental sin mezclar otros
cambios. La ruta
`/journal/in-home-vs-studio-newborn-photography/` **no debe publicarse todavía**:
primero se deben resolver literalmente estos tres gates:

1. `[VALIDAR CON LISA]`
2. `[VALIDAR: formato exacto que ofrece Lisa]`
3. `[FECHA]`

Hasta entonces debe conservar `draft/noindex`, el header release noindex,
ausencia de fechas y exclusión de sitemap/`llms.txt`. Tras un push/deploy
autorizado, verificar esos mismos límites en el host final; esa comprobación no
autoriza por sí sola `ready/index`.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Release conserva 10 URLs en sitemap y 9 entradas en `llms.txt`; Newborn
  Comparison no pertenece a ninguna de las dos salidas.
- El artículo comparativo ya tiene renderer, diseño, copy completo, media,
  metadata, schema, validadores y QA propios en `1dd00d3`.
- La calidad técnica no resuelve aprobación, formato exacto ni fecha. No se
  inventó ninguno de esos datos.
- Contact transparente, Kind Words, Branding/Headshots y Senior Timing se
  preservaron; no se revirtió trabajo concurrente.

## Newborn Comparison en `1dd00d3`

### Render y dirección

- `NewbornComparisonPage.astro` reemplaza el fallback genérico solo para esta
  ruta en SSR.
- `EditorialPageRouter.astro` conserva el mismo renderer durante refresh Tina.
- `journal-newborn-comparison-page.css` se procesa mediante `?url` y se enlaza
  solo en la ruta; no filtra reglas a las otras veinte páginas.
- Concept B / Impeccable, `The house as archive`, es la dirección canónica. Las
  comps A y C quedaron rechazadas.
- La secuencia es hero compartido, byline sin fecha, Short Answer, díptico de
  definiciones, cuatro filas Honest Comparison, Outdoor, Treasure, tres FAQ
  nativos y cierre full-bleed.
- El pase final corrigió crops de hero/exterior/cierre por breakpoint, restauró
  breathing room, equilibró el díptico en desktop/tablet/móvil y mantuvo el
  orden DOM sin overlaps.

### Copy, headings y enlaces

- `paginas/17-journal-newborn.md` era byte-identical a la fuente externa antes
  de incorporar el registro de implementación; su bloque visible definitivo se
  preserva completo.
- Contrato exacto: 1 H1, 8 H2, 7 H3 y 3 FAQ. Incluye el capítulo Outdoor y el
  párrafo final Tri-Cities que faltaban en el JSON anterior.
- `scripts/validate-site.mjs` compara también todos los párrafos y su orden
  literal; una omisión o paráfrasis falla el build.
- Los tres anchors de `<main>` son Family, Newborn y Contact, en ese orden. El
  control `Read the comparison` del hero es botón local, no anchor.
- La byline muestra Lisa Weiss, el negocio y Richland, WA, sin fecha falsa.

### Media

- La ruta reutiliza exactamente nueve fuentes existentes y únicas.
- Siete imágenes son informativas y usan alt literal; dos prints del hero son
  decorativos y usan alt vacío.
- Las escenas aspiracionales de nursing, nursery, bassinet y parents by the
  window no se usan como alt porque las fotografías elegidas no las prueban.
- Las tres superficies del hero cargan eager; solo el fondo tiene prioridad
  alta. Las seis de cuerpo cargan lazy/async con dimensiones intrínsecas y WebP
  responsive existentes.
- No se añadió, copió, recodificó, renombró ni borró media en este rediseño.

### SEO, schema y publicación

- Title: `In-Home vs. Studio Newborn Photography: How to Choose`.
- Description: `In-home or studio newborn photos? An honest comparison from a
  Tri-Cities newborn photographer — comfort, style, timing and what each
  session really feels like.`
- `og:type=article`; canonical de la ruta y robots noindex permanecen
  alineados con el manifiesto.
- Se emite un único `Article` con autor/publisher, imagen real,
  `mainEntityOfPage`, tema y cobertura Tri-Cities; un único `FAQPage` derivado
  1:1 de las tres respuestas visibles; y un `BreadcrumbList` Home → Journal →
  In-Home vs. Studio Newborn Photography.
- No se emiten `Service`, `Review`, `AggregateRating`, calle, coordenadas,
  credencial de seguridad, `datePublished`, `dateModified` ni `lastModified`.
- `contentStatus=draft`, `searchVisibility=noindex`, header release noindex y
  exclusión de sitemap/`llms.txt` quedan protegidos por validación.

## Verificación funcional registrada

- Validadores staging y release: `Validated 21 public routes` en ambos modos.
- Playwright: `PASS` en 1440×1000, 1200×900, 900×900 y 390×844.
- Spot-check visual adicional: 1728 px.
- Cobertura: headings, párrafos, anchors, botón/foco del hero, byline sin fecha,
  tres `<details>`, nueve imágenes y WebP, crops, schema, canonical/robots,
  reduced motion, consola/red, CSS aislado y overflow horizontal cero.
- Detector Impeccable final: `[]`.

## Cierre documental actual

- `paginas/17-journal-newborn.md` — copy definitivo, media, schema, gates y QA.
- `paginas/00-INDICE.md` — estado `draft/noindex` y bloqueos corregidos.
- `STRUCTURE.md` — arquitectura de búsqueda y publicación segura.
- `DESIGN.md` — addendum 17 House Archive.
- `docs/context/10-arquitectura.md` — renderer, routers, CSS, schema y guardas.
- `docs/context/20-estado.md` — esta fotografía, reescrita al final.
- `docs/context/30-decisiones.md` — ADR-055 append-only.
- `docs/context/40-bitacora.md` — entrada append-only del rollout.
- `docs/context/50-backlog.md` — rediseño cumplido y publicación pendiente.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Newborn Comparison | Implementación completa en `1dd00d3`; `draft/noindex` | Aprobación Lisa, formato exacto y fecha real; después decisión de publicación y QA de release. |
| Senior Timing | Renderer completo; `draft/noindex` | Fecha editorial; Q54/datos distritales solo con confirmación o fuente. |
| Seniors service | `draft/noindex` | Confirmar número de imágenes por paquete. |
| Branding / Headshots | Media renovada; `draft/noindex` | Confirmar entregables, cantidades y duraciones. |
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
git diff -- paginas/17-journal-newborn.md paginas/00-INDICE.md STRUCTURE.md DESIGN.md docs/context/
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
```

No ejecutar `./scripts/handoff.sh` mientras el usuario conserve la política de
publicar sus propios commits, porque el script hace push. Si se reconstruye Tina
localmente y `:9000` está ocupado, usar un data layer alterno sin detener el
servidor del usuario; revisar `git status` después del build por IDs generados.

## Bloqueadores externos y preguntas abiertas

1. Lisa debe aprobar factual y explícitamente el artículo completo.
2. Lisa debe confirmar o corregir el formato combinado casa + golden hour.
3. Lisa/William deben asignar una fecha editorial real.
4. El usuario decide cuándo commitear y publicar los 12 commits locales; Codex
   no hace push.
5. TODO(contexto): ¿qué fecha editorial real debe usar Newborn Comparison?
6. TODO(contexto): ¿el formato combinado descrito coincide exactamente con la
   oferta actual de Lisa?
7. TODO(contexto): ¿Lisa aprueba las afirmaciones comparativas completas sin
   cambios?
