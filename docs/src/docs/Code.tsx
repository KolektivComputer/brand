import { useEffect, useState } from 'react';
import { defaultShikiThemes, shikiThemeForChrome } from '@kolektiv/common-docs-chrome';
import { createHighlighterCore, type HighlighterCore, type ThemeRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import css from 'shiki/langs/css.mjs';
import html from 'shiki/langs/html.mjs';
import json from 'shiki/langs/json.mjs';
import svelte from 'shiki/langs/svelte.mjs';
import ts from 'shiki/langs/ts.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import vue from 'shiki/langs/vue.mjs';
import catppuccinFrappe from 'shiki/themes/catppuccin-frappe.mjs';
import catppuccinLatte from 'shiki/themes/catppuccin-latte.mjs';
import catppuccinMacchiato from 'shiki/themes/catppuccin-macchiato.mjs';
import catppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import nord from 'shiki/themes/nord.mjs';
import { effectiveCodeTheme, useThemePrefs } from './active-theme';

// Presets referenced by the shared theme registry's Shiki ids.
const PRESET_THEMES: Record<string, ThemeRegistration> = {
  'github-light': githubLight,
  'github-dark': githubDark,
  nord,
  'catppuccin-latte': catppuccinLatte,
  'catppuccin-frappe': catppuccinFrappe,
  'catppuccin-macchiato': catppuccinMacchiato,
  'catppuccin-mocha': catppuccinMocha,
};

// The core's theme registry maps every chrome theme id to a Shiki registration
// (a Kolektiv palette object or a preset id). Register them all so the picker
// can switch the highlighter without re-creating it.
const SHIKI_THEMES: ThemeRegistration[] = Object.values(defaultShikiThemes).flatMap((value) => {
  if (typeof value === 'string') {
    const preset = PRESET_THEMES[value];
    return preset ? [preset] : [];
  }
  return value ? [value as ThemeRegistration] : [];
});

function shikiNameFor(chromeThemeId: string): string {
  const value = shikiThemeForChrome(chromeThemeId);
  if (typeof value === 'string') return value;
  return (value as ThemeRegistration).name ?? chromeThemeId;
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: SHIKI_THEMES,
      langs: [tsx, ts, vue, svelte, html, css, bash, json],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

const cache = new Map<string, Promise<string>>();

function highlight(code: string, lang: string, themeName: string): Promise<string> {
  const key = `${themeName}\u0000${lang}\u0000${code}`;
  let promise = cache.get(key);
  if (!promise) {
    promise = getHighlighter().then((highlighter) =>
      highlighter.codeToHtml(code, { lang, theme: themeName }),
    );
    cache.set(key, promise);
  }
  return promise;
}

function Plain({ code, className }: { code: string; className: string }) {
  return (
    <pre
      className={`overflow-auto rounded-lg bg-base-300 p-3 text-[11px] leading-relaxed ${className}`}
    >
      <code>{code}</code>
    </pre>
  );
}

interface CodeProps {
  code: string;
  lang?: string;
  className?: string;
}

export function Code({ code, lang = 'tsx', className = '' }: CodeProps) {
  const { theme, codeTheme } = useThemePrefs();
  const shikiName = shikiNameFor(effectiveCodeTheme(theme, codeTheme));
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (lang === 'text') {
      setHtml('');
      return;
    }
    let alive = true;
    highlight(code, lang, shikiName)
      .then((value) => {
        if (alive) setHtml(value);
      })
      .catch(() => {
        if (alive) setHtml('');
      });
    return () => {
      alive = false;
    };
  }, [code, lang, shikiName]);

  if (lang === 'text' || !html) return <Plain code={code} className={className} />;

  return (
    <div
      className={`code-block overflow-auto text-[12px] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
