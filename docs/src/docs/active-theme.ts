import { useSyncExternalStore } from 'react';
import {
  allChromeThemes,
  applyPrefs,
  groupChromeThemes,
  readPrefs,
  resolveTheme,
  themesByFamily,
  type ChromePrefs,
  type ChromeThemeGroup,
  type PrefOptions,
  type ThemeFamily,
} from '@kolektiv/common-docs-chrome';

/**
 * Brand site theme/prefs adapter over `@kolektiv/common-docs-chrome`.
 *
 * The shared core is DOM-first: `readPrefs`/`applyPrefs` persist to
 * `localStorage` and reflect onto `<html data-theme data-code-theme>`, while
 * `syncControls` drives `[data-pref]` controls. React owns its own control
 * state, so here we only wrap the read/apply half and expose the core's theme
 * registry to JSX. `syncControls`/`initChrome` are intentionally not used.
 */

export const DEFAULT_THEME = 'kolektiv-dark';
export const DEFAULT_CODE_THEME = 'follow';

/** Site-first family order: Kolektiv, then the other shared palettes. */
export const THEME_FAMILY_ORDER: ThemeFamily[] = ['kolektiv', 'catppuccin', 'nord', 'daisyui'];

export const CHROME_THEMES = allChromeThemes();
export const THEMES_BY_FAMILY = themesByFamily(CHROME_THEMES);
export const THEME_GROUPS: ChromeThemeGroup[] = groupChromeThemes(
  CHROME_THEMES,
  THEME_FAMILY_ORDER,
);

export const PREFS_OPTIONS: PrefOptions = {
  defaultTheme: DEFAULT_THEME,
  defaultCodeTheme: DEFAULT_CODE_THEME,
  themes: CHROME_THEMES.map((theme) => theme.id),
};

const DEFAULT_PREFS: ChromePrefs = {
  theme: DEFAULT_THEME,
  codeTheme: DEFAULT_CODE_THEME,
  lang: '',
  framework: '',
};

// `useSyncExternalStore` requires a stable snapshot reference. The core
// dispatches `kdc:prefs` on every `applyPrefs`, so we cache the last value and
// refresh it from that event.
let snapshot: ChromePrefs | null = null;

function readSnapshot(): ChromePrefs {
  snapshot ??= readPrefs(PREFS_OPTIONS);
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  const onPrefs = (event: Event): void => {
    snapshot = (event as CustomEvent<ChromePrefs>).detail ?? readPrefs(PREFS_OPTIONS);
    listener();
  };
  document.addEventListener('kdc:prefs', onPrefs);
  return () => document.removeEventListener('kdc:prefs', onPrefs);
}

export function getPrefs(): ChromePrefs {
  return readSnapshot();
}

export function setPrefs(patch: Partial<ChromePrefs>): ChromePrefs {
  snapshot = applyPrefs(patch, PREFS_OPTIONS);
  return snapshot;
}

export function useThemePrefs(): ChromePrefs {
  return useSyncExternalStore(subscribe, readSnapshot, () => DEFAULT_PREFS);
}

export function useActiveTheme(): string {
  return useThemePrefs().theme;
}

export function useActiveCodeTheme(): string {
  return useThemePrefs().codeTheme;
}

export function setActiveTheme(id: string): void {
  setPrefs({ theme: id });
}

export function setActiveCodeTheme(id: string): void {
  setPrefs({ codeTheme: id });
}

/** The chrome theme whose Shiki registration code blocks should use. */
export function effectiveCodeTheme(theme: string, codeTheme: string): string {
  return codeTheme && codeTheme !== DEFAULT_CODE_THEME ? codeTheme : theme;
}

export function schemeFor(id: string): 'light' | 'dark' {
  return resolveTheme(id, CHROME_THEMES)?.scheme ?? 'dark';
}
