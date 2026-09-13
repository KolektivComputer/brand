#!/usr/bin/env bash
# Publish @kolektiv/brand-* to the hosted Nexus repo (brand-npm).
# npm-releases / npm-snapshots are groups — read-only, PUT returns 404.
#
# The repo `.npmrc` maps `@kolektiv` to the aggregated `npm-public` group for
# fetching, so we temporarily append the hosted `brand-npm` mapping (with auth)
# to the project `.npmrc` for the duration of the publish.
set -euo pipefail

: "${YURI_CAPITAL_REPO_USERNAME:?set YURI_CAPITAL_REPO_USERNAME}"
: "${YURI_CAPITAL_REPO_PASSWORD:?set YURI_CAPITAL_REPO_PASSWORD}"

HOST="repo.yuri.capital"
REGISTRY="https://${HOST}/repository/brand-npm/"
VERSION="$(node -p "require('./packages/core/package.json').version")"
PACKAGES=(
  @kolektiv/brand-core
  @kolektiv/brand-react
  @kolektiv/brand-vue
  @kolektiv/brand-svelte
  @kolektiv/brand-solid
  @kolektiv/brand-preact
  @kolektiv/brand-lit
  @kolektiv/brand-angular
  @kolektiv/brand-vanilla
)

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NPMRC="${root}/.npmrc"
backup="$(mktemp)"
cp "${NPMRC}" "${backup}"
trap 'cp "${backup}" "${NPMRC}"; rm -f "${backup}"' EXIT

AUTH="$(printf '%s:%s' "${YURI_CAPITAL_REPO_USERNAME}" "${YURI_CAPITAL_REPO_PASSWORD}" | openssl base64 -A)"
path="${REGISTRY#https://}"
path="${path#http://}"

{
  printf '\n@kolektiv:registry=%s\n' "${REGISTRY}"
  printf '//%s:_auth=%s\n' "${path}" "${AUTH}"
  printf '//%s:always-auth=true\n' "${path}"
} >>"${NPMRC}"

already_published() {
  local pkg="$1"
  npm view "${pkg}@${VERSION}" --registry "${REGISTRY}" >/dev/null 2>&1
}

echo "publishing @kolektiv/brand-*@${VERSION} to ${REGISTRY}"
for pkg in "${PACKAGES[@]}"; do
  if already_published "${pkg}"; then
    echo "already published ${pkg}@${VERSION}, skipping"
    continue
  fi
  pnpm --filter "${pkg}" publish --no-git-checks --access public --registry "${REGISTRY}"
done
