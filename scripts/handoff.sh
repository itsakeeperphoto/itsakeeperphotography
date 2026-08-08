#!/usr/bin/env bash
# Respalda localmente el rollout más reciente de Codex, verifica el contexto,
# crea un commit de la documentación y lo publica. Los transcripts `*.jsonl`
# están ignorados por git y nunca deben subirse sin autorización explícita.

set -euo pipefail

MSG="${1:-handoff}"
DATE="$(date +%Y-%m-%d)"
TASK_CODEX_DIR="${CODEX_HOME:-$HOME/.codex}"
BACKUP_DIR=".handoff/sessions"

cd "$(git rev-parse --show-toplevel)"
mkdir -p "$BACKUP_DIR"

if [ -d "$TASK_CODEX_DIR/sessions" ]; then
  LATEST="$(find "$TASK_CODEX_DIR/sessions" -name 'rollout-*.jsonl' -type f \
            -print0 2>/dev/null | xargs -0 ls -t 2>/dev/null | head -n 1 || true)"
  if [ -n "${LATEST:-}" ]; then
    cp "$LATEST" "$BACKUP_DIR/${DATE}-$(basename "$LATEST")"
    echo "✓ Transcript respaldado solo localmente: $BACKUP_DIR/${DATE}-$(basename "$LATEST")"
  else
    echo "! No se encontró ningún rollout-*.jsonl en $TASK_CODEX_DIR/sessions"
  fi
else
  echo "! No existe $TASK_CODEX_DIR/sessions"
fi

STALE=0
for f in docs/context/20-estado.md docs/context/40-bitacora.md; do
  if ! grep -q "$DATE" "$f" 2>/dev/null; then
    echo "✗ $f no menciona la fecha de hoy ($DATE)"
    STALE=1
  fi
done
if [ "$STALE" -eq 1 ]; then
  echo "El contexto obligatorio está desactualizado; handoff abortado."
  exit 1
fi

git add -A
if git diff --cached --quiet; then
  echo "Nada que commitear."
else
  git commit -m "docs: handoff ${DATE} — ${MSG}"
  echo "✓ Commit creado."
fi

if git remote get-url origin >/dev/null 2>&1; then
  git push
  echo "✓ Push hecho. La fuente de verdad está fuera de esta máquina."
else
  echo "! No hay remoto configurado; la documentación sigue solo en local."
fi
