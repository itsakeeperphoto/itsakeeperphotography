# Sistema de contexto persistente

La sesión del agente es desechable; este repositorio es la memoria.

```text
AGENTS.md                    Contrato obligatorio de arranque y cierre
PROMPTS.md                   Prompts de rescate, arranque y auditoría
docs/context/00-proyecto.md  Qué es y para quién
docs/context/10-arquitectura.md Cómo está construido
docs/context/20-estado.md    Estado operativo actual
docs/context/30-decisiones.md Registro ADR append-only
docs/context/40-bitacora.md  Historial de sesiones append-only
docs/context/50-backlog.md   Pendientes y preguntas
scripts/handoff.sh           Respalda transcript, commitea y hace push
.handoff/sessions/           Red de seguridad de rollouts de Codex
```

Reglas: si no está commiteado no existe; cada sesión abre leyendo `AGENTS.md` y
cierra ejecutando `./scripts/handoff.sh`; `20-estado.md` manda si hay una
contradicción; nunca se guardan secretos.
