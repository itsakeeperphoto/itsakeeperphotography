# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 13:22 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional verificado:** `4cabb15` —
`feat(home): refresh client testimonials`

**Cierre documental:** presente en el worktree para el commit local siguiente;
no está staged ni commiteado en esta fotografía.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** antes del commit documental, `main` está cinco commits
por delante de `origin/main` (`b504f84`) y el worktree contiene únicamente los
cinco documentos de este cierre. Después del commit documental esperado
quedará seis commits por delante. No se hizo push, deploy, edición de Google
Drive, DNS ni otra mutación externa.

---

## Siguiente paso concreto

Crear el commit documental local que sigue a `4cabb15`, sin ejecutar
`./scripts/handoff.sh` porque ese script hace push. El usuario publica después
los seis commits locales: Contact funcional/documental, media
Branding/Headshots funcional/documental y Kind Words funcional/documental.

Tras el deploy, comprobar en `/` que se renderizan las diez reseñas en orden,
que tap abre/cierra el reverso en móvil y que `/api/google-review-summary`
reemplaza el fallback solo cuando devuelve juntos rating y conteo válidos.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Contact, Richland,
  Kennewick, Pasco, Family Photo Locations y Portfolio. Thank-you es
  `ready/noindex`; las otras 10 rutas siguen `draft/noindex`.
- Release contiene 10 URLs en sitemap y 9 entradas en `llms.txt`; Portfolio
  queda fuera de `llms.txt`. Staging mantiene sitemap vacío y noindex global.
- `#kind-words` muestra ahora diez reseñas destacadas del PDF aprobado, en orden
  1–10. Charity Neville permanece preservada como registro no destacado.
- Cinco fotografías tienen original visualmente idéntico en Drive. Para las
  otras cinco, los candidatos de Drive eran personas distintas; se conservó la
  única evidencia exacta del PDF/local sin inventar asociaciones.
- No se añadió `Review` ni `AggregateRating` al schema porque no existen todavía
  URL/fecha/procedencia estructurada por cada reseña.

## Kind Words cerrado en `4cabb15`

### Contenido y media

- Autores destacados: Gayla Worlund, Beth Granger, Isabella Neville, Kaija
  Colburn, Annette Christensen, Allissa Empert, Lisa Griffith, Julie Hrebeniuk,
  Christina Bergstrom y Hanna Lnenicka.
- El copy se conserva literalmente desde `Reviews.pdf`; no se normalizó
  gramática, puntuación ni estilo de las clientas.
- Se añadieron cinco documentos JSON y siete JPEG 800×1000, sRGB, entre 105920
  y 224417 bytes. El pipeline mantiene variantes WebP regenerables 400/640.
- Los tres assets exactos ya existentes —Gayla, Lisa y Julie— se reutilizan.
  Ninguna fotografía anterior se borró o sobrescribió.
- Coincidencias exactas verificadas en Drive: Beth (`010A3390 copy.jpg`),
  Isabella (`010A0106 copy.jpg`), Allissa (`010A5867 copy.jpg`), Christina
  (`010A0618copy1.jpg`) y Hanna (`010A9907 copy.jpg`).

### Contrato de render e interacción

- `HomepagePage.astro` y `src/lib/content.ts` admiten los primeros diez
  testimonios `featured`; Tina valida `order` 1–10 y su lock está sincronizado.
- `content/homepage/index.json` usa el fallback factual
  `100+ five-star Google reviews`. `KindWords.astro` solo lo reemplaza cuando
  GBP devuelve `averageRating` y `totalReviewCount` válidos en el mismo payload.
- Hover con puntero fino y foco de teclado continúan revelando temporalmente el
  reverso. En puntero coarse, tap alterna front/back; un segundo tap lo cierra.
  Escape cierra y devuelve foco a la rail. Las citas largas conservan scroll
  interno y señal `Scroll to finish`.
