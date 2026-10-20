#!/bin/bash
set -euo pipefail

# Only run in Claude Code cloud sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install the rea CLI (used by the reverse-engineer-anything skill) if missing.
if ! command -v rea >/dev/null 2>&1; then
  npm install --global rea-agents
fi
