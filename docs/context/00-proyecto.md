# 00 — Proyecto

> Documento estable. Contiene únicamente alcance y hechos verificados en el
> repositorio al 2026-08-08.

## Nombre

It's A Keeper Photography — sitio editorial y plataforma de captación.

## Una frase

Sitio web de Lisa Weiss, fotógrafa de Richland, Washington, que presenta sus
servicios de retrato en Tri-Cities y convierte visitas en solicitudes mediante
formularios de Netlify y un estimador de sesión.

## Dueño / cliente

- Negocio y voz de marca: Lisa Weiss / It's A Keeper Photography.
- Colaborador del repositorio: William Melo.
- Lisa decide precios, hechos biográficos, políticas, atribución de reseñas,
  disponibilidad y detalles operativos.

## Objetivo de la fase actual

Mantener y completar una experiencia editorial, cálida y publicable en Netlify:

- 20 rutas públicas construibles en Astro.
- Contenido exacto de los documentos fuente, sin inventar hechos.
- Diseño oscuro, terroso y dorado, inspirado en fotografía impresa y anclado en
  la homepage aprobada de staging.
- Captación mediante Netlify Forms y estimados de sesión transparentes.
- SEO local para Richland, Kennewick, Pasco y servicios en Tri-Cities, con
  indexación habilitada solamente cuando el contenido de cada ruta esté listo.
- Evidencia visual y validación técnica antes de declarar una ruta terminada.

## Fuera de alcance actual

- Cambiar DNS, dominio primario o hacer el cutover del dominio personalizado sin
  autorización explícita.
- Usar el sitio legado de `www.itsakeeperphotography.com` como autoridad visual o
  de copy; solo sirve para inventariar URLs antes del lanzamiento.
- Inventar testimonios, premios, certificaciones, ubicaciones, fechas, políticas,
  entregables o fotografías sustitutas.
- Publicar servicios de mascotas o elopements en el estimador actual. Newborn sí
  está incluido; Pet y Elopement no están en `src/lib/session-pricing.ts`.
- Procesar pagos, contratos o reservas automáticamente. El estimador produce una
  referencia; Lisa continúa la conversación, contrato, pago y booking.
- Publicar la dirección residencial/legada ni un pin de mapa.
- Convertir el sitio en una plantilla clara, fría o genérica; el sitio evita
  colores neutros puros, tarjetas redondeadas y componentes con sombras.

## Usuarios y casos de uso principales

1. Seniors y sus familias comparan la experiencia, planifican una sesión y
   envían una solicitud.
2. Familias y padres de recién nacidos entienden el enfoque pausado, revisan
   preguntas frecuentes y consultan disponibilidad.
3. Dueños de negocios comparan branding y headshots y solicitan una sesión.
4. Personas en Richland, Kennewick y Pasco descubren servicios y guías locales.
5. Lisa recibe inquiries y session estimates en Netlify y continúa el proceso
   fuera del sitio.
6. Editores autenticados gestionan contenido por TinaCMS sin modificar el
   sistema visual bloqueado en los componentes.

## Restricciones duras

- La homepage desplegada en `itsakeeperphotography.netlify.app` es la autoridad
  visual y de comportamiento; `DESIGN.md` es el reglamento subyacente.
- El copy suministrado se conserva; placeholders se registran y no se sustituyen.
- Máximo cuatro enlaces internos dentro de `<main>` por ruta como regla general.
  Header y footer no cuentan; la CTA final a Contact consume uno de los cuatro.
  Una excepción solo existe si el usuario aprueba un directorio navegable y un
  ADR limita sus rutas y alcance; Richland tiene esa excepción en ADR-033 y
  Kennewick en ADR-035. Pasco usa ocho anchors exactos según ADR-039: dos de
  contexto, cinco de servicio y Contact final.
- Staging completo debe emitir `noindex,nofollow,noarchive`.
- En release, solo las rutas `ready` pueden indexarse; `/thank-you/` nunca.
- Paleta oficial: Deep Umber `#281E10`, Walnut `#493621`, Warm Earth `#604A31`,
  Clay `#8D5933`, Muted Olive `#71674E`, Weathered Sand `#B6A997`, Warm Ivory
  `#F2E8D7`.
- Rectángulos cuadrados; la curva fuerte es el arco semicircular; hairlines de
  1px; sin gradientes decorativos, glassmorphism ni sombras de componentes.
- Motion editorial, lento y con `prefers-reduced-motion` respetado.
- Netlify es el hosting y Netlify Forms es el transporte de formularios.
- Nunca almacenar secretos en git ni en `docs/context/`.

## Rutas públicas verificadas

### Homepage

- `/`

### Servicios

- `/family-photographer-tri-cities-wa/`
- `/senior-photographer-tri-cities-wa/`
- `/newborn-photographer-tri-cities-wa/`
- `/branding-photographer-tri-cities-wa/`
- `/headshot-photographer-tri-cities-wa/`

### Confianza y conversión

- `/investment/`
- `/about/`
- `/reviews/`
- `/contact/`

### Áreas de servicio

- `/richland-wa-photographer/`
- `/kennewick-wa-photographer/`
- `/pasco-wa-photographer/`

### Journal

- `/journal/`
- `/journal/family-photo-locations-tri-cities/`
- `/journal/when-to-book-senior-pictures-tri-cities/`
- `/journal/in-home-vs-studio-newborn-photography/`
- `/journal/branding-photos-vs-headshots/`

### Utilidad

- `/privacy/`
- `/thank-you/`

## Enlaces y fuentes

- Repositorio oficial: `https://github.com/itsakeeperphoto/itsakeeperphotography.git`
- Staging/fundación aprobada: `https://itsakeeperphotography.netlify.app/`
- Dominio final previsto: `https://www.itsakeeperphotography.com/`
- Sistema de diseño: `DESIGN.md`
- Estructura de publicación: `STRUCTURE.md`
- Copy fuente: `paginas/*.md` y documentos externos registrados en backlog.
- Manifiesto de rutas: `src/lib/page-manifest.ts`
- Registro verificable de contenido pendiente: `src/content/pending.ts`

TODO(contexto): confirmar dónde vive el tablero de tareas, si existe.
