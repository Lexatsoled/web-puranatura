#!/usr/bin/env bash
# Safe helper for purging sensitive files from repo history using git-filter-repo
# This script creates a mirror clone, runs git-filter-repo (removal list below) and
# prints verification instructions. It will NOT push by default — push only after manual verification.

set -euo pipefail

REPO_URL=${1:-$(git config --get remote.origin.url)}
MIRROR_DIR=${2:-"/tmp/purge-repo-mirror"}
DRY_RUN=${3:-false}

if ! command -v git >/dev/null 2>&1; then
  echo "git not found" >&2; exit 1
fi
if ! command -v python >/dev/null 2>&1; then
  echo "python not found" >&2; exit 1
fi

echo "Repository: $REPO_URL"
echo "Mirror dir: $MIRROR_DIR"

if [ -d "$MIRROR_DIR" ]; then
  echo "Cleaning existing mirror dir: $MIRROR_DIR"
  rm -rf "$MIRROR_DIR"
fi

echo "Cloning bare mirror..."
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

paths_to_purge=(
  ".env"
  ".env.local"
  "backend/.env"
  "backend/backups"
  "backend/*.sqlite"
  "backend/*sqlite*"
  "backend/database.sqlite.backup"
  "backend/database.legacy-before-bff.sqlite"
  "backend/out.log"
  "backend/logs"
)

echo "Paths to purge:"
for p in "${paths_to_purge[@]}"; do echo "  - $p"; done

if ! python -c "import git_filter_repo" >/dev/null 2>&1; then
  echo "git-filter-repo python module not found — installing to venv"
  python -m venv venv-filterrepo
  source venv-filterrepo/bin/activate
  pip install --upgrade pip
  pip install git-filter-repo
fi

args=(--invert-paths)
for p in "${paths_to_purge[@]}"; do args+=(--path "$p"); done

echo "Running git-filter-repo (this will rewrite history in the mirror)..."
python -m git_filter_repo "${args[@]}"

echo "Verification: list any files that still match suspect patterns (output empty if removed)."
for p in "${paths_to_purge[@]}"; do
  git ls-files | grep -F "$p" || true
done

if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --source . --report-path ./gitleaks-report.json || echo "gitleaks found issues — check gitleaks-report.json"
  [ -f ./gitleaks-report.json ] && cat ./gitleaks-report.json
else
  echo "gitleaks not installed — run it manually to verify secret absence."
fi

echo "Done. The mirror at $MIRROR_DIR now contains the cleaned history. To push the cleaned repo back to origin you must run (from inside the mirror dir):"
echo "  git push --force --all"
echo "  git push --force --tags"
echo "ONLY push AFTER you have rotated all affected secrets and communicated with your team."
