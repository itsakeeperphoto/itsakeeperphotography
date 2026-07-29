# CONTACT — `/contact/`
_Página 10 de 18 · Trust & conversion · **v2 — actualizada 2026-07 con Q49, Q50, Q61**_

> **Corrección importante:** Lisa NO tiene calendario de reservas online (está en su lista de tareas). El sitio no debe prometerlo. Su preferencia real es **email → llamada telefónica**; el texto es su canal menos favorito.

---

## SEO técnico

| Campo | Valor |
|---|---|
| **URL** | `/contact/` |
| **Keyword objetivo** | Marca + NAP para local SEO |
| **Title** (52) | `Contact Lisa | Book Your Tri-Cities Photo Session` |
| **Meta description** (147) | `Tell Lisa who's in front of the camera and what this season means to you. She reads and answers every inquiry herself — usually with a phone call to plan.` |

### Entidades a establecer
It's A Keeper Photography · Lisa Weiss · 62 Canyon St, Richland, WA 99352 · (509) 948-7322 · Richland · Kennewick · Pasco · Tri-Cities
**NAP idéntico carácter a carácter** al Google Business Profile y al footer global. Es la página donde más pesa esa consistencia.

### Estructura de headings

```
H1  Let's Plan Your Session
 H2  Tell Me About You              (planner multi-paso)
 H2  What Happens Next
 H2  Prefer to Talk?
 H2  Where I Work
 H2  A Few Things Worth Knowing
```

---

## COPY

### Hero

**H1:** Let's Plan Your Session

**Subhead:** This takes about a minute, and it's the first step toward photographs your family will keep. I read and answer every inquiry myself — you'll hear back from me, not an assistant.

---

**H2: Tell Me About You**

_(Mantener el planner multi-paso actual. Pasos:)_

1. **Who's in front of the camera?** — Senior · Family · Newborn · My Business · Headshot _(cada opción con imagen)_
2. **What season do you picture?** — Spring · Summer · Autumn · Winter · I'm flexible
   _Microcopia:_ "I book about four to six weeks ahead, so there's time to plan it right. May through October fills fastest."
3. **Where do you imagine it?** — Somewhere outdoors and golden · A place that's special to us · Help me choose
4. **Tell me about you** — "Who are these photos for? What moment are you hoping to keep?"
5. **Where should I reach you?** — Name, email, phone
   _Microcopia:_ "No newsletters, no pressure — just me, calling to plan everything with you."

**CTA:** Send it to Lisa

---

**H2: What Happens Next**

**1. I'll write back personally.** Usually with a couple of questions, because I want to understand what you're hoping for before I start suggesting things.

**2. We'll set up a phone call.** This is my favorite part. We'll talk through dates, locations, wardrobe and timing — and most people get off that call a lot more excited and a lot less nervous than they got on it.

**3. Your date gets reserved.** Once we've found a date that works, I'll send a contract and a retainer invoice. Your date is officially yours once both are complete. The remaining balance is due the day of your session.

Nothing is held before that step, so if you have a particular season in mind, it's worth reaching out sooner than you think.

---

**H2: Prefer to Talk?**

Sometimes it's just easier to say it out loud. Call or text me at **(509) 948-7322** and tell me what you're thinking.

Honestly? Email is the easiest way to reach me, and a phone call is the best way to plan. But use whichever one gets you to actually reach out — that's the part that matters.

---

**H2: Where I Work**

**It's A Keeper Photography**
62 Canyon St
Richland, WA 99352
(509) 948-7322

I photograph throughout the Tri-Cities — Richland, Kennewick, Pasco and the countryside around them — with no travel fee anywhere in the area. Sessions happen outdoors at golden hour, at a location we choose together, except newborn sessions, which happen in your home.

_(Embeber mapa del Google Business Profile aquí.)_

---

**H2: A Few Things Worth Knowing**

- I reserve most sessions **four to six weeks ahead.** May through October is peak season and fall dates go first.
- I photograph **seniors, families, newborns, couples, small elopements, branding and headshots.** I don't photograph full weddings, events or boudoir — if that's what you need, I'm glad to point you toward someone who specializes in it.
- Pricing is shared during our first conversation, so I can recommend what actually fits you.

---

## Internal links (4 en prosa)

1. `/investment/` — en "A Few Things Worth Knowing", desde la línea de pricing
2. `/reviews/` — antes del formulario, para quien aún está decidiendo
3. `/about/` — desde "you'll hear back from me"
4. `/journal/` — opcional, para quien todavía está en fase de planeación

## Schema JSON-LD

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "url": "https://www.itsakeeperphotography.com/contact/",
      "about": {"@id": "https://www.itsakeeperphotography.com/#business"}
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.itsakeeperphotography.com/#business",
      "name": "It's A Keeper Photography",
      "telephone": "+15099487322",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "62 Canyon St",
        "addressLocality": "Richland",
        "addressRegion": "WA",
        "postalCode": "99352",
        "addressCountry": "US"
      },
      "areaServed": [
        {"@type": "City", "name": "Richland"},
        {"@type": "City", "name": "Kennewick"},
        {"@type": "City", "name": "Pasco"}
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+15099487322",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": "English"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.itsakeeperphotography.com/"},
        {"@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.itsakeeperphotography.com/contact/"}
      ]
    }
  ]
}
```

## Notas

- El formulario envía a `/thank-you/` (noindex) para medir conversiones.
- **No prometer calendario de reservas online** hasta que Lisa lo implemente.
- Sin `[PENDIENTE]` de tiempo de respuesta: se evita comprometer un plazo que Lisa no fijó, diciendo en su lugar que responde personalmente.
