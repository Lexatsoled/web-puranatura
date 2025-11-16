#!/usr/bin/env bash
set -euo pipefail

LOG_PATH="${1:-}"

log() {
  local message="$1"
  echo "$message"
  if [[ -n "$LOG_PATH" ]]; then
    printf '%s\n' "$message" >>"$LOG_PATH"
  fi
}

if [[ -n "$LOG_PATH" ]]; then
  mkdir -p "$(dirname "$LOG_PATH")"
  printf '# Auditoria historica ejecutada %s\n' "$(date --iso-8601=seconds 2>/dev/null || date)" >"$LOG_PATH"
fi

log "[INFO] Iniciando auditoría histórica de secretos..."

FILES=(
  "backend/.env"
  "backend/.env.local"
  "backend/database.sqlite"
  "backend/database.sqlite-shm"
  "backend/database.sqlite-wal"
)

issues=0

for file in "${FILES[@]}"; do
  log ""
  log "[CHECK] Revisando historial de: ${file}"
  if git log --all --full-history --oneline -- "${file}" >/dev/null 2>&1; then
    output=$(git log --all --full-history --pretty=format:"%H %ai %an - %s" -- "${file}")
    if [[ -z "${output}" ]]; then
      log "  [OK] Nunca fue comiteado."
    else
      log "  [FAIL] Encontrado en historial:"
      log "${output}"
      issues=$((issues + 1))
    fi
  else
    log "  [INFO] El archivo no existe en el historial."
  fi
done

log ""
log "[INFO] Revisando historial de backend/.gitignore"
git log --all --pretty=format:"%H %ai %an - %s" -- backend/.gitignore 2>/dev/null | while IFS= read -r line; do
  log "$line"
done || true

log ""
if [[ $issues -eq 0 ]]; then
  log "[SUCCESS] Historial limpio."
else
  log "[WARNING] Se detectaron ${issues} archivo(s) sensibles en el historial."
  exit 1
fi
