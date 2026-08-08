# AGENTS.md — Contrato de trabajo para cualquier agente

Este archivo lo lee automáticamente Codex CLI, Codex Desktop y Codex Cloud.
Claude Code, Cursor y otros agentes también lo leen o se les puede apuntar a él.

---

## 0. Regla de oro

**La sesión del agente es desechable. El repositorio es la memoria.**

Si algo no quedó escrito en `docs/context/` y commiteado a git, se considera
perdido. No importa qué tan brillante fue el razonamiento en el chat: el
próximo agente no lo va a ver.

Nunca asumas que existe una conversación previa. No existe.

---

## 1. Protocolo de arranque (obligatorio, ANTES de tocar código)

Lee estos archivos completos, en este orden:

1. `docs/context/00-proyecto.md` — qué es y para quién
2. `docs/context/10-arquitectura.md` — stack, estructura, contratos
3. `docs/context/20-estado.md` — **dónde estamos AHORA** (el más importante)
4. `docs/context/50-backlog.md` — qué sigue y qué está bloqueado
5. `docs/context/30-decisiones.md` — al menos las 10 entradas más recientes
6. `docs/context/40-bitacora.md` — la última entrada

Luego ejecuta:

```bash
git log --oneline -20
git status
```

Antes de escribir una sola línea de código, responde al humano en máximo
8 líneas:

- Qué entendiste que es el proyecto
- En qué punto exacto quedó
- Cuál crees que es el siguiente paso
- Qué contradicciones o vacíos encontraste en la documentación

**Espera confirmación.** Si algo no cuadra, se arregla la documentación
primero, no el código.

---

## 2. Durante la sesión

- **Decisión no trivial** (stack, esquema de datos, contrato de API, trade-off,
  algo que descartaste y por qué) → nueva entrada en `30-decisiones.md`.
  Append-only: nunca edites ni borres entradas anteriores. Si una decisión
  queda obsoleta, agrega una nueva que la supersede y marca la vieja con
  `SUPERSEDIDA POR ADR-XXX`.
- **Cambio estructural** (nueva dependencia, carpeta, variable de entorno,
  endpoint, tabla) → actualiza `10-arquitectura.md` en el **mismo commit** que
  el código. No después.
- **Nunca inventes contexto.** Si falta información, pregunta al humano o deja
  `TODO(contexto): <pregunta concreta>` en `50-backlog.md`.
- Si el contexto de la sesión se está llenando (vas a compactar), primero
  vuelca todo lo relevante a `20-estado.md` y `40-bitacora.md`, y commitea.
  Compactar sin documentar = pérdida de información.

---

## 3. Protocolo de cierre (obligatorio antes de terminar la sesión)

Ejecuta este checklist completo. No lo saltes aunque la sesión haya sido corta.

- [ ] `20-estado.md` reescrito para reflejar la realidad de ahora mismo
      (rama, último commit, qué funciona, qué quedó a medias con nombres de
      archivo exactos, cómo levantar y probar el proyecto, bloqueadores).
- [ ] Nueva entrada al final de `40-bitacora.md` con la plantilla de ese archivo.
- [ ] Decisiones nuevas agregadas a `30-decisiones.md`.
- [ ] `50-backlog.md` actualizado: tachado lo hecho, agregado lo nuevo, con el
      **siguiente paso concreto y accionable** al principio.
- [ ] `10-arquitectura.md` al día si cambió algo estructural.
- [ ] Commit:
      ```bash
      git add -A
      git commit -m "docs: handoff YYYY-MM-DD — <resumen en 6 palabras>"
      git push
      ```

**Criterio de calidad del handoff:** un agente nuevo, sin ningún historial,
debe poder leer `docs/context/` y retomar el trabajo en menos de 10 minutos
sin hacerle una sola pregunta al humano. Si no cumple eso, el handoff está
incompleto.

---

## 4. Prohibido

- Reescribir o borrar entradas de `30-decisiones.md` o `40-bitacora.md`.
- Terminar una sesión con `20-estado.md` desactualizado.
- Documentar intenciones como si fueran hechos. Lo que no está implementado
  va en `50-backlog.md`, no en `10-arquitectura.md`.
- Escribir secretos, tokens, llaves o `.env` reales en `docs/`.

---

## 5. Convenciones del proyecto

<!-- Rellena esta sección con lo tuyo: lenguaje, formato de commits, tests,
     estilo de código, comandos permitidos, etc. -->

- Idioma de la documentación: español.
- Idioma del código y los commits: inglés.
- Commits: `tipo(alcance): descripción` — feat, fix, docs, refactor, chore.
- Nunca hagas `git push --force` sobre `main`.
