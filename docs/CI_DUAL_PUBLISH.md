# Dual-publish (GH Packages npm + JSR)

Org epic: [KolektivComputer/.github#2](https://github.com/KolektivComputer/.github/issues/2)  
Spine (Maven siblings): [gradle-conventions#1](https://github.com/KolektivComputer/gradle-conventions/pull/1) → `computer.kolektiv.publishing`

## npm
- Packages under **`@kolektiv/...` only** (already `@kolektiv/brand-core`, etc.) — do not invent a second JS scope
- Dual: existing Yuri Capital npm **and** `https://npm.pkg.github.com` with `@kolektiv:registry=…`
- Auth: `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` with `permissions.packages: write`

## JSR
- Scope `@kolektiv` (owned); stub `packages/core/jsr.json` for `@kolektiv/brand-core`
- Actions: OIDC only — `permissions.id-token: write` — **no org `JSR_TOKEN`**
- Mey: link package on jsr.io for GitHub Actions trusted publishing
- Not a substitute for npm publish

## Workflow paste (token may lack `workflows` scope)

```yaml
permissions:
  contents: read
  packages: write
  id-token: write  # JSR OIDC
```

```yaml
- uses: actions/setup-node@v4
  with:
    registry-url: https://npm.pkg.github.com
    scope: "@kolektiv"
env:
  NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
- run: npx jsr publish
```

Reference implementation: KolektivComputer/themes `publish.yml` + `.github/scripts/publish-*.sh`.
