#!/bin/sh
# Commit any pending changes and push to GitHub.
# Used after edits so the repo stays in step with the live project.
# Run it on its own any time to sync: ./sync.sh "your message"
set -e
cd "$(dirname "$0")"

MSG="${1:-Update site}"

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git -c user.name="Drifters" -c user.email="enquiries.drifters@gmail.com" commit -q -m "$MSG"
  echo "Committed: $MSG"
else
  echo "Nothing to commit"
fi

# Pull in anything changed on GitHub first, then push (keeps both sides aligned)
if git remote get-url origin >/dev/null 2>&1; then
  git pull --rebase --autostash -q origin "$(git branch --show-current)" 2>/dev/null || true
  git push -q origin "$(git branch --show-current)"
  echo "Pushed to $(git remote get-url origin)"
fi
