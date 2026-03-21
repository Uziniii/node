#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Installing JS linting tools (tools/eslint)..."
npm --prefix tools/eslint install

echo "Installing Markdown linting tools (tools/lint-md)..."
npm --prefix tools/lint-md install

# Create a node symlink pointing to the system node if not already present
# This allows 'make lint-js' and other Makefile targets to work
if [ ! -e node ]; then
  SYSTEM_NODE="$(which node)"
  ln -s "$SYSTEM_NODE" node
  echo "Created node symlink -> $SYSTEM_NODE"
fi

echo "Session setup complete."
