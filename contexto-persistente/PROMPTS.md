# Prompts listos para pegar

## A. Prompt de RESCATE — úsalo AHORA, en la sesión que ya tienes abierta

> Antes de hacer cualquier otra cosa: esta sesión se va a perder y el próximo
> agente empezará desde cero, sin ver nada de esta conversación.
>
> Recorre TODO nuestro historial de esta sesión y vuelca el conocimiento en
> `docs/context/`, siguiendo el `AGENTS.md` de la raíz:
>
> - `00-proyecto.md` y `10-arquitectura.md`: solo lo que ya existe y verificaste.
> - `20-estado.md`: reescríbelo completo. Qué funciona, qué quedó a medias con
>   rutas de archivo exactas, cómo levantar y probar el proyecto, bloqueadores,
>   y el siguiente paso concreto.
> - `30-decisiones.md`: una entrada ADR por cada decisión no trivial que
>   tomamos, incluyendo las alternativas que descartamos y por qué.
> - `40-bitacora.md`: una entrada resumiendo esta sesión, incluyendo qué
>   intentamos que NO funcionó.
> - `50-backlog.md`: todo lo pendiente.
>
> Sé exhaustivo: prefiero un documento largo a perder información. No inventes
> nada; si algo no lo sabes con certeza, márcalo como
> `TODO(contexto): <pregunta>`.
>
> Cuando termines, muéstrame el diff y luego corre `./scripts/handoff.sh`.

## B. Prompt de ARRANQUE — primer mensaje de cada sesión nueva

> Lee `AGENTS.md` y ejecuta el protocolo de arranque. No escribas código hasta
> que me hayas dado tu resumen y yo lo confirme.

## C. Prompt de CIERRE — último mensaje de cada sesión

> Ejecuta el protocolo de cierre de `AGENTS.md`. Recuerda el criterio: un
> agente sin historial debe poder retomar esto en 10 minutos sin preguntarme
> nada. Luego corre `./scripts/handoff.sh "<resumen>"`.

## D. Prompt de AUDITORÍA — una vez por semana

> Compara `docs/context/` contra el estado real del código. Dime qué está
> desactualizado, qué se documentó como hecho pero no está implementado, y qué
> existe en el código pero no está documentado. No arregles nada todavía.
