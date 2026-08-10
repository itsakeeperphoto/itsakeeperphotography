# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-10 15:29 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `364569a` —
`feat(about): redesign and publish Lisa story`

**Commit documental:** este archivo pertenece al commit local inmediatamente
posterior a `364569a`; consultar `git log -1` después de crearlo para obtener su
hash sin inventarlo aquí.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al preparar este cierre:** `main` está quince commits por delante
de `origin/main` (`ff736c6`) en `364569a`. El worktree contiene únicamente los
ocho documentos reconciliados de este cierre; cuando entren en su commit local,
la rama quedará limpia y dieciséis commits por delante. No se hizo push, deploy,
DNS ni otra mutación externa; el usuario conserva la publicación.

---

## Siguiente paso concreto

El usuario debe publicar los dieciséis commits locales posteriores a `ff736c6`.
Cuando Netlify termine, comprobar `/about/` en el dominio final: status 200,
canonical `www`, meta robots index, ausencia de `X-Robots-Tag: noindex`,
membresía y `lastmod: 2026-08-10` en `/sitemap.xml`, entrada exacta en
`/llms.txt`, las cuatro fotografías nuevas y el hero sin cambios. Repetir la
comprobación pendiente de Newborn, Richland, Kennewick y Pasco. No cambiar
apex/`www`, DNS ni redirects antes de resolver la divergencia de host ya
documentada.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Richland, Kennewick,
  Pasco, Family Photo Locations y Portfolio. Thank-you es `ready/noindex`; las
  otras 11 rutas siguen `draft/noindex`.
- Release contiene nueve URLs en sitemap y ocho entradas en `llms.txt`;
  Portfolio queda fuera de `llms.txt`. Staging conserva sitemap vacío y noindex
  global.
- `/about/` quedó `ready/index`, `lastModified: 2026-08-10`, con copy definitivo,
  dirección A+C aprobada, autoridad verificable, schema propio y CSS aislado.
- El hero About anterior es una excepción protegida y permanece exacto en copy,
  DOM, tres fuentes fotográficas, crops y geometría 1440/1200/900/390.
- Ninguna fotografía previa fue borrada, reemplazada ni renombrada. Se añadieron
  cuatro retratos Lisa optimizados desde la carpeta Drive autorizada.
- Los claims pendientes de reseñas, salud, premio, Grammy, certificaciones,
  seguro, membresías y Google Business no se publican y no bloquean About.
- El commit funcional es `364569a`; este cierre documental todavía no está
  commiteado ni publicado.

## About publicado

### Copy y estructura visible

- Ruta: `/about/`.
- Title: `Meet Lisa Weiss | Tri-Cities Photographer for 20 Years`.
- Description: `The story behind It's A Keeper Photography — twenty years of
  preserving Tri-Cities families' most meaningful moments, and the mom who
  picked up a camera first.`
- H1 protegido: `Meet Lisa — The Heart Behind It's A Keeper`.
- Nueve H2 en orden: origen, nombre, cámara, veinte años, creencia, método,
  Lisa fuera de cámara, experiencia/reconocimiento y CTA final.
- Cinco anchors exactos dentro de `<main>`: hash del hero, Seniors, Investment,
  edición Issuu verificada y Contact.
- El enlace Issuu es la única salida externa, abre con `target="_blank"` y
  `rel="noopener"`, sin `nofollow`.
- `paginas/08-about.md` es la fuente reconciliada: contiene los 55 campos de
  copy publicados y documenta el hero como excepción explícita.

### Dirección A+C

- A `Keeper Archive` aporta el arco de origen, print superpuesto y ledger del
  nombre.
- C `Through Her Lens` aporta el ritmo de retratos, el ledger 4/2/1 de `How I
  Photograph` y la prueba editorial.
- La secuencia completa usa historia de la cámara, galería con arco central,
  statement de creencia, retratos Off Camera, autoridad de cuatro filas y
  cierre fotográfico full-bleed.
- `Experience & Recognition` integra autoridad como ledger, no como badges o
  estadísticas genéricas: Lisa Weiss, Founder & Professional Photographer en
  Richland; 20+ años detrás de cámara; 14 años de negocio; cientos de historias;
  portada Tri-Cities MOM Magazine, agosto/septiembre de 2019.
- Los mocks aprobados quedan bajo `.impeccable/mocks/` como referencias de
  geometría. Ningún pixel generado se usa como fotografía de producción.
- `DESIGN.md` y `.impeccable/surfaces/route-about.md` fijan la tesis, el mundo
  visual, los patrones prohibidos, la secuencia responsive y el finish contract.

### Hero protegido

- Conserva H1, intro, script, CTA `#it-started-with-my-own-children`, fondo y
  dos prints existentes.
- Las tres fuentes de entrada permanecen byte-identical frente al estado previo.
- Fingerprint DOM Playwright:
  `e28a637235dfa3f87fdb438f017e4c9fe9560d2aacc4627076d8e90ebd6a930d`.
- Baseline exterior: 1440×882, 1200×782, 900×688 y 390×867.64 px, tolerancia
  máxima de 1 CSS px.

### Media

