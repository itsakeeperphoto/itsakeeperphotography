# CONTACT — `/contact/`

_Página 10 de 18 · Trust & conversion · **v4 definitiva — publicada localmente
el 2026-08-11**_

> Contact ofrece un estimado transparente desde el primer render. La persona
> configura la sesión, ve cómo cambian el recibo y el total, y envía el mismo
> formulario HTML a Lisa cuando está lista. El resultado sigue siendo un
> estimado: no reserva fecha, procesa pagos ni sustituye la conversación.

---

## Estado editorial y SEO técnico

| Campo | Valor |
|---|---|
| **URL** | `/contact/` |
| **Estado** | `ready/index` |
| **Last modified** | `2026-08-11` |
| **Title** | `Session Pricing Estimate \| It's A Keeper Photography` |
| **Meta description** | `Build a personalized photography session pricing estimate, then send your plans to Lisa. She reads every inquiry and follows up personally.` |
| **Schema** | `ContactPage` + `BreadcrumbList` |
| **Sitemap release** | Incluida; 10 URLs totales |
| **llms.txt release** | Incluida; 9 entradas totales |

La página no publica una dirección de calle, coordenadas, reseñas, ratings ni
un `Service` de nivel superior. El breadcrumb es Home → Session Pricing
Estimate. Staging permanece globalmente noindex, con sitemap vacío y
`llms.txt` de preview.

## Estructura de headings publicada

```text
H1  Let's Plan Your Session
 H2  Build Your Session Estimate
  H3  Optional finishing touches
  H3  Your Estimate
 H2  What Happens Next
  H3  I'll write back personally.
  H3  We'll set up a phone call.
  H3  Your date gets reserved.
 H2  Prefer to Talk?
```

`Where I Work` funciona como eyebrow dentro del bloque de contacto y no añade
otro heading estructural.

---

## Copy definitivo

### Hero

**H1:** Let's Plan Your Session

**Script:** your season, your way

**Intro:** Build a personalized session pricing estimate around what you have
in mind, then send it to me when you're ready. I read every inquiry and follow
up personally — you'll hear from me, not an assistant.

**CTA:** Build My Estimate

### Estimador

**Eyebrow:** A clear place to begin

**H2:** Build Your Session Estimate

Choose what fits the session you have in mind. Your estimate updates as you go,
then Lisa follows up personally to confirm the details.

El planner conserva cuatro fases visibles:

1. **Your session — Who's in front of the camera?** Senior, Family, Newborn,
   Branding o Headshots.
2. **Coverage — Choose the time we'll have together.** Paquete, duración,
   ubicaciones, outfits y número de personas.
3. **Keepsakes — Choose how you'd like to keep it.** Colección y add-ons
   opcionales.
4. **Review & send — Tell Lisa where to reach you.** Datos de contacto y notas
   antes del envío nativo.

Los nombres, límites y precios se leen de `src/lib/session-pricing.ts`; este
documento no crea una segunda fuente comercial.

### Recibo y total transparentes

El HTML renderizado en servidor contiene el recibo completo y ambos totales
visibles desde el inicio:

- **Eyebrow:** Live session receipt
- **H3:** Your Estimate
- **Total SSR inicial:** `$160`
- **Barra móvil:** Estimated total `$160` · Review estimate

El recibo muestra Session, Coverage, People, Keepsakes y Add-ons. JavaScript
actualiza esas líneas, la fotografía, los campos ocultos y los totales desktop
y móvil cuando cambia una selección. Una región `aria-live="polite"` anuncia el
nuevo total. Nada del recibo depende del submit para mostrarse y no existen los
estados locked, submitting, unlocked, reveal, error ni retry del gate anterior.

El escenario de regresión completo parte de `$160` y llega a `$955.98` con
Family, paquete #THREE, siete personas, Collection #1, una extra retouched image
y rush 48-hour delivery.

### Datos solicitados

- **Requeridos:** Your name, Email, Phone, What are you hoping to keep?
- **Opcional:** Preferred timing.
- **Honeypot:** `bot-field`, fuera del flujo de teclado.
- **Campos técnicos:** `form-name`, `pricing_version`, selecciones crudas,
  desglose calculado, estado de cálculo y total estimado.

**Intro de la fase 04:**

> This sends your complete estimate and notes to Lisa. It does not reserve a
> date or charge a payment.

**Microcopy de envío:**

> Estimate only. Lisa will confirm the final details, send the contract and
> payment link, and reserve the date after the contract and retainer are
> complete.

**CTA exacta:** Send My Estimate to Lisa

### Envío nativo

