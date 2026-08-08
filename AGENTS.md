# AGENTS.md — Contrato de trabajo para cualquier agente

Este archivo lo leen automáticamente los agentes que trabajan en el repositorio.

## 0. Regla de oro

**La sesión del agente es desechable. El repositorio es la memoria.**

Si algo no quedó escrito en `docs/context/` y commiteado a git, se considera
perdido. Nunca asumas que existe una conversación previa.

### Repositorio oficial

- Repositorio: `https://github.com/itsakeeperphoto/itsakeeperphotography.git`.
- Antes de cualquier edición o push, ejecutar `git remote get-url origin` y
  confirmar que coincide exactamente con el remoto oficial.
- No aplicar ni enviar cambios de este proyecto a
  `williammelo533/itsakeeper-astro`.

## 1. Protocolo de arranque obligatorio

Antes de tocar código, lee completos y en este orden:

0. Verificar `git remote get-url origin` contra el repositorio oficial.
1. `docs/context/00-proyecto.md`
2. `docs/context/10-arquitectura.md`
3. `docs/context/20-estado.md`
4. `docs/context/50-backlog.md`
5. Las 10 entradas más recientes de `docs/context/30-decisiones.md`
6. La última entrada de `docs/context/40-bitacora.md`

Luego ejecuta:

```bash
git log --oneline -20
git status
```

Antes de escribir código, responde al humano en máximo 8 líneas: qué es el
proyecto, dónde quedó, el siguiente paso y cualquier contradicción documental.
Espera confirmación. Si algo no cuadra, corrige primero la documentación.

## 2. Durante la sesión

- Toda decisión no trivial se agrega a `30-decisiones.md`; es append-only.
- Si una decisión queda obsoleta, crea un ADR nuevo y marca el anterior como
  `SUPERSEDIDA POR ADR-XXX`; nunca borres el historial.
- Todo cambio estructural actualiza `10-arquitectura.md` en el mismo commit.
- Nunca inventes contexto. Usa `TODO(contexto): <pregunta concreta>`.
- Antes de compactar contexto, actualiza y commitea `20-estado.md` y
  `40-bitacora.md`.

## 3. Protocolo de cierre obligatorio

- [ ] Reescribir `20-estado.md` con rama, commit, funcionamiento verificado,
      trabajo parcial con rutas exactas, comandos, bloqueadores y siguiente paso.
- [ ] Agregar una entrada a `40-bitacora.md`.
- [ ] Agregar los ADR nuevos a `30-decisiones.md`.
- [ ] Actualizar `50-backlog.md` y, si cambió la estructura, `10-arquitectura.md`.
- [ ] Ejecutar `./scripts/handoff.sh "resumen"` para respaldar, commitear y subir.

Un agente sin historial debe poder retomar en menos de diez minutos.

## 4. Prohibido

- Reescribir o borrar entradas de `30-decisiones.md` o `40-bitacora.md`.
- Terminar con `20-estado.md` desactualizado.
- Documentar intenciones como hechos.
- Escribir secretos, tokens, llaves o valores reales de `.env` en `docs/`.
- Preparar, commitear o subir `.handoff/sessions/*.jsonl`; estos transcripts se
  conservan únicamente en la máquina local.
- Hacer `git push --force` sobre `main`.

## 5. Convenciones

- Documentación: español.
- Código y commits: inglés.
- Commits: `tipo(alcance): descripción` (`feat`, `fix`, `docs`, `refactor`, `chore`).
- Preservar cambios ajenos y no usar operaciones git destructivas.
