#!/usr/bin/env bash
# handoff.sh — respalda el transcript de la sesión de Codex y commitea la
# documentación. Ejecutar SIEMPRE antes de cerrar sesión o cambiar de cuenta.
#
# Uso:  ./scripts/handoff.sh "resumen corto de la sesion"

set -euo pipefail

MSG="${1:-handoff}"
DATE="$(date +%Y-%m-%d)"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
BACKUP_DIR=".handoff/sessions"

cd "$(git rev-parse --show-toplevel)"
mkdir -p "$BACKUP_DIR"

# 1. Respaldar el rollout mas reciente de Codex (red de seguridad, NO la fuente
#    de verdad). Si no existe, seguimos igual.
if [ -d "$CODEX_HOME/sessions" ]; then
  LATEST="$(find "$CODEX_HOME/sessions" -name 'rollout-*.jsonl' -type f \
            -print0 2>/dev/null | xargs -0 ls -t 2>/dev/null | head -n 1 || true)"
  if [ -n "${LATEST:-}" ]; then
    cp "$LATEST" "$BACKUP_DIR/${DATE}-$(basename "$LATEST")"
    echo "✓ Transcript respaldado: $BACKUP_DIR/${DATE}-$(basename "$LATEST")"
  else
    echo "! No se encontro ningun rollout-*.jsonl en $CODEX_HOME/sessions"
  fi
else
  echo "! No existe $CODEX_HOME/sessions (¿otro agente? ¿CODEX_HOME distinto?)"
fi

# 2. Verificar que la documentacion se actualizo hoy.
STALE=0
for f in docs/context/20-estado.md docs/context/40-bitacora.md; do
  if ! grep -q "$DATE" "$f" 2>/dev/null; then
    echo "✗ $f no menciona la fecha de hoy ($DATE) — ¿lo actualizaste?"
    STALE=1
  fi
done
if [ "$STALE" -eq 1 ]; then
  echo ""
  read -r -p "Continuar de todas formas? [y/N] " ans
  [ "$ans" = "y" ] || { echo "Abortado. Actualiza la documentacion primero."; exit 1; }
fi

# 3. Commit y push.
git add -A
if git diff --cached --quiet; then
  echo "Nada que commitear."
else
  git commit -m "docs: handoff ${DATE} — ${MSG}"
  echo "✓ Commit creado."
fi

if git remote get-url origin >/dev/null 2>&1; then
  git push && echo "✓ Push hecho. La fuente de verdad esta fuera de esta maquina."
else
  echo "! No hay remoto configurado. La documentacion sigue SOLO en local."
  echo "  git remote add origin <url> && git push -u origin main"
fi