El único formulario usa `method="post"` y `action="/thank-you/"`. Con JavaScript
activo o inactivo, el navegador ejecuta un POST URL-encoded como navegación de
documento y llega a la confirmación noindex. El script del calculador no llama
`fetch`, no intercepta submit con `preventDefault` y no implementa respuestas
AJAX, gate, reveal, timeout, reintento ni analítica personalizada del gate.

Los campos calculados acompañan las selecciones cuando JavaScript está activo.
Sin JavaScript, las selecciones crudas y el fallback técnico indican a Lisa que
debe recalcular el estimado; el recibo SSR permanece visible en `$160`, pero no
se actualiza en vivo.

---

## What Happens Next

1. **I'll write back personally.** Usually with a couple of questions, because
   I want to understand what you're hoping for before I start suggesting
   things.
2. **We'll set up a phone call.** This is my favorite part. We'll talk through
   dates, locations, wardrobe and timing — and most people get off that call a
   lot more excited and a lot less nervous than they got on it.
3. **Your date gets reserved.** Once we've found a date that works, I'll send a
   contract and a retainer invoice. Your date is officially yours once both are
   complete. The remaining balance is due the day of your session.

Nothing is held before that step, so if you have a particular season in mind,
it's worth reaching out sooner than you think.

## Prefer to Talk?

Sometimes it's just easier to say it out loud. Call or text me at
**(509) 948-7322** and tell me what you're thinking.

Honestly? Email is the easiest way to reach me, and a phone call is the best way
to plan. But use whichever one gets you to actually reach out — that's the part
that matters.

## Where I Work

**It's A Keeper Photography**<br>
**(509) 948-7322**

I photograph throughout the Tri-Cities — Richland, Kennewick, Pasco and the
countryside around them. Travel up to 25 miles is included; beyond 25 miles,
the fee is $2 per additional mile. Sessions
happen outdoors at golden hour, at a location we choose together, except
newborn sessions, which happen in your home.

---

## Contrato del formulario

- La ruta contiene exactamente un `<form name="session-estimate">`.
- Método `POST`, `data-netlify="true"`, `netlify-honeypot="bot-field"`, campo
  oculto `form-name=session-estimate` y acción `/thank-you/`.
- Nombre, email, teléfono e historia son obligatorios; timing es opcional.
- El recibo y los totales desktop/móvil están presentes y visibles en el HTML
  SSR con `$160` antes de ejecutar JavaScript.
- El calculador mejora selección, desplazamiento, validación y total vivo, pero
  no toma control del submit.
- El envío válido es una navegación de documento nativa, no un request AJAX.
- No existen marcadores ni eventos personalizados `contact_gate_*`,
  `estimate_revealed`, `submission_id`, reveal, locked o retry.
- La configuración y las notificaciones de Netlify Forms en producción fueron
  confirmadas por el usuario el 2026-08-11. El QA automatizado interceptó todos
  los POST y no envió datos reales.

## Privacidad

El formulario envía a Lisa datos de contacto, selecciones y notas mediante
Netlify Forms para continuar la conversación. `/privacy/` continúa
`draft/noindex` hasta que una persona autorizada revise Netlify Forms, Microsoft
Clarity y Google Analytics y defina cualquier requisito de consentimiento. El
calculador transparente no añade analítica personalizada del gate ni guarda PII
en browser storage.

## QA de publicación

- Tina release integral: servidor en `4002` y data layer en `9001`.
- Validadores staging y release: 21/21 rutas.
- Release: Contact indexable, canonical `www`, sin header noindex, dentro de
  sitemap (10 URLs) y `llms.txt` (9 entradas).
- Playwright: 1440, 1200, 900 y 390 px; `$160` SSR → `$955.98` en vivo.
- En los cuatro anchos se verificaron campos requeridos, timing opcional, total
  visible, ausencia completa del gate y POST nativo URL-encoded como navegación
  de documento a `/thank-you/`.
- Sin JavaScript a 390 px: recibo SSR `$160`, validación nativa y POST de
  documento con selecciones crudas.
- Cero envíos reales durante QA; Forms y notificaciones productivas se preservan
  como confirmación externa del usuario.
- Revisión final independiente: `PASS`.

## Notas editoriales

- No volver a ocultar el precio detrás de una solicitud sin una nueva decisión
  explícita.
- No prometer calendario de reservas online.
- No presentar el estimado como precio contractual, booking ni pago.
- No publicar una dirección de calle o pin de mapa desde datos legados.
- No añadir un `Service`, `Review` o rating al schema sin evidencia y una
  decisión explícita.
