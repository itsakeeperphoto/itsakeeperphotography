# CONTACT — `/contact/`

_Página 10 de 18 · Trust & conversion · **v3 definitiva — publicada localmente
el 2026-08-11**_

> Contact combina un estimador transparente con una única solicitud de datos:
> la persona elige su sesión primero y el total personalizado se revela solo
> cuando Netlify confirma el envío. El resultado sigue siendo un estimado; no
> reserva fecha, procesa pagos ni sustituye la conversación con Lisa.

---

## Estado editorial y SEO técnico

| Campo | Valor |
|---|---|
| **URL** | `/contact/` |
| **Estado** | `ready/index` |
| **Last modified** | `2026-08-11` |
| **Title** | `Session Pricing Estimate \| It's A Keeper Photography` |
| **Meta description** | `Plan a Tri-Cities photography session, send your details and reveal a personalized pricing estimate. Lisa reads every inquiry and replies personally.` |
| **Schema** | `ContactPage` + `BreadcrumbList` |
| **Sitemap release** | Incluida; 10 URLs totales |
| **llms.txt release** | Incluida; 9 entradas totales |

La página no publica una dirección de calle, coordenadas, reseñas, ratings ni
un `Service` de nivel superior. El breadcrumb visible para buscadores es Home →
Session Pricing Estimate. Staging permanece globalmente noindex, con sitemap
vacío y `llms.txt` de preview.

## Estructura de headings publicada

```text
H1  Let's Plan Your Session
 H2  Build Your Session Estimate
  H3  Optional finishing touches
  H3  Your Estimate Is Ready / Your Estimate
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

**Intro:** Choose the session, coverage and keepsakes you have in mind, then
send your name and email to reveal the complete estimate. I read every inquiry
and follow up personally — you'll hear from me, not an assistant.

**CTA:** Build My Estimate

### Estimador

**Eyebrow:** A clear place to begin

**H2:** Build Your Session Estimate

Choose what fits the session you have in mind, then send your name and email to
reveal the complete estimate. Lisa receives the same plan and follows up
personally to confirm the details.

El planner conserva cuatro fases visibles:

1. **Your session — Who's in front of the camera?** Senior, Family, Newborn,
   Branding o Headshots.
2. **Coverage — Choose the time we'll have together.** Paquete, duración,
   ubicaciones, outfits y número de personas.
3. **Keepsakes — Choose how you'd like to keep it.** Colección y add-ons
   opcionales.
4. **Send & reveal — Tell Lisa where to reach you.** Datos de contacto y nota
   opcional antes de revelar el recibo.

Los nombres, límites y precios se leen de `src/lib/session-pricing.ts`; este
documento no crea una segunda fuente comercial.

### Datos solicitados

- **Requeridos:** Your name, Email.
- **Opcionales:** Phone, Preferred timing, What are you hoping to keep?
- **Honeypot:** `bot-field`, fuera del flujo de teclado.
- **Campos técnicos:** `form-name`, `pricing_version`, selecciones crudas,
  desglose calculado y total estimado.

**Microcopy de envío:**

> Your result is a planning estimate, not a booking or payment. Lisa will reply
> about your session and confirm every detail before sending a contract.
> Submitting sends your contact details and session choices to Lisa through
> Netlify Forms so she can reply about this session.

**CTA exacta:** Send My Details & Reveal My Estimate

### Recibo bloqueado

**Eyebrow:** One final step

**H3:** Your Estimate Is Ready

Your choices are being prepared behind this receipt. Send your name and email
to reveal the complete itemized estimate.

**CTA auxiliar:** Finish & reveal

En móvil, la barra fija muestra `Personalized estimate`, `Ready to reveal` y el
mismo CTA. El total y el desglose permanecen semánticamente ocultos con
`hidden`, no solo desenfocados o cubiertos visualmente.

### Confirmación

Solo una respuesta HTTP exitosa de Netlify desbloquea el recibo, cambia su
título a `Your Estimate`, muestra el total itemizado y anuncia:

> Thank you — your details were sent to Lisa. Your planning estimate is now
> unlocked, and Lisa will reply personally about your session.

Las selecciones y los datos quedan congelados después del éxito para que el
recibo revelado coincida con lo enviado.

### Error y reintento

Un HTTP no exitoso, fallo de red o timeout de 15 segundos mantiene el estimado
bloqueado, conserva los valores, restablece los controles y enfoca este aviso:

> We couldn't confirm the submission, so your estimate is still locked. Your
> entries are still here — please try again, or call or text Lisa at
> (509) 948-7322.

El guard de estado evita envíos duplicados durante el request y después de una
confirmación exitosa.

### Fallback sin JavaScript

El mismo formulario HTML continúa siendo submittable con `POST` y
`action="/thank-you/"`. Netlify recibe las selecciones crudas para que Lisa
pueda recalcularlas; el navegador navega a la confirmación noindex en lugar de
intentar revelar un total en cliente.

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
countryside around them — with no travel fee anywhere in the area. Sessions
happen outdoors at golden hour, at a location we choose together, except
newborn sessions, which happen in your home.

---

## Contrato del formulario

- La ruta contiene exactamente un `<form name="session-estimate">`.
- Método `POST`, `data-netlify="true"`, `netlify-honeypot="bot-field"` y campo
  oculto `form-name=session-estimate`.
- JavaScript serializa como `application/x-www-form-urlencoded` y envía a `/`,
  el endpoint same-origin que Netlify Forms procesa.
- El recibo solo se revela tras `response.ok`; una excepción nunca se trata como
  conversión.
- Los eventos GA4 registran únicamente nombres de interacción —view, inicio,
  intento, éxito, error y reveal— sin nombre, email, teléfono, nota ni valor de
  campos.
- La configuración y las notificaciones de Netlify Forms en producción fueron
  confirmadas por el usuario el 2026-08-11. El QA automatizado de este cambio
  interceptó todos los POST; no envió datos reales.

## Privacidad

La divulgación inline explica de forma factual qué datos se envían y por qué.
No sustituye una política legal. `/privacy/` continúa `draft/noindex` hasta que
una persona autorizada revise el uso global de Netlify Forms, Microsoft Clarity
y Google Analytics y defina cualquier requisito de consentimiento.

## QA de publicación

- Validadores staging y release: 21/21 rutas.
- Release: Contact indexable, canonical `www`, sin header noindex, dentro de
  sitemap (10 URLs) y `llms.txt` (9 entradas).
- Playwright: 1440, 1200, 900 y 390 px.
- Casos automatizados con POST interceptado: HTTP 2xx, HTTP 5xx, fallo de red y
  doble clic.
- Verificado: un solo POST, unlock únicamente en 2xx, error/retry sin pérdida de
  datos, controles congelados tras éxito, foco accesible, fallback sin
  JavaScript y ausencia de overflow horizontal.

## Notas editoriales

- No prometer calendario de reservas online.
- No presentar el estimado como precio contractual, booking ni pago.
- No publicar una dirección de calle o pin de mapa desde datos legados.
- No añadir un `Service`, Review o rating al schema sin evidencia y una decisión
  explícita.
