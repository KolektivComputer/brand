# Kolektiv brand

Framework-agnostic components for the Kolektiv brand mark. One source SVG is compiled
into a typed AST, then rendered by wrapper packages for every framework we build in
(React, Vue, Svelte, Solid, Preact, Lit, Angular) plus a vanilla custom element, all
sharing **exactly the same inner markup** and the same public API.

## Brand typography

Official Kolektiv projects use these typefaces **unless they have their own brand identity**:

| role | typeface | usage |
| --- | --- | --- |
| Display | **Inclusive Sans** | Weight 300, *italic* — headings, hero lines, brand statements; never bold |
| Body | **Source Sans 3** | Regular 400 / semibold 600 for body copy and labels |
| Code | **Iosevka** | Code blocks and anything technical (same mono as Keel) |

The docs site loads them from Fontsource and uses them via Tailwind theme tokens
(`--font-display`, `--font-sans`, `--font-mono`); see the [Typography](docs/src/docs/pages/Typography.tsx)
page at `/typography` for specimens.

## Themes (`@kolektiv/themes`)

All theme **colours** live in the separate
[KolektivComputer/themes](https://github.com/KolektivComputer/themes) repository and are
published as `@kolektiv/themes`, fetched here from the aggregated `npm-public` group (see
`.npmrc`). It renders one colour-only source out to several targets:

| entry | output |
| --- | --- |
| `@kolektiv/themes` | `themes`, `getTheme`, `shikiThemeFor`, `themeCss`, `allThemeCss` |
| `@kolektiv/themes/theme.css` | daisyUI-compatible `[data-theme]` colour variables |
| `@kolektiv/themes/shiki` | Shiki theme registrations (Kolektiv light/dark) |
| `@kolektiv/themes/tokens.json` | raw tokens for Compose / other platforms |

**Colour-only by design** — a theme declares `color-scheme` and the twenty daisyUI colour
variables; each app owns its radii, sizes, borders and density. Themes: `nord`,
`catppuccin-latte/frappe/macchiato/mocha` (extracted from Keel), and
`kolektiv-light/dark` (legacy `kolektivcomputer-*` ids are aliased). Each maps to a Shiki analog (`light`/`dark` → GitHub
light/dark, `nord` → `nord`, catppuccin → catppuccin, kolektiv → kolektiv), so code blocks
follow the selected theme.

Add a palette (or a Nord dark variant) in
[`KolektivComputer/themes`](https://github.com/KolektivComputer/themes) (`packages/themes/src/tokens.mjs`),
tag it, and bump the dependency here; every consumer picks it up.

## Workspace layout

```
.
├── marks/svg/built by kolektiv computing mark.svg   # canonical source artwork (do not edit in place)
├── scripts/generate.mjs                              # SVG -> AST -> generated TS
├── packages/
│   ├── core      (@kolektiv/brand-core)              # generated data + renderers (no runtime deps)
│   ├── react     (@kolektiv/brand-react)
│   ├── vue       (@kolektiv/brand-vue)
│   ├── svelte    (@kolektiv/brand-svelte)
│   ├── solid     (@kolektiv/brand-solid)
│   ├── preact    (@kolektiv/brand-preact)
│   ├── lit       (@kolektiv/brand-lit)
│   ├── angular   (@kolektiv/brand-angular)
│   └── vanilla   (@kolektiv/brand-vanilla)
├── docs/         (@kolektiv/brand-docs)              # docs site + kitchen sink, built to repo-root dist/
├── .github/workflows/                               # ci, pages, publish, release
└── .github/scripts/                                 # publish-npm, verify-npm-resolution, changelog-section
```

The shared colour tokens live in their own repository,
**[KolektivComputer/themes](https://github.com/KolektivComputer/themes)**, published as
`@kolektiv/themes` and consumed here from the `npm-public` group.

Requirements: Node >= 20 and pnpm (the repo pins `packageManager`). First run:

```bash
corepack enable
pnpm install
pnpm generate
```

Useful scripts (from the repo root):

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the docs site dev server |
| `pnpm build` | Build the docs site into `dist/` (static site artifact) |
| `pnpm preview` | Preview the built docs site |
| `pnpm check` | Type-check the docs site |
| `pnpm generate` | Regenerate `packages/core/src/generated/*` from the source SVGs |
| `pnpm normalize:marks` | Normalize the exported per-variant SVGs |
| `pnpm typecheck` | Type-check every workspace project |
| `pnpm test` | Run the package tests |
| `pnpm build:packages` | Build the publishable packages |
| `pnpm pack:packages` / `pnpm publish:packages` | Pack/publish to the `brand-npm` repository |

## The SVG -> generated-mark pipeline

`marks/svg/built by kolektiv computing mark.svg` is the **single source of truth**.

`scripts/generate.mjs` (dependency-free Node ESM, deterministic and idempotent):

1. tokenizes the SVG and parses a stack-based AST,
2. discovers every element with an `id` as a *part* (document order, parent/depth/children),
3. mechanically derives a camelCase `key`, a `--kolektiv-brand-*` CSS variable and a
   human label from each raw id,
4. writes `packages/core/src/generated/mark.ts` and
   `packages/core/src/generated/variants.ts`.

```bash
pnpm generate
```

The generated files are committed but **must never be hand-edited** — re-running the
generator must produce byte-identical output. `packages/core/src/mark.ts` (hand-written)
imports the metadata and implements the shared rendering semantics.

The individual variants can also be exported as standalone SVGs into `marks/svg/` (for
example `kolektiv icon mark.svg`). `scripts/normalize-marks.mjs` cleans those exports —
`fill="currentColor"` on every path, no single-child groups, and part ids consistent with
the master:

```bash
pnpm normalize:marks
```

## Parts

Keys are derived mechanically from ids (`snake_case` -> `camelCase`).

| key | source id | CSS variable | parent | depth |
| --- | --- | --- | --- | --- |
| `builtByKolektivComputing` | `built_by_kolektiv_computing` | `--kolektiv-brand-built-by-kolektiv-computing` | — | 0 |
| `wordBuiltBy` | `word_built_by` | `--kolektiv-brand-word-built-by` | `builtByKolektivComputing` | 1 |
| `kolektivComputingWordmark` | `kolektiv_computing_wordmark` | `--kolektiv-brand-kolektiv-computing-wordmark` | `builtByKolektivComputing` | 1 |
| `wordComputing` | `word_computing` | `--kolektiv-brand-word-computing` | `kolektivComputingWordmark` | 2 |
| `kolektivWordmark` | `kolektiv_wordmark` | `--kolektiv-brand-kolektiv-wordmark` | `kolektivComputingWordmark` | 2 |
| `wordOlektiv` | `word_olektiv` | `--kolektiv-brand-word-olektiv` | `kolektivWordmark` | 3 |
| `iconMark` | `icon_mark` | `--kolektiv-brand-icon-mark` | `kolektivWordmark` | 3 |

Every part defaults to `color: var(--kolektiv-brand-<part>, inherit)`, so the whole mark
inherits the page `color` unless you override a part.

## Variants

A variant selects a sensible subset. Container parts stay visible whenever one of their
descendants is selected.

| variant | selected parts | hides |
| --- | --- | --- |
| `full` | all parts | — |
| `builtByMark` | `wordBuiltBy`, `wordOlektiv`, `wordComputing` | `iconMark` |
| `computingWordmark` | `iconMark`, `wordOlektiv`, `wordComputing` | `wordBuiltBy` |
| `wordmark` | `iconMark`, `wordOlektiv` | `wordBuiltBy`, `wordComputing` |
| `iconMark` | `iconMark` | `wordBuiltBy`, `wordComputing`, `wordOlektiv` |

## Per-variant components (hoverable)

Each variant also ships as its own component. It renders a tightly-cropped standalone SVG
and supports CSS `:hover` colours per part: a `<style>` block with the hover rules is baked
into the markup and scoped by the `kolektiv-brand-hover` class on the root `<svg>`.

| package | exports |
| --- | --- |
| `@kolektiv/brand-react` | `IconMark`, `Wordmark`, `ComputingWordmark`, `BuiltByMark` |
| `@kolektiv/brand-vue` | `IconMark`, `Wordmark`, `ComputingWordmark`, `BuiltByMark` |
| `@kolektiv/brand-svelte` | `IconMark`, `Wordmark`, `ComputingWordmark`, `BuiltByMark` |
| `@kolektiv/brand-solid` | `IconMark`, `Wordmark`, `ComputingWordmark`, `BuiltByMark` |
| `@kolektiv/brand-preact` | `IconMark`, `Wordmark`, `ComputingWordmark`, `BuiltByMark` |
| `@kolektiv/brand-lit` | `brandMarkTemplate` / `brandVariantTemplate` + `kolektiv-*-mark` elements |
| `@kolektiv/brand-angular` | `KolektivBrandMark`, `KolektivIconMark`, `KolektivWordmark`, `KolektivComputingWordmark`, `KolektivBuiltByMark` |
| `@kolektiv/brand-vanilla` | `iconMarkMarkup` / `createIconMark`, `wordmarkMarkup` / `createWordmark`, `computingWordmarkMarkup` / `createComputingWordmark`, `builtByMarkMarkup` / `createBuiltByMark` |

Props: `colors` (per-part base colour), `hoverColors` (per-part hover colour), `color`
(base colour), `hoverColor` (base hover colour), `title`, `className`/`class`, `style`,
plus any native SVG attribute (`width`, `height`, `id`, `aria-*`, `data-*`, …), which is
forwarded to the root `<svg>`.

```tsx
import { ComputingWordmark } from '@kolektiv/brand-react';

<ComputingWordmark
  className="h-20 w-auto"
  colors={{ iconMark: '#1c1720', wordComputing: '#1c1720', wordOlektiv: '#1c1720' }}
  hoverColor="#d8a5f0"
  hoverColors={{ wordOlektiv: '#c9a9ee' }}
  title="Kolektiv Computing"
  style={{ opacity: 0.9 }}
/>;
```

Hover is per graphic, per group: each leaf group/path carries `data-kv="<part>"`, and the
baked rules switch every group to its own hover colour when the whole graphic is hovered:

```css
.kolektiv-brand-hover:hover [data-kv='iconMark'] {
  color: var(
    --kolektiv-brand-icon-mark-hover,
    var(--kolektiv-brand-base-hover, var(--kolektiv-brand-icon-mark, inherit))
  ) !important;
}
```

Set `hoverColors` per part (and/or `hoverColor` as a fallback) to control each group's hover
colour independently while the whole mark acts as the hover target.

## Props

All four wrappers accept the same props:

| prop | type | description |
| --- | --- | --- |
| `colors` | `Partial<Record<BrandMarkPart, string>>` | per-part color; emitted as `--kolektiv-brand-*` on the root `<svg>` |
| `parts` | `Partial<Record<BrandMarkPart, boolean>>` | per-part visibility; `false` hides that part and its subtree |
| `variant` | `'full' \| 'builtByMark' \| 'computingWordmark' \| 'wordmark' \| 'iconMark'` | preset subset |
| `color` | `string` | base color applied to the root `<svg>` (`style.color`) |
| `title` | `string` | when set, adds `<title>`, `role="img"` and `aria-label`; otherwise `aria-hidden="true"` |
| `className` / `class` | `string` | extra classes on the root `<svg>`; size with utilities such as `h-16 w-auto` |
| `style` | `Record<string, string \| number>` | root styles (merged before `colors`); size with `width`/`height` here |
| `attributes` | `Record<string, string \| number \| boolean>` | vanilla string API only: extra root SVG attributes |

Any other native SVG attribute is forwarded to the root `<svg>` (React/Vue/Svelte spread
it; vanilla takes it via `attributes`). The root carries `width="100%"`, so by default it
is responsive and height follows the viewBox ratio; pass `className`, `style` or native
`width`/`height` to size it. These are attributes, so CSS classes (e.g. Tailwind `h-16
w-auto`) win over the default.

## Usage

### React

```tsx
import { BrandMark } from '@kolektiv/brand-react';

export function Header() {
  return (
    <BrandMark
      variant="computingWordmark"
      title="Kolektiv Computing"
      colors={{ iconMark: '#d8a5f0', wordOlektiv: '#c9a9ee' }}
      style={{ maxWidth: 320 }}
    />
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { BrandMark } from '@kolektiv/brand-vue';
</script>

<template>
  <BrandMark
    variant="wordmark"
    title="Kolektiv"
    :parts="{ iconMark: true, wordOlektiv: true, wordComputing: false }"
  />
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { BrandMark } from '@kolektiv/brand-svelte';
</script>

<BrandMark variant="builtByMark" title="Built by Kolektiv Computing" color="#1c1720" />
```

### Vanilla

```ts
import { createBrandMark, defineBrandMarkElement } from '@kolektiv/brand-vanilla';

// Imperative helper
document.body.append(createBrandMark({ variant: 'iconMark', title: 'Kolektiv' }));

// Custom element (shadow DOM; a no-op in SSR)
defineBrandMarkElement();
const mark = document.createElement('kolektiv-brand-mark');
mark.setAttribute('width', '240');
document.body.append(mark);
```

## Overriding colors from plain CSS

Set the variables on any ancestor (they are inherited) — no JS needed:

```css
.brand {
  color: #1c1720;
}

.brand--dark {
  background: #2b1d30; /* dark plum */
  color: #c9a9ee;      /* lavender words */
  --kolektiv-brand-icon-mark: #d8a5f0;      /* pink K */
  --kolektiv-brand-word-olektiv: #c9a9ee;
  --kolektiv-brand-word-built-by: #c9a9ee;
  --kolektiv-brand-word-computing: #c9a9ee;
}
```

```html
<kolektiv-brand-mark class="brand brand--dark"></kolektiv-brand-mark>
```

Custom properties pierce the custom element's shadow DOM, so the CSS-only card in the
playground uses exactly this technique (including the dark lilac preset).

## Theming app-wide (brand theme)

`@kolektiv/brand-core` ships `theme.css`, which glues your colour tokens (daisyUI theme
variables by default) to the brand parts so you can recolour the whole app with no JS:

```ts
import '@kolektiv/brand-core/theme.css';
// or, from a wrapper package:
// import '@kolektiv/brand-react/theme.css';
```

```css
:root,
.kolektiv-brand-theme {
  --kolektiv-brand-icon-mark: var(--kolektiv-brand-primary);          /* K */
  --kolektiv-brand-word-olektiv: color-mix(in srgb,                    /* "olektiv" */
    var(--kolektiv-brand-primary) 75%, transparent);
  --kolektiv-brand-word-computing: color-mix(in srgb,                  /* "computing" */
    var(--kolektiv-brand-primary) 80%, transparent);
  --kolektiv-brand-word-built-by: color-mix(in srgb,                   /* "Built by" */
    var(--kolektiv-brand-built-by-source, var(--kolektiv-brand-primary)) 80%, transparent);
}
```

- `--kolektiv-brand-primary` defaults to `var(--color-primary, currentColor)` and
  `--kolektiv-brand-neutral` to `var(--color-neutral, currentColor)`, so the theme follows
  the active daisyUI theme automatically.
- The rules apply to `:root` **and** to any `.kolektiv-brand-theme` container, so you can
  theme a subtree instead of the whole document.
- Per-instance `colors` / `hoverColors` props still win (they are written inline on the
  component root).

### Built by from neutral

The Figma mapping uses primary at 80% for the "Built by" text. To explore pulling it from
the neutral token instead (opacity kept), add the class to any ancestor or the data
attribute to `<html>`:

```html
<html data-kolektiv-brand-built-by="neutral">
<!-- or -->
<div class="kolektiv-brand-theme kolektiv-brand-built-by-neutral">…</div>
```

Custom properties pierce the custom element's shadow DOM, so this works for the vanilla
custom element too.

## Publishing & releases

The nine packages under `packages/*` are publishable (public, scoped to `@kolektiv`); the
`docs` site is private and `@kolektiv/themes` lives in its own repository. Each package
ships `dist` (+ `theme.css` where relevant) and `LICENSE`, and builds before publish.

**Registry model (mirrors Keel):**

- **Publish** to the per-project hosted repository `brand-npm`:
  `https://repo.yuri.capital/repository/brand-npm/`
- **Fetch** from the aggregated group **`npm-public`**, which contains every public
  Kolektiv project repo (`brand-npm`, `keel-npm`, …):
  `https://repo.yuri.capital/repository/npm-public/`. This is configured repo-wide in
  `.npmrc`, so consumers and other Kolektiv projects only ever reference `npm-public`.

```bash
# from the repo root
pnpm build:packages      # build the publishable packages
pnpm pack:packages       # inspect the tarballs without publishing
pnpm publish:packages    # publish to brand-npm (CI uses .github/scripts/publish-npm.sh)
```

`@kolektiv/brand-core` is a workspace dependency of the wrappers
(`"@kolektiv/brand-core": "workspace:^"`); pnpm rewrites it to `^<version>` in the
published tarball. Keep the package `version` fields in sync across the workspace.

**Tagging/versioning is tag-driven, the same as Keel:**

1. Bump `version` in the packages and add a `## [x.y.z] - <date>` section to
   `CHANGELOG.md`.
2. `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. `.github/workflows/release.yml` creates/updates the GitHub Release from the changelog
   section (`*SNAPSHOT*` versions become prereleases).
4. `.github/workflows/publish.yml` builds, publishes to `brand-npm`, then verifies
   resolution anonymously from `npm-public` (`.github/scripts/verify-npm-resolution.sh`).

Secrets: `YURI_CAPITAL_REPO_USERNAME`, `YURI_CAPITAL_REPO_PASSWORD`.

### Docs deployment

Cloudflare Pages builds and deploys the docs site through its Git integration on
pushes to `main` (project `brand-docs`): `pnpm build` emits the repo-root `dist/`.
Set the `VITE_DOCS_SITE` build environment variable to the deployed origin; the Vite
build uses `base: './'`, so the same artifact works at a custom domain or a project
subpath.

## Updating the artwork

1. Replace `marks/svg/built by kolektiv computing mark.svg` with the new export. Keep the
   root `<svg>` carrying `width`, `height` and `viewBox`, give every logical group/path a
   unique `id`, and keep `fill="currentColor"` on drawable paths.
2. Run `pnpm generate` and review the printed part table.
3. Run `pnpm typecheck && pnpm test && pnpm build:packages && pnpm build`.

The generator validates the root tag, balanced tags and leftovers, and fails loudly if
the structure is not parseable. Ids are the contract: adding or renaming ids changes the
generated keys, CSS variables and the `BrandMarkPart` union.

## Docs site

```bash
pnpm dev       # dev server on :8080
pnpm build     # static site -> dist/
pnpm preview   # preview the build on :8081
```

The Vite + React docs site lives in [`docs/`](docs) (`@kolektiv/brand-docs`), is published at
**https://brand.kolektiv.computer**, and explains that this is the Kolektiv branding
published as components for different frameworks (brand guides will be added later). It has
pages for Overview, Getting started, Marks, Components, Theming, Typography, Themes, the
Kitchen sink and Publishing. Code blocks are highlighted with Shiki, using the analog of
the selected theme (GitHub light/dark by default, plus Nord and the Catppuccin flavours);
the sidebar carries the live playground controls that drive every preview.

The **Marks** gallery lists every mark ([`MarksGallery.tsx`](docs/src/example/MarksGallery.tsx))
at a sensible height (icon mark 72, wordmark 40, computing wordmark 80, built-by 90), each
with a **static** and a **hoverable** usage side by side, plus a **Show code** toggle whose
snippet is generated from the current store colours.

One large example page (React) lives in a daisyUI `mockup-browser`
(`docs/src/example/KitchenSink.tsx`) and the same viewport swaps between preview and code:
the address bar (`kolektiv.computer`) becomes a title bar (`KitchenSink.tsx`) showing the
Shiki-highlighted source, with a **Show code** / **Show preview** button on the right. The
example is:

- navbar with the **"Kolektiv"** `Wordmark`, fake links, and a **"My account"** button whose
  icon is only the mark with a local `colors={{ iconMark: 'currentColor' }}` override;
- hero with the **"Kolektiv Computing"** `ComputingWordmark` and CTAs (one with a locally
  overridden icon);
- a dark panel with local dark-lilac overrides for `IconMark` / `Wordmark` /
  `ComputingWordmark`;
- a full footer with four link columns, the full `BuiltByMark`, and a short byline under it;
- a final section showing the same built-by mark themed with
  `@kolektiv/brand-core/theme.css` only (no inline colours).

Local overrides always win over the app-wide theme, which is how individual pieces (button
icons, one-off marks on dark surfaces) are recoloured without touching the global variables.

The control panel sets **base** and **hover** colours per part. Colours are picked from the
active daisyUI/Tailwind theme tokens (`primary`, `secondary`, `accent`, `neutral`,
`base-content`, `info`, `success`, `warning`, `error`) via swatches, with an inline numeric
opacity input per row producing values like
`color-mix(in srgb, var(--color-primary) 75%, transparent)`. Hover is applied to the whole
graphic while each group keeps its own hover token/opacity. **Figma defaults** restores the
primary mapping (K 100%, olektiv 75%, computing/built-by 80%) and the sample hover colours;
the **built by** button switches the CSS-only section to the neutral token.

The UI is built with Tailwind CSS v4 + daisyUI 5. Two custom daisyUI themes are registered
in `docs/src/style.css` — `kolektiv-dark` (default) and `kolektiv-light` —
alongside the built-in `light`/`dark`.
