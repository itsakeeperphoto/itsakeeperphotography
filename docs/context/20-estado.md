# 20 — Estado actual

> Foto operativa al cierre de la sesión. Si contradice otro documento, este
> manda.

**Última actualización:** 2026-08-10 09:50 -05

**Actualizado por:** Codex / GPT-5

**Rama:** `main`

**Commit funcional verificado:** `974d97c` —
`fix(layout): align city galleries and final sections`

**Commit documental:** este archivo pertenece al commit local inmediatamente
posterior a `974d97c`; consultar `git log -1` después de crearlo para obtener su
hash sin inventarlo aquí.

**Remoto oficial:** `origin` →
`https://github.com/itsakeeperphoto/itsakeeperphotography.git`

**Estado Git al preparar este cierre:** `main` está once commits por delante de
`origin/main` (`ff736c6`) en `974d97c` y solo contiene las ediciones documentales
de este cierre. Al quedar estas dentro de su commit, la rama queda limpia y doce
commits por delante. No se hizo push, deploy, DNS ni otra mutación externa; el
usuario conserva la publicación.

---

## Siguiente paso concreto

El usuario debe publicar los doce commits locales posteriores a `ff736c6`.
Cuando Netlify termine, comprobar Newborn, Richland, Kennewick y Pasco en el
dominio final: status 200, canonical, meta robots index, ausencia de
`X-Robots-Tag: noindex`, sitemap/`llms.txt`, `lastmod` exacto y los tres ajustes
visuales de este cierre. No cambiar apex/`www`, DNS ni redirects antes de resolver
la divergencia de host documentada.

## Resumen ejecutivo

- El sitio Astro/Tina/Netlify construye y valida 21 rutas públicas.
- Están `ready/index`: Homepage, Family, Newborn, Richland, Kennewick, Pasco,
  Family Photo Locations y Portfolio. Thank-you es `ready/noindex`; las otras
  12 rutas siguen `draft/noindex`.
- El commit `974d97c` corrige únicamente geometría/CSS: no cambia copy,
  fotografías, schema, sitemap, manifiesto ni estados de indexación.
- Newborn mantiene su hero y `What Your Newborn Session Looks Like` protegidos;
  su copy final ahora cabe dentro de la pista desktop sin clipping.
- Richland conserva diez fotografías de diez sesiones verificadas y las ordena
  en contact sheet editorial 3/2/1 determinista.
- Kennewick conserva su contenido y media; solo baja el encuadre del cierre en
  desktop para no cortar la cabeza del hombre.
- Release conserva ocho URLs en sitemap y siete entradas en `llms.txt`;
  Portfolio queda fuera de `llms.txt` y staging permanece globalmente noindex.

## Correcciones funcionales verificadas

### Newborn final

- Ruta: `/newborn-photographer-tri-cities-wa/`.
- `.newborn-final__copy` eliminó el ancho fijo y usa `min-width: 0`, por lo que
  se contrae dentro de la primera pista del grid y ya no invade la fotografía.
- El H2 amplía su medida, reduce de forma fluida su escala desktop y restaura
  `overflow-wrap: normal`; `EXPECTING?` permanece completo incluso en 768 px.
- Copy, CTA, imagen, alturas, hero y proceso protegido no cambiaron.
- La ruta sigue `ready/index`, `lastModified: 2026-08-10`, con siete H2, cuatro
  anchors y FAQ visible/schema 8:8.

### Recent Richland Sessions

- Ruta: `/richland-wa-photographer/`.
- Las diez fuentes, captions, alts, orden y ausencia de anchors permanecen
  intactos; no se borró ni reemplazó ninguna fotografía.
- Desktop usa tres columnas lógicas y dos bandas completas de cinco imágenes;
  tablet usa dos columnas y móvil una.
- ADR-042 supersede ADR-040 solo en el antiguo punto visual 4/2/1. Los contratos
  de evidencia local, conteo 10/10, privacidad y publicación siguen vigentes.
