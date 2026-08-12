# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 23:49 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional canónico:** `ffe5198` —
`feat(journal): publish journal hub`

**Cierre documental anterior ya publicado:** `a33f6ec` —
`docs(journal): record branding versus headshots publication`

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git antes del commit documental:** `origin/main` apunta a `a33f6ec` y
`main` está un commit por delante. El worktree contiene únicamente este cierre
en los nueve archivos documentales autorizados y dos entregables nuevos sin
stage:
`docs/lisa-publication-confirmation-checklist.md` y `.docx`. Un commit local del
cierre dejaría `main` dos commits por delante. No se hizo stage, commit docs,
push, deploy, DNS ni `./scripts/handoff.sh`.

---

## Siguiente paso concreto

Revisar y commitear localmente el cierre documental junto con las dos versiones
del checklist, sin incluir otros archivos. Después, enviar el DOCX o Markdown a
Lisa, registrar sus respuestas literalmente y aplicarlas ruta por ruta; ninguna
pregunta respondida para una página levanta automáticamente los gates de otra.

No publicar Seniors, Branding, Headshots, Investment, Senior Timing ni Newborn
Comparison hasta completar su bloque correspondiente del checklist y repetir
QA de contenido, release y responsive. Reviews y Privacy están fuera del
documento porque el usuario confirmó que se encargará de ambas.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- `/journal/` quedó `ready/index` en `ffe5198`, con
  `lastModified: 2026-08-11`, `CollectionPage` y `BreadcrumbList`.
- Release contiene 12 URLs en sitemap y 11 entradas en `llms.txt`; staging
  conserva sitemap vacío y noindex global.
- El hub mantiene cuatro cards visibles, pero solo Locations Guide y Branding
  vs. Headshots enlazan artículos publicados. Portfolio y Contact completan
  cuatro anchors exactos.
- Senior Timing y Newborn Comparison siguen `draft/noindex`; se retiraron sus
  links del hub, footer y rutas `ready/index`. Newborn conserva el copy
  relacionado sin anchor.
- El checklist de Lisa cubre seis rutas pendientes y corrige el gate de Seniors:
  deben confirmarse outfits por paquete, no un número de imágenes.
- El QA web y documental final está aprobado. Falta el commit documental local,
  el envío del checklist y, más adelante, el smoke test del deploy que publique
  el usuario.

## Journal en `ffe5198`

### Navegación y contenido

- La firma visual `overlap`, hero, copy, cuatro cards y orden editorial no se
  rediseñaron.
- Anchors exactos dentro de `<main>`: Locations Guide → Branding vs. Headshots
  → Portfolio → Contact.
- Las cards Senior Timing y Newborn Comparison conservan título y extracto sin
  anchor mientras sus rutas sigan draft.
- El footer global ya no enlaza esos dos artículos. La sección relacionada de
  Newborn conserva su texto y pierde únicamente el enlace.

### SEO y schema

- Contenido y manifiestos usan `contentStatus: ready`,
  `searchVisibility: index`, `sitemap: true`, `llms: true` y
  `lastModified: 2026-08-11`.
- El header release noindex del hub se retiró; permanecen las reglas explícitas
  para Senior Timing y Newborn Comparison.
- La ruta emite exactamente un `CollectionPage` canónico y un
  `BreadcrumbList` Home → Journal. No emite `Article`, `Service`, `Offer`,
  reseñas ni rating.
- El validador protege fuente, HTML, orden de anchors, ausencia de links hacia
  artículos draft, schema y crawler membership.

## Checklist de confirmación para Lisa

Entregables:

- `docs/lisa-publication-confirmation-checklist.md`
- `docs/lisa-publication-confirmation-checklist.docx`

Cobertura:

1. Reglas compartidas de coberturas, colecciones, add-ons y aplicabilidad por
   servicio.
2. Seniors: outfits incluidos por paquete y outfit adicional.
3. Branding: duración, entregables, selección, turnaround, equipos y derechos.
4. Headshots: tiempo frente a cámara, setup, cantidad/selección, retoque,
   resolución, turnaround, derechos y equipos.
5. Investment: modelo comercial, relación entre coberturas y colecciones y
   decisión sobre small elopements.
6. Senior Timing: fecha editorial; Q54 y deadlines distritales solo si Lisa los
   confirma o existe fuente primaria.
7. Newborn Comparison: aprobación factual, formato exacto casa + golden hour y
   fecha editorial.
