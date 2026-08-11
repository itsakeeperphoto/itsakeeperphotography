# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 13:00 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional verificado:** `127c539` —
`feat(media): refresh branding and headshot photography`

**Cierre documental:** presente en el worktree para el commit local siguiente;
no está staged ni commiteado en esta fotografía.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** antes del commit documental, `HEAD` es `127c539` y
`main` está tres commits por delante de `origin/main` (`b504f84`). Después del
commit documental esperado quedará cuatro por delante. Permanecen sin stage
cambios concurrentes y ajenos a este cierre en Homepage, testimonios,
`public/scripts/site.js`, Tina y siete JPEG `review-*`; no deben mezclarse,
revertirse ni documentarse como parte del refresh Branding/Headshots. Todo ese
trabajo permanece fuera de este cierre y sin stage. No se hizo push, deploy,
DNS ni otra mutación externa.

---

## Siguiente paso concreto

Crear el commit documental local que sigue a `127c539` incluyendo únicamente
los ocho documentos de este cierre. Luego el usuario debe publicar los cuatro
commits locales que están por delante de `origin/main`: dos de Contact y dos
del refresh Branding/Headshots. Codex no ejecuta push por la política vigente.

Después del deploy, verificar que Branding y Headshots responden 200 pero
continúan `noindex`, ausentes de `/sitemap.xml` y `/llms.txt`, con JPEG/WebP
disponibles y sin assets rotos. No cambiar ambas rutas a `ready/index` hasta que
Lisa confirme entregables, cantidades y duraciones por paquete.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Contact, Richland,
  Kennewick, Pasco, Family Photo Locations y Portfolio. Thank-you es
  `ready/noindex`; las otras 10 rutas siguen `draft/noindex`.
- Release contiene 10 URLs en sitemap y 9 entradas en `llms.txt`; Portfolio
  queda fuera de `llms.txt`. Staging mantiene sitemap vacío y noindex global.
- Branding y Headshots conservan `draft/noindex`, sin cambio de metadata de
  publicación ni crawler outputs. La deuda de entregables sigue abierta.
- El refresh incorpora 18 JPEG nuevos y 72 WebP regenerables. No se eliminó ni
  sobrescribió fotografía anterior usada en producción.
- La media procede de carpetas Drive verificadas de Branding photos en
  Richland, Kennewick y West Richland, además del inventario Headshot auditado.

## Refresh cerrado en `127c539`

### Diversidad de media

- Branding renderiza 13 superficies fotográficas desde 11 fuentes únicas, con
  máximo dos apariciones por fuente. Hero y cierre son distintos; el mosaico
  usa cuatro fuentes distintas.
- Headshots renderiza 14 superficies desde 11 fuentes únicas, también con
  máximo dos apariciones por fuente. Hero y cierre son distintos; el par Team
  Headshots no repite fotografía.
- Las imágenes informativas tienen alt literal de sujeto/acción y solo nombran
  una ciudad respaldada por la carpeta Drive. Las repeticiones decorativas
  pertinentes usan alt vacío para no duplicar la narración accesible.
- `BrandingPage.astro` deriva su mosaico desde los cuatro ítems de contenido;
  `HeadshotPage.astro` separa el print derecho del hero de la media Studio para
  evitar repetición consecutiva.

### Pipeline SEO y privacidad

- Los 18 JPEG nuevos usan filenames descriptivos, minúsculos y kebab-case; son
  sRGB, progresivos, ≤2400 px y ≤700 KiB.
- `config/image-seo-metadata.json` es la allowlist de metadata del lote y
  `scripts/lib/image-xmp.mjs` centraliza la construcción/normalización del XMP.
- La XMP segura conserva creator, credit, rights, web statement, title,
  description y ciudad/estado/país cuando la carpeta Drive lo verifica.
- Se excluyen GPS, dirección, sublocation, fecha de captura, serial, nombre RAW,
  EXIF/IPTC/ICC, `OriginalDocumentID` e historial/identificadores `xmpMM`. El
  retrato neutral de Headshots queda sin ciudad.
- `scripts/optimize-images.mjs` genera WebP 400/640/960/1440 y regenera los
  allowlisted cuando cambia el manifiesto. Las 72 variantes son reproducibles
  e ignoradas por Git.
