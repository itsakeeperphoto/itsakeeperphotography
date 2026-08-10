# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-10 08:21 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `b3bb362` —
`feat(newborn): publish definitive service page`

**Commit documental verificado:** `128e274` —
`docs(context): record Newborn rollout`

**Cierre de estado:** este archivo pertenece al commit local inmediatamente
posterior a `128e274`; consultar `git log -1` para su hash sin inventarlo aquí.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al preparar este cierre de estado:** `main` está nueve commits por
delante de `origin/main` (`ff736c6`) en `128e274`. Este documento y la
reconciliación final del backlog forman el commit local siguiente; al terminar,
el worktree queda limpio y la rama diez commits por delante. No se hizo push,
deploy, DNS ni otra mutación externa. El usuario conserva la publicación.

---

## Siguiente paso concreto

El usuario debe publicar los diez commits locales posteriores a `ff736c6`.
Cuando Netlify termine, verificar Newborn y las tres ciudades en producción:
status 200, canonical, meta robots index, ausencia de `X-Robots-Tag: noindex`,
membresía de sitemap/`llms.txt` y `lastmod` exacto. No cambiar apex/`www`, DNS
ni redirects sin resolver primero la divergencia de host documentada.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, Richland, Kennewick, Pasco,
  Family Photo Locations y Portfolio. Thank-you es `ready/noindex`; las otras
  12 rutas siguen `draft/noindex`.
- Newborn quedó publicada en `b3bb362` con `lastModified: 2026-08-10`, incluida
  en sitemap release y `llms.txt`; staging conserva noindex global.
- La fuente externa v2 confirmó el formato in-home mediante Q53 y fue
  reconciliada en `paginas/04-newborn.md`, ahora autoridad editorial vigente del
  repositorio. Q41 sobre formación de seguridad es el único pendiente de la
  ruta, no bloquea publicación y no existe un claim publicado.
- La dirección aprobada es A+C: A como base compositiva; C aporta la declaración
  `No hard deadline` y el FAQ master-detail.
- El `EditorialHero` y el bloque `What Your Newborn Session Looks Like`
  permanecen exactos en copy, DOM y geometría.
- El contrato visible final es un H1, siete H2, cuatro anchors dentro de
  `<main>` y ocho FAQ visibles/schema 1:1.
- Release contiene ocho URLs en sitemap y siete entradas en `llms.txt`;
  Portfolio queda fuera de `llms.txt`.

## Newborn definitiva

### Autoridad y contenido

- Procedencia v2:
  `/Users/williammelo/Documents/Claude/Projects/Its A Keeper Photography/paginas/04-newborn.md`.
- Autoridad vigente en repo: `paginas/04-newborn.md`, reconciliada con el
  híbrido realmente publicado.
- H1 exacta: `Newborn Photographer in the Tri-Cities, WA`.
- Siete H2 exactos y ordenados: Short Answer, These Days, proceso protegido,
  When to Book, Twenty Years, Questions y CTA final.
- Cuatro anchors exactos: Contact del hero, artículo comparison, Family y
  Contact final. No se añadieron Investment ni Reviews.
- Ocho FAQ nativas coinciden en orden y texto con ocho entidades `Question`.

### Diseño y regiones protegidas

- A “storybook ledger” determina ritmo, arcos y narrativa larga.
- C “archival proofbook” aporta el statement tipográfico `No hard deadline` y
  el FAQ ledger master-detail.
- El hero compartido y el proceso existente conservaron fingerprints DOM y
  baselines geométricos en 1440/1200/900/390.
- El detector Impeccable final devolvió `[]`.
- No se publicaron personas generadas, ornamentos copiados, claims de safety,
  deadline rígido de dos semanas ni city-specific alt text sin procedencia.

### Media y rendimiento

- Única fuente nueva:
  `public/uploads/newborn-family-at-home-west-richland.jpg`.
- Procedencia Drive verificada:
  `Family/Baby Session - West Richland/010A9895 copy.jpg`.
- Optimización: 13.13 MiB/4000×6000 → 412 KiB/1600×2400.
- Variantes WebP responsive regeneradas e ignoradas por Git.
- CSS Newborn depurado durante el rollout: 30,378 → 18,404 bytes (`-39.4%`),
  3,661 bytes gzip.

