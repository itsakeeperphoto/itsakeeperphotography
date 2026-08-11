# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-11 14:14 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**HEAD funcional verificado:** `df6db0f` —
`fix(contact): restore transparent native estimate`

**Cierre documental:** presente en el worktree para el commit local esperado
`docs(contact): record transparent estimate reversal`; no está staged ni
commiteado en esta fotografía.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al cerrar:** antes del commit documental, `main` está siete commits
por delante de `origin/main` (`b504f84`) y el worktree contiene únicamente los
siete documentos de este cierre. Después del commit documental esperado
quedará ocho commits por delante. No se hizo stage, commit, push, deploy,
edición de Google Drive, DNS, envío real de formulario ni otra mutación externa.

---

## Siguiente paso concreto

Crear el commit documental local `docs(contact): record transparent estimate
reversal`, sin ejecutar `./scripts/handoff.sh` porque ese script hace push. El
usuario publica después los ocho commits locales: el historial gated de Contact
y su reversión transparente, media Branding/Headshots, Kind Words y los cierres
documentales correspondientes.

Tras el deploy, verificar en `/contact/` que `$160` es visible antes de completar
datos, que el total cambia en vivo y que un envío controlado usa navegación
HTML nativa a `/thank-you/`. Registrar solo recepción y resultado, nunca PII en
git. En el mismo deploy, revisar Homepage/Kind Words y confirmar que Branding y
Headshots permanecen noindex.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, About, Contact, Richland,
  Kennewick, Pasco, Family Photo Locations y Portfolio. Thank-you es
  `ready/noindex`; las otras 10 rutas siguen `draft/noindex`.
- Release contiene 10 URLs en sitemap y 9 entradas en `llms.txt`; Portfolio
  queda fuera de `llms.txt`. Staging mantiene sitemap vacío y noindex global.
- Contact conserva su publicación y schema, pero ADR-053 supersede ADR-050 solo
  en gate, AJAX y campos opcionales. El estimate actual es transparente y el
  submit pertenece al navegador.
- `#kind-words` conserva diez reseñas destacadas del PDF aprobado, en orden
  1–10. Charity Neville permanece preservada como registro no destacado.
- Branding y Headshots conservan su lote seguro de 18 JPEG y 72 WebP
  regenerables; ambas rutas siguen `draft/noindex` por hechos comerciales
  pendientes.

## Contact definitivo en `df6db0f`

### Estimado transparente

- Recibo, desglose y totales desktop/móvil están presentes y visibles desde SSR
  con el paquete #ONE y `$160`.
- El calculador actualiza en vivo Session, Coverage, People, Keepsakes, Add-ons,
  fotografía, campos ocultos, región polite y total antes del envío.
- El escenario QA Family + #THREE + siete personas + Collection #1 + extra
  retouched image + rush 48h produce `$955.98`.
- Nombre, email, teléfono e historia son requeridos; preferred timing es
  opcional.
- Contact mantiene exactamente un form `session-estimate`, Netlify detection,
  honeypot, selecciones crudas y campos calculados.

### Transporte y estados retirados

- El form usa `POST` y `action="/thank-you/"`; un submit válido es URL-encoded y
  navega como documento tanto con JavaScript como sin él.
- El script no usa `fetch`, `FormData`, `URLSearchParams`, `preventDefault` ni
  `AbortController` para enviar.
- No existen recibo locked, reveal condicionado a 2xx, submitting/unlocked,
  error AJAX, timeout, retry, freeze posterior al éxito o persistencia de
  unlock.
- No existen `submission_id`, eventos `contact_gate_*`, `estimate_revealed` ni
  otra analítica personalizada del gate. Los snippets globales Clarity/GA4 no
  cambiaron.
- Netlify Forms y sus notificaciones productivas permanecen confirmados por el
  usuario el 2026-08-11. El QA interceptó todos los POST y no realizó envíos
  reales.

### Publicación preservada

- `/contact/` continúa `ready/index`, `lastModified: 2026-08-11`, con canonical
  release `www`, sin header noindex y dentro de sitemap 10/`llms.txt` 9.
- Schema sigue limitado a `ContactPage` y `BreadcrumbList` Home → Session
  Pricing Estimate; no emite `Service`, calle, coordenadas, `Review` ni
  `AggregateRating`.
- `/privacy/` continúa `draft/noindex`; la reversión del gate no sustituye su
  revisión legal.

## Kind Words preservado