- `scripts/validate-site.mjs` comprueba nombres, peso/dimensiones, XMP exacta,
  ausencia de metadata sensible, cuatro WebP por fuente y contratos exactos de
  fuente/alt/diversidad en ambas rutas.

## Verificación ejecutada

- Build/validador release: `Validated 21 public routes in release mode.`
- Release conserva 10 URLs exactas en sitemap y 9 entradas en `llms.txt`;
  Branding y Headshots permanecen fuera de ambos outputs.
- El optimizador confirmó las 72 variantes WebP al día después de su primera
  generación.
- El validador confirmó XMP exacta en JPEG/WebP y ausencia de
  EXIF/IPTC/ICC/GPS u otros campos prohibidos en los 18 assets.
- Playwright aprobó Branding y Headshots en 1440×1000, 1200×900, 900×900 y
  390×844: status 200, imágenes cargadas, `currentSrc` WebP, dimensiones,
  prioridades/lazy loading, alt, unicidad, hero/cierre diferentes, crops,
  consola/red local y overflow horizontal 0.
- La revisión visual de hero, composiciones internas y cierres en desktop y
  móvil aprobó encuadres y legibilidad.
- Los checks de sintaxis de Astro/Node/JSON, `git diff --check` y el parseo
  Markdown pasaron antes del cierre.

## Archivos del lote

Implementación funcional en `127c539`:

- `config/image-seo-metadata.json`
- `content/pages/branding.json`
- `content/pages/headshots.json`
- 18 JPEG nuevos en `public/uploads/`
- `scripts/lib/image-xmp.mjs`
- `scripts/optimize-images.mjs`
- `scripts/playwright-service-media.js`
- `scripts/validate-site.mjs`
- `src/components/pages/BrandingPage.astro`
- `src/components/pages/HeadshotPage.astro`

Documentación de este cierre:

- `paginas/05-branding.md`
- `paginas/06-headshots.md`
- `DESIGN.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Branding | Media renovada en `127c539`; `draft/noindex` | Confirmar entregables, cantidad de imágenes y duración; luego revisión editorial/publicación separada. |
| Headshots | Media renovada en `127c539`; `draft/noindex` | Confirmar duración y entregables; luego revisión editorial/publicación separada. |
| Documentación media | Completa en worktree, sin stage | Commit documental local separado. |
| Cambios Homepage/testimonios/Tina/reviews | Archivos modificados y untracked concurrentes, sin stage y ajenos | Su responsable debe continuarlos; no mezclar con este cierre. |
| Contact | `ready/index` en dos commits locales previos | Push del usuario, deploy y prueba real controlada del gate. |
| Privacy | `draft/noindex` | Revisión factual/legal y decisión de consentimiento. |
| Homepage/About/Newborn/ciudades | `ready/index` | QA acumulado del dominio final tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y consumo Netlify 48 h tras deploy. |
| Seniors / Senior timing | Draft | Paquetes, oferta Q54, fechas editoriales y QA. |
| Investment | Draft | Entregables, duración/cantidades y QA. |
| Reviews | Draft | Reseñas autorizadas y link oficial. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
git rev-list --count origin/main..HEAD
SITE_MODE=release SITE_ORIGIN=https://www.itsakeeperphotography.com npm run validate:site
```

Para reconstruir Tina localmente, no detener el servidor largo del usuario en
`:9000`; usar un data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de publicar sus
propios commits, porque ese script hace push.

## Bloqueadores externos

1. El usuario debe publicar los cuatro commits locales después del commit
   documental de este cierre.
2. Netlify debe completar el deploy antes del QA del dominio final.
3. Lisa debe confirmar entregables, cantidades y duración antes de publicar
   Branding o Headshots.
4. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
5. Privacy requiere revisión legal autorizada antes de su propia publicación.
6. Las verificaciones externas de analytics, GBP y Search Console continúan
   pendientes.

## Preguntas abiertas

- TODO(contexto): ¿cuáles son los entregables, cantidad de imágenes y duración
  exactos de Branding?
- TODO(contexto): ¿cuáles son la duración y entregables exactos de Headshots?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién verificará Clarity, Google Analytics y Search Console?