## SEO y crawler gates

- Estado de contenido/búsqueda: `ready/index`.
- Canonical release:
  `https://www.itsakeeperphotography.com/newborn-photographer-tri-cities-wa/`.
- Sitemap release: incluida con `lastmod 2026-08-10`.
- `llms.txt`: incluida.
- Headers release: no contiene regla route-specific noindex para Newborn.
- Staging: meta/header global `noindex,nofollow,noarchive`, sitemap sin URLs
  indexables y canonical Netlify.
- Schema específico: un `WebPage`, un `Service` de newborn photography in-home
  para Richland/Kennewick/Pasco, un `BreadcrumbList` Home → Newborn Photography
  y un `FAQPage` 8:8. No se emiten `Review`, `AggregateRating`, dirección
  residencial ni afirmaciones de seguridad no verificadas.

## Verificación ejecutada

- Build Tina+Astro en staging usando `--datalayer-port 9001`.
- Instalación de headers staging y `scripts/validate-site.mjs`: 21/21 rutas.
- Build Tina+Astro en release usando `--datalayer-port 9001`.
- Instalación de headers release y `scripts/validate-site.mjs`: 21/21 rutas.
- Detector final Impeccable: `[]`.
- Playwright Newborn: 1440×1000, 1200×900, 900×900 y 390×844.
- Resultado Playwright: 4/4 aprobados, sin overflow horizontal, errores de
  runtime, requests same-origin fallidos, imágenes rotas, fallos de foco ni
  regresiones en las dos regiones protegidas.
- Evidencia final ignorada: `.artifacts/newborn-final/`.
- `git diff --check` y revisión Markdown del cierre se ejecutan después de esta
  reescritura; sus resultados deben registrarse en el handoff inmediato, no
  anticiparse aquí como hechos.

## Archivos principales del rollout funcional

- Contenido: `content/pages/newborn.json`.
- UI: `src/components/pages/NewbornPage.astro`.
- Estilos: `src/styles/newborn-page.css`.
- Media nueva: `public/uploads/newborn-family-at-home-west-richland.jpg`.
- Publicación/schema: `src/lib/page-manifest.ts`, `page-manifest.ts`,
  `src/pages/[slug].astro`, `config/netlify-headers/release`.
- QA: `scripts/validate-site.mjs`, `scripts/playwright-newborn.js`.
- Diseño: `.impeccable/mocks/newborn-*` y
  `.impeccable/surfaces/route-newborn-photographer-tri-cities-wa.md`.

## Cierre documental registrado

Los ocho documentos principales quedaron en `128e274`; este archivo de estado
y el backlog se reconciliaron en el commit local inmediatamente posterior.

- `paginas/04-newborn.md`
- `.impeccable/surfaces/route-newborn-photographer-tri-cities-wa.md`
- `STRUCTURE.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado | Qué falta |
|---|---|---|
| Cierre documental Newborn | Registrado en `128e274` y finalizado en el commit de estado posterior | Nada local pendiente. |
| Producción | Diez commits locales sobre `ff736c6` | Push del usuario y QA del deploy. |
| Newborn | `ready/index` local | Verificar producción; Q41 es opcional/no bloqueante y no tiene claim. |
| Newborn comparison | Artículo `draft/noindex` | Validación de Lisa, formato del artículo y fecha editorial. |
| Richland/Kennewick/Pasco | `ready/index` local | Verificar producción y crawler outputs tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h tras deploy. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Operación local

- El servidor Tina de larga duración del usuario mantuvo ocupado `:9000`.
- Los builds finales usaron `--datalayer-port 9001`; no se detuvo ni modificó
  el proceso del usuario.
- Las capturas `.artifacts/newborn-final/` y las variantes WebP nuevas están
  ignoradas por Git.
- No ejecutar `./scripts/handoff.sh` mientras siga vigente la política del
  usuario de publicar personalmente, porque el script hace push.

## Bloqueadores externos

1. El usuario debe publicar los commits locales en el remoto oficial.
2. Esperar el deploy Netlify y comprobar crawler gates/lastmod de Newborn y las
   tres ciudades.
3. Resolver la divergencia apex/`www` antes de tocar canonical/DNS/redirects.
4. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
