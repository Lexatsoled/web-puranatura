#!/usr/bin/env bash
# Purge history helper (POSIX / Linux / macOS)
# WARNING: This rewrites git history. Use with extreme care. Run locally only
# after reading the runbook docs/runbooks/history-remediation.md and coordinate
# with all collaborators (they will need to re-clone). This script does not
# force-push anything by default — it creates a cleaned mirror repo under
# ./tmp-repo-purged.git that you can inspect and push manually.

set -euo pipefail

REPO_REMOTE=${1:-git@github.com:Lexatsoled/web-puranatura.git}
MIRROR_DIR=./tmp-repo-mirror.git
PURGED_DIR=./tmp-repo-purged.git

echo "This will create a mirror clone of ${REPO_REMOTE} into ${MIRROR_DIR}"
echo "It will then run git-filter-repo to remove sensitive paths and write output to ${PURGED_DIR}"
echo
read -p "Continue? [y/N]: " conf
if [[ "$conf" != "y" && "$conf" != "Y" ]]; then
  echo "Aborting"
  exit 1
fi

rm -rf "$MIRROR_DIR" "$PURGED_DIR"

echo "Cloning mirror..."
git clone --mirror "$REPO_REMOTE" "$MIRROR_DIR"

pushd "$MIRROR_DIR" >/dev/null

echo "Running git-filter-repo (requires git-filter-repo installed)"
# Example removal list (update if you need to add or remove paths)
cat > remove-paths.txt <<'EOF'
archive/legacy-docs/
reports/tmp/
reports/tmp/*
*.env.local
reports/tmp/lighthouse.*
EOF

echo "The following paths will be removed from history:"
cat remove-paths.txt

read -p "Proceed with rewrite? This is destructive for the mirror only (Y to proceed): " proceed
if [[ "$proceed" != "Y" ]]; then
  echo "Cancelled rewrite. Mirror is at ${MIRROR_DIR}" && popd >/dev/null
  exit 0
fi

# Run git-filter-repo removing listed paths
git filter-repo --invert-paths --paths-from-file remove-paths.txt

popd >/dev/null

echo "Move purged mirror to ${PURGED_DIR}"
mv "$MIRROR_DIR" "$PURGED_DIR"

echo "Purged repo created at ${PURGED_DIR}. Inspect before force-pushing."
echo "If you want to push, run: git push --force --all and git push --force --tags from inside ${PURGED_DIR}" 
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