- `about-lisa-camera-portrait-tricities.jpg`: 1600×2400, 298,467 bytes.
- `about-lisa-photographing-tricities.jpg`: 1600×2400, 478,551 bytes.
- `about-lisa-camera-candid-black-white.jpg`: 1600×2400, 374,362 bytes.
- `about-lisa-camera-close-portrait-tricities.jpg`: 1600×2400, 486,994 bytes.
- Las cuatro fuentes son sRGB, metadata retirada y ≤700 KiB; sus WebP
  400/640/960/1440 son regenerables mediante el pipeline existente.
- La auditoría Drive local permanece fuera del commit; producción incluye solo
  las cuatro selecciones autorizadas y optimizadas.

### SEO y autoridad estructurada

- Ambos manifiestos y el JSON coinciden en `ready/index`,
  `lastModified: 2026-08-10`, title, description y resumen `llms.txt`.
- El header release no contiene una regla noindex para About.
- `AboutPage.about` y `AboutPage.mainEntity` apuntan a la entidad canónica
  `#lisa`.
- Existe una sola `Person` Lisa Weiss con job title, descripción, relación con
  `#business`, Richland/WA/US sin calle ni coordenadas, siete temas de
  conocimiento, idioma inglés, perfiles sociales y `subjectOf` enlazado a la
  edición original de Tri-Cities MOM Magazine.
- `LocalBusiness.founder` referencia el mismo `@id` sin duplicar Person.
- El breadcrumb es Home → About Lisa.
- No se emiten `Service`, `FAQPage`, `Review`, `AggregateRating`, premio,
  credencial, street address ni coordenadas.

### Rendimiento y aislamiento

- `about-page.css` se procesa como URL Vite y `Base.astro` lo enlaza únicamente
  cuando `entry.id === "about"`.
- Las reglas `.about-*` y el comentario de dirección no aparecen en las otras
  veinte rutas del router editorial compartido.
- No se añadió JavaScript interactivo propio a About; el cuerpo permanece Astro
  estático y usa el pipeline responsive de `Picture.astro`.

## Verificación ejecutada

- Release: `Validated 21 public routes in release mode.`
- Playwright CLI: aprobado en 1440×1000, 1200×900, 900×900 y 390×844.
- En los cuatro viewports: status 200, canonical/robots correctos, un H1, nueve
  H2, cinco anchors en orden, schema exacto, todas las imágenes cargadas,
  variantes WebP, ancho de lectura y foco visibles.
- Cero overflow horizontal, clipping, solapamientos indebidos, imágenes rotas,
  errores de runtime, respuestas 4xx o requests same-origin fallidos.
- Reduced motion deja transiciones/transforms prescindibles anulados.
- El hero conserva DOM, fuentes y geometría dentro de la tolerancia de 1 px.
- La revisión final independiente devolvió `PASS` sin defectos materiales en
  hero, copy, autoridad, gates, schema, links, headings, responsive, assets ni
  aislamiento CSS.
- `git diff --check`, copy 55/55, fences Markdown y conflicto markers pasan para
  los documentos de cierre.

## Archivos del lote

Implementación funcional en `364569a`:

- `content/pages/about.json`
- `src/components/pages/AboutPage.astro`
- `src/styles/about-page.css`
- `src/pages/[slug].astro`
- `src/layouts/Base.astro`
- `src/lib/page-manifest.ts`
- `page-manifest.ts`
- `src/content/pending.ts`
- `scripts/validate-site.mjs`
- `scripts/playwright-about.js`
- `config/netlify-headers/release`
- cuatro JPEG bajo `public/uploads/about-lisa-*.jpg`
- comps, sidecars, prompts, manifest aprobado y superficie bajo `.impeccable/`

Documentación reconciliada en este cierre:

- `paginas/08-about.md`
- `DESIGN.md`
- `STRUCTURE.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| About | `ready/index` en `364569a` | Push del usuario y QA del deploy. |
| Documentación About | Completa en worktree | Crear el commit local de cierre. |
| Producción | Quince commits sobre `ff736c6` antes del cierre documental | Commit docs, push del usuario y QA Netlify. |
| Newborn | `ready/index` | Verificar producción; Q41 sigue opcional/no bloqueante y sin claim. |
| Richland/Kennewick/Pasco | `ready/index` | Verificar producción y crawler outputs tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h tras deploy. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| Reviews/Privacy | Draft | Reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
SITE_MODE=release npm run validate:site
```

Para una reconstrucción Tina local, no detener el servidor largo del usuario en
`:9000`; usar un puerto de data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de hacer push
personalmente, porque ese script publica el repositorio.

## Bloqueadores externos

1. Crear el commit documental local inmediatamente posterior a `364569a`.
2. El usuario debe publicar los dieciséis commits locales en el remoto oficial.
3. Esperar el deploy Netlify y comprobar About y las cuatro rutas recientes.
4. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
5. Completar verificaciones externas de Forms, analytics, GBP y Privacy.

## Preguntas abiertas

- TODO(contexto): ¿Lisa quiere ampliar About con alguno de los hechos hoy
  excluidos? Cada claim requiere evidencia y autorización antes de render/schema.
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿qué fotografía autorizada debe ocupar la card Headshots de
  `content/homepage/index.json`?
- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿ya existen las notificaciones de los dos formularios en
  Netlify y se recibieron envíos reales?