- La ruta continúa `ready/index`, `lastModified: 2026-08-09`.

### Kennewick final

- Ruta: `/kennewick-wa-photographer/`.
- `.kennewick-final__background-image` usa `object-position: 50% 20%` únicamente
  desde 1051 px; a 1050 px o menos conserva el crop previo.
- No cambian la fotografía, el overlay, copy, CTA, galería ni contratos SEO.
- La ruta continúa `ready/index`, `lastModified: 2026-08-09`.

## Verificación ejecutada

- Artefacto release: `node scripts/validate-site.mjs` aprobó 21/21 rutas.
- Detector final Impeccable sobre los tres CSS modificados: `[]`.
- Playwright verificó 1728, 1440, 1200, 900 y 390 px, más el borde crítico de
  768 px para el H2 Newborn.
- Resultado visual: cero overflow horizontal, cero solapamientos y cero imágenes
  rotas dentro de Newborn final, Recent Richland Sessions y Kennewick final.
- Responsive: Richland mantiene 3/2/1; Kennewick aplica el nuevo crop solo por
  encima de 1050 px; Newborn conserva su composición tablet y el apilado móvil.
- Red: el único request fallido observado fue la telemetría externa de Microsoft
  Clarity en local. No falló ningún recurso same-origin ni imagen de sección.
- `git diff --check` y las comprobaciones Markdown/conflictos se ejecutan tras
  esta reescritura y deben reportarse en el handoff, no anticiparse como hechos.

## Archivos funcionales del lote

- `src/styles/newborn-page.css`
- `src/styles/richland-page.css`
- `src/styles/kennewick-page.css`

Documentación reconciliada en el cierre:

- `.impeccable/surfaces/route-newborn-photographer-tri-cities-wa.md`
- `.impeccable/surfaces/route-richland-wa-photographer.md`
- `docs/context/10-arquitectura.md`
- `docs/context/20-estado.md`
- `docs/context/30-decisiones.md`
- `docs/context/40-bitacora.md`
- `docs/context/50-backlog.md`

## Trabajo parcial y pendientes reales

| Ruta/módulo | Estado local | Qué falta |
|---|---|---|
| Lote de geometría | Verificado en `974d97c` | Nada funcional pendiente. |
| Documentación | Preparada en el commit local posterior | Nada pendiente tras crear ese commit. |
| Producción | Doce commits locales sobre `ff736c6` al cerrar | Push del usuario y QA del deploy. |
| Newborn | `ready/index` | Verificar producción; Q41 sigue opcional/no bloqueante y sin claim. |
| Richland/Kennewick/Pasco | `ready/index` | Verificar producción y crawler outputs tras push. |
| Bandwidth/build | Optimizado localmente | Observar logs y bandwidth Netlify durante 48 h tras deploy. |
| Seniors / Senior timing | Draft | Hechos de paquetes, oferta Q54, fechas y QA. |
| Branding/Headshots/Investment | Draft | Entregables, duración/cantidades y QA. |
| About/Reviews/Privacy | Draft | Permisos, reseñas autorizadas y revisión legal. |
| Netlify Forms | Código listo | Confirmar notificaciones y envíos reales. |
| Dominio | Contradicción documentada | Elegir apex o `www` antes de tocar DNS. |

## Comandos de reanudación

```bash
git remote get-url origin
git log --oneline -20
git status
npm run validate:site
```

Para una reconstrucción Tina local, no detener el servidor largo del usuario en
`:9000`; usar un puerto de data layer alterno como `9001`. No ejecutar
`./scripts/handoff.sh` mientras el usuario conserve la política de hacer push
personalmente, porque ese script publica el repositorio.

## Bloqueadores externos

1. El usuario debe publicar los doce commits locales en el remoto oficial.
2. Esperar el deploy Netlify y comprobar crawler gates, lastmod y geometría de
   las cuatro rutas afectadas/relacionadas.
3. Resolver la divergencia apex/`www` antes de tocar canonical, DNS o redirects.
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
