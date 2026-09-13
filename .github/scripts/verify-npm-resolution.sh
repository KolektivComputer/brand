#!/usr/bin/env bash
# Verify anonymously that @kolektiv/brand-* at a version resolves from the
# advertised npm registry — the `npm-public` group, which aggregates every
# public Kolektiv project's hosted repository (brand-npm, keel-npm, ...).
#
# Usage: verify-npm-resolution.sh [version]
set -uo pipefail

REGISTRY="https://repo.yuri.capital/repository/npm-public/"
PACKAGES=(
  @kolektiv/brand-core
  @kolektiv/brand-react
  @kolektiv/brand-vue
  @kolektiv/brand-svelte
  @kolektiv/brand-vanilla
)

VERSION="${1:-}"
if [ -z "${VERSION}" ]; then
  VERSION="$(node -p "require('./packages/core/package.json').version" 2>/dev/null)"
fi
if [ -z "${VERSION}" ]; then
  echo "::error::usage: $0 <version> (or run from the repository root with node available)"
  exit 2
fi

echo "verifying @kolektiv/brand-*:${VERSION} from ${REGISTRY}"

failed=0
for package in "${PACKAGES[@]}"; do
  if npm view "${package}@${VERSION}" version --registry "${REGISTRY}" \
    --fetch-retries=3 >/dev/null 2>&1; then
    echo "ok   ${package}@${VERSION}"
  else
    echo "::error::missing: ${package}@${VERSION}"
    failed=1
  fi
done

if [ "${failed}" -ne 0 ]; then
  echo "::error::@kolektiv/brand-*:${VERSION} does not resolve from advertised registry ${REGISTRY}"
  exit 1
fi

echo "all packages resolve from advertised registry ${REGISTRY}"