- Implementación funcional: `4cabb15` — `feat(home): refresh client
  testimonials`; cierre previo: `f917e09`.
- Autores destacados: Gayla Worlund, Beth Granger, Isabella Neville, Kaija
  Colburn, Annette Christensen, Allissa Empert, Lisa Griffith, Julie Hrebeniuk,
  Christina Bergstrom y Hanna Lnenicka.
- El copy se conserva literalmente desde `Reviews.pdf`; cinco fotografías
  tienen original visualmente idéntico en Drive y las otras cinco preservan la
  única evidencia exacta local/PDF sin inventar asociaciones.
- La rail conserva 10 órdenes únicos, tap coarse front→back→front, hover,
  teclado/Escape, scroll interno y reduced motion. GBP reemplaza el fallback
  `100+ five-star Google reviews` solo con rating y conteo válidos juntos.
- No se añadió `Review` ni `AggregateRating` al schema porque todavía faltan
  URL, fecha y procedencia estructurada por reseña.

## Branding y Headshots preservados

- Implementación funcional: `127c539` — `feat(media): refresh branding and
  headshot photography`; cierre previo: `a05d826`.
- El lote contiene 18 JPEG Drive ≤2400 px/700 KiB y 72 WebP regenerables
  400/640/960/1440.
- Branding renderiza 13 superficies/11 fuentes únicas; Headshots 14/11. Ninguna
  fuente aparece más de dos veces; hero/cierre y composiciones críticas son
  distintos.
- Filenames, alt y XMP mantienen ciudad solo cuando Drive la verifica y excluyen
  GPS, dirección, sublocation, fecha, serial, nombre RAW, EXIF/IPTC/ICC e IDs
  `xmpMM`.
- Ambas rutas siguen `draft/noindex` y fuera de sitemap/`llms.txt` hasta que Lisa
  confirme entregables, cantidades y duración. La reversión Contact no tocó su
  contenido, media ni gates editoriales.

## Verificación ejecutada para ADR-053

- Tina release integral con servidor en puerto `4002` y data layer en `9001`.
- Validadores staging y release: `Validated 21 public routes` en ambos modos.
- Playwright Contact: 1440×1000, 1200×900, 900×900 y 390×844.
- En los cuatro viewports: `$160` visible en SSR, `$955.98` después de las
  selecciones QA, campos requeridos correctos, timing opcional, ausencia de
  markup/script del gate, overflow 0 y POST nativo URL-encoded como navegación
  de documento a `/thank-you/`.
- Sin JavaScript a 390×844: recibo SSR `$160`, validación HTML y POST de
  documento con selecciones crudas/fallback de recálculo.
- Revisión final independiente: `PASS`.
- Ninguna prueba envió datos reales; no se ejecutó build, servidor ni Playwright
  durante el cierre documental porque la evidencia pertenece al commit
  funcional verificado.
- `git diff --check`, parseo Markdown, fences y marcadores de conflicto se
  ejecutan antes de entregar este worktree.

## Archivos del cierre documental

- `paginas/10-contact.md` — v4 definitiva transparente/nativa.
- `DESIGN.md` — addendum 15; addendum 13 preservado como historial.
- `docs/context/10-arquitectura.md` — contrato corriente del estimador/forms/QA.
- `docs/context/20-estado.md` — esta fotografía operativa.
- `docs/context/30-decisiones.md` — ADR-053 y marca parcial sobre ADR-050.
- `docs/context/40-bitacora.md` — entrada append-only de la reversión.
- `docs/context/50-backlog.md` — separación current/historical y próximos pasos.

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Contact | Completo en `df6db0f`; docs en worktree | Commit documental, push del usuario y prueba nativa controlada tras deploy. |
| Kind Words | Completo en `4cabb15`/`f917e09` | Push del usuario y QA del resumen GBP en producción. |
| Reviews | `draft/noindex` | Definir alcance, URL oficial y fuente estructurada antes de publicar/schema. |
| Branding | Media renovada en `127c539`/`a05d826`; `draft/noindex` | Confirmar entregables, cantidad de imágenes y duración. |
| Headshots | Media renovada en `127c539`/`a05d826`; `draft/noindex` | Confirmar duración y entregables. |
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

1. Crear el commit documental esperado y dejar ocho commits locales listos.
2. El usuario debe publicar esos ocho commits; Codex no hace push.
3. Netlify debe completar el deploy antes de probar el POST nativo en el dominio
   final.
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
