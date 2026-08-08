# Prompts de continuidad

## Arranque

> Lee `AGENTS.md` y ejecuta el protocolo de arranque. No escribas código hasta
> que me hayas dado tu resumen y yo lo confirme.

## Cierre

> Ejecuta el protocolo de cierre de `AGENTS.md`. Un agente sin historial debe
> poder retomar esto en diez minutos. Luego corre
> `./scripts/handoff.sh "<resumen>"`.

## Auditoría semanal

> Compara `docs/context/` contra el estado real del código. Indica qué está
> desactualizado, qué se documentó como hecho pero no existe y qué existe sin
> documentar. No cambies código todavía.
