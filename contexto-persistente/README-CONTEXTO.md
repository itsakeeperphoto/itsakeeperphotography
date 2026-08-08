# Sistema de contexto persistente

La sesión del agente es desechable. Este repo es la memoria.

```
AGENTS.md                    Contrato que todo agente lee al arrancar
PROMPTS.md                   Prompts listos para pegar
docs/context/
  00-proyecto.md             Qué es y para qué        (estable)
  10-arquitectura.md         Cómo está construido     (cambia con el código)
  20-estado.md               Dónde estamos AHORA      (se reescribe cada sesión)
  30-decisiones.md           Por qué                  (append-only)
  40-bitacora.md             Cómo llegamos aquí       (append-only)
  50-backlog.md              Qué falta                (editable)
scripts/handoff.sh           Respalda transcript + commitea + push
.handoff/sessions/           Copias de los rollouts de Codex (red de seguridad)
```

## Reglas

1. Si no está commiteado, no existe.
2. Toda sesión abre con el protocolo de arranque y cierra con el de cierre.
3. `20-estado.md` manda sobre cualquier otro documento si hay contradicción.
4. `30-decisiones.md` y `40-bitacora.md` no se editan, solo se agregan entradas.
5. Nunca escribas secretos en `docs/`.

## Primeros pasos

```bash
git init                     # si aún no
git remote add origin <url>  # imprescindible: saca la memoria de esta máquina
chmod +x scripts/handoff.sh
```

Luego pega el **Prompt A** de `PROMPTS.md` en tu sesión de Codex actual.
