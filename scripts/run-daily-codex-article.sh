#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/papay0/Dev/the-debrief"
TIMEZONE="${ARTICLE_TIMEZONE:-America/Los_Angeles}"
FORCE="${FORCE_DAILY_ARTICLE:-0}"
LOCK_DIR="${TMPDIR:-/tmp}/the-debrief-daily-codex-article.lock"
PROMPT_FILE="$ROOT/scripts/prompts/daily-codex-article.md"
SUMMARY_FILE="/Users/papay0/Library/Logs/the-debrief/daily-codex-article-summary.txt"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [[ "${1:-}" == "--force" ]]; then
  FORCE="1"
fi

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Daily Codex article job is already running."
  exit 0
fi
trap 'rmdir "$LOCK_DIR"' EXIT

cd "$ROOT"
mkdir -p "$(dirname "$SUMMARY_FILE")"

today="$(TZ="$TIMEZONE" date +%F)"
hour="$(TZ="$TIMEZONE" date +%H)"

if [[ "$FORCE" != "1" && "$hour" != "08" ]]; then
  echo "Skipping: local Pacific hour is $hour, not 08."
  exit 0
fi

if [[ "$FORCE" != "1" ]] && grep -R -E "^date: ['\"]?${today}['\"]?$" content/posts/en content/posts/fr >/dev/null 2>&1; then
  echo "Skipping: a published post already exists for $today."
  exit 0
fi

if ! command -v codex >/dev/null 2>&1; then
  echo "Missing codex CLI. Install it before the LaunchAgent runs."
  exit 1
fi

if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  echo "Refusing to run: working tree is dirty before Codex starts."
  git status --short
  exit 1
fi

git fetch origin main
git pull --ff-only origin main

{
  echo "Current local Pacific time: $(TZ="$TIMEZONE" date '+%Y-%m-%d %H:%M %Z')"
  echo "FORCE_DAILY_ARTICLE=$FORCE"
  echo "Repository: $ROOT"
  echo
  cat "$PROMPT_FILE"
} | codex \
  --search \
  --ask-for-approval never \
  --sandbox danger-full-access \
  --cd "$ROOT" \
  exec \
  --output-last-message "$SUMMARY_FILE" \
  -

changed_files="$(git status --porcelain --untracked-files=all | cut -c4-)"

if [[ -z "$changed_files" ]]; then
  echo "Codex did not create article changes."
  exit 0
fi

unexpected_files="$(printf '%s\n' "$changed_files" | grep -Ev '^(content/posts/(en|fr)/.*\.mdx|public/images/.*)$' || true)"
if [[ -n "$unexpected_files" ]]; then
  echo "Codex changed files outside the allowed article/image paths:"
  printf '%s\n' "$unexpected_files"
  exit 1
fi

npm run lint
npm run build

git add content/posts/en content/posts/fr public/images
git commit -m "Publish daily Codex article: $today"
git push origin HEAD:main