- Los clones del loop continúan fuera del orden de tabulación y el modo reduced
  motion desactiva el autopan y las transiciones.

## Verificación ejecutada

- Orden de datos: 10 destacados, órdenes exactos 1–10, sin imágenes ausentes ni
  campos fuera de límites Tina.
- Fuentes: siete JPEG nuevos son 800×1000, sRGB y ≤700 KiB; el optimizador
  confirmó variantes responsive al día.
- `npx astro build`: completo, incluidas las 21 rutas.
- `npm run install:netlify-headers`: headers staging instalados.
- `npm run validate:site`: `Validated 21 public routes in staging mode.`
- `npm run build:local` alcanzó Tina pero no pudo iniciar un segundo data layer
  porque el servidor largo del usuario ya ocupa `:9000`; no se detuvo ese
  proceso. Astro y el validador se ejecutaron por separado y pasaron.
- Playwright: 1920/1440/1200/900/390 con `documentWidth === viewport`, diez
  tarjetas originales, imágenes visibles cargadas y cero errores/warnings de
  consola.
- Emulación iPhone/coarse a 390 px: `front → back → front`, reverso accesible,
  quote visible, reduced motion activo y overflow 0.
- Teclado desktop: Tab abre la primera reseña y Escape la cierra devolviendo
  foco a `.kind-words__rail`.
- Capturas inspeccionadas: composición/crops aprobados a 1920 y 390; el grupo
  de 31 de Annette usa mat marfil para preservar a todas las personas.
- `git diff --check` y parseo de los JSON: sin errores.

## Archivos del lote funcional

- `content/homepage/index.json`
- `content/testimonials/*.json` (once registros; diez destacados)
- `public/scripts/site.js`
- siete JPEG `public/uploads/review-*`
- `src/components/HomepagePage.astro`
- `src/components/KindWords.astro`
- `src/lib/content.ts`
- `tina/config.ts`
- `tina/tina-lock.json`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Kind Words | Completo en `4cabb15` | Push del usuario y QA del resumen GBP en producción. |
| Reviews | `draft/noindex` | Definir alcance de la página, URL oficial y fuente estructurada antes de publicar/schema. |
| Branding | Media renovada en `127c539`; `draft/noindex` | Confirmar entregables, cantidad de imágenes y duración. |
| Headshots | Media renovada en `127c539`; `draft/noindex` | Confirmar duración y entregables. |
| Contact | `ready/index` en dos commits locales previos | Push del usuario, deploy y prueba real controlada del gate. |
| Privacy | `draft/noindex` | Revisión factual/legal y decisión de consentimiento. |
| Seniors / Senior timing | Draft | Paquetes, oferta Q54, fechas editoriales y QA. |
| Investment | Draft | Entregables, duración/cantidades y QA. |
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

1. El usuario debe publicar los seis commits locales después de este cierre.
2. Netlify debe completar el deploy antes del QA del dominio final.
3. El resumen vivo GBP requiere que credenciales, cache y endpoint funcionen en
   el deploy; el fallback permanece correcto si alguno falla.
4. Lisa debe confirmar entregables, cantidades y duración antes de publicar
   Branding o Headshots.
5. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
6. Privacy requiere revisión legal autorizada antes de su propia publicación.

## Preguntas abiertas

- TODO(contexto): ¿cuál es el link público definitivo de Google Reviews?
- TODO(contexto): ¿cuáles son los entregables, cantidad de imágenes y duración
  exactos de Branding?
- TODO(contexto): ¿cuáles son la duración y entregables exactos de Headshots?
- TODO(contexto): ¿quién aprobará la revisión legal de Privacy?
- TODO(contexto): ¿Lisa tiene formación de seguridad newborn confirmable para
  Q41? No publicar el claim antes de respuesta explícita.
- TODO(contexto): ¿quién verificará Clarity, Google Analytics, GBP y Search
  Console después del deploy?