8. Autorización final separada por ruta.

Reviews y Privacy están excluidos expresamente. El DOCX usa tamaño Letter, seis
páginas, estructura etiquetada y no presenta clipping; la auditoría de
accesibilidad registró high/medium/low `0/0/0`.

## Verificación funcional registrada

- Build/validador staging: `PASS`, 21/21 rutas, sitemap vacío y noindex global.
- Build/validador release: `PASS`, 21/21 rutas, sitemap 12 y `llms.txt` 11.
- Playwright Journal: `PASS` en 1440, 1200, 900 y 390 px; cero overflow
  horizontal, imágenes rotas o errores runtime.
- Suite Newborn de regresión: `PASS` en 1440, 1200, 900 y 390 px después de
  retirar el enlace draft.
- Revisión independiente: `PASS` sin P1/P2.
- Auditoría de contenido del checklist: `PASS`.
- DOCX renderizado en seis páginas Letter; auditoría de accesibilidad
  high/medium/low `0/0/0`.

## Cierre documental actual

- `paginas/14-journal-hub.md` — publicación, enlaces, schema y QA.
- `paginas/00-INDICE.md` — estado real de rutas y gates de Lisa.
- `STRUCTURE.md` — sitemap 12, `llms.txt` 11 y arquitectura Journal.
- `DESIGN.md` — addendum 19 sin inventar un rediseño.
- `docs/context/10-arquitectura.md` — renderer, guardas, schema y checklist.
- `docs/context/20-estado.md` — esta fotografía, reescrita al final.
- `docs/context/30-decisiones.md` — ADR-057 append-only.
- `docs/context/40-bitacora.md` — entrada append-only del rollout.
- `docs/context/50-backlog.md` — Journal cerrado y envío a Lisa como siguiente
  operación.
- `docs/lisa-publication-confirmation-checklist.md` y `.docx` — entregables para
  Lisa.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Journal hub | Implementación completa en `ffe5198`; `ready/index` | Commit documental local y smoke test tras el deploy autorizado. |
| Seniors service | `draft/noindex` | Confirmar outfits por paquete y regla de outfit adicional; después revalidar copy/estimador. |
| Branding service | Media renovada; `draft/noindex` | Confirmar aplicabilidad de paquetes, duración, entregables, selección, turnaround y derechos. |
| Headshots service | Media renovada; `draft/noindex` | Confirmar tiempo/setup, entregables, selección, turnaround, derechos y reglas de equipo. |
| Investment | `draft/noindex` | Confirmar modelo de paquetes, relación cobertura/colección y small elopements. |
| Senior Timing | Renderer completo; `draft/noindex` | Fecha editorial; Q54 opcional solo con confirmación. Deadlines distritales son mejora opcional con fuente. |
| Newborn Comparison | Renderer completo; `draft/noindex` | Aprobación Lisa, formato exacto casa + golden hour y fecha real. |
| Reviews / Privacy | `draft/noindex` | Fuera del checklist; el usuario gestiona ambas. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS/canonicals. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status --short --branch
git rev-list --count origin/main..HEAD
git diff --check
git diff -- paginas/14-journal-hub.md paginas/00-INDICE.md STRUCTURE.md DESIGN.md docs/context/10-arquitectura.md docs/context/20-estado.md docs/context/30-decisiones.md docs/context/40-bitacora.md docs/context/50-backlog.md
```

No ejecutar `./scripts/handoff.sh` mientras el usuario conserve la política de
publicar sus propios commits, porque el script hace push. Si se reconstruye Tina
localmente y `:9000` está ocupado, usar un data layer/puerto aislado sin detener
el servidor del usuario y revisar `git status` después del build.

## Bloqueadores externos y preguntas abiertas

1. Lisa debe responder el checklist antes de cambiar cualquiera de las seis
   rutas pendientes a `ready/index`.
2. Falta el commit documental local y el push/deploy que el usuario decida
   publicar; Codex no ejecuta push.
3. Después del deploy, falta smoke test de Journal en el host final: status 200,
   canonical/index, ausencia de header noindex, schema, sitemap/`llms.txt` y
   cuatro anchors exactos.
4. Branding/Headshots/Investment requieren una matriz única de aplicabilidad de
   coberturas y colecciones; el estimador no resuelve esa decisión comercial.
5. TODO(contexto): ¿el dominio canónico definitivo debe ser apex o `www`?
