import { themes } from '@kolektiv/themes';
import { setActiveTheme } from '../active-theme';
import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

const SWATCH_KEYS = ['base-100', 'base-200', 'base-300', 'primary', 'secondary', 'accent', 'neutral'];

export function Themes() {
  return (
    <div>
      <PageTitle>Themes</PageTitle>
      <Lead>
        All Kolektiv themes live in one colour-only source (<code>@kolektiv/themes</code>) and are
        rendered out to daisyUI CSS variables, Shiki themes and <code>tokens.json</code> for other
        platforms. Apps own their radii, sizes and density regardless of the theme colours.
      </Lead>

      <Section title="Available">
        <div className="grid gap-3 sm:grid-cols-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setActiveTheme(theme.id)}
              className="rounded-xl border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{theme.label}</span>
                <span className="text-[11px] uppercase tracking-wide opacity-50">
                  {theme.scheme}
                </span>
              </div>
              <div className="mt-3 flex gap-1">
                {SWATCH_KEYS.map((key) => (
                  <span
                    key={key}
                    className="h-6 flex-1 rounded"
                    style={{ background: theme.colors[key] }}
                    title={`${key}: ${theme.colors[key]}`}
                  />
                ))}
              </div>
              <code className="mt-2 block font-mono text-[10px] opacity-50">{theme.id}</code>
            </button>
          ))}
        </div>
        <p className="text-xs opacity-60">Click a theme to preview it across the site.</p>
      </Section>

      <Section title="Colour-only by design">
        <p className="text-sm opacity-80">
          A theme only declares the daisyUI colour variables and <code>color-scheme</code>. Radii,
          sizes, borders, depth and density belong to each app, so one palette can be used with
          different shapes.
        </p>
        <CodeSample
          lang="css"
          code={`/* @kolektiv/themes/theme.css (excerpt) */
html[data-theme='nord'],
[data-theme='nord'] {
  color-scheme: light;
  --color-base-100: oklch(95.127% 0.007 260.731);
  --color-primary: oklch(59.435% 0.077 254.027);
  /* … */
}`}
        />
      </Section>

      <Section title="One source, many targets">
        <CodeSample
          lang="ts"
          code={`import { themes, shikiThemeFor } from '@kolektiv/themes';
import '@kolektiv/themes/theme.css';                    // daisyUI colour variables
import { kolektivDark } from '@kolektiv/themes/shiki';   // Shiki registrations

shikiThemeFor('light');                 // 'github-light'
shikiThemeFor('dark');                  // 'github-dark'
shikiThemeFor('nord');                  // 'nord'
shikiThemeFor('catppuccin-mocha');      // 'catppuccin-mocha'
shikiThemeFor('kolektiv-dark'); // 'kolektiv-dark'`}
        />
        <CodeSample
          lang="json"
          code={`// @kolektiv/themes/tokens.json — for Compose and other platforms
{
  "themes": [
    { "id": "nord", "scheme": "light", "colors": { "base-100": "oklch(…)" } }
  ]
}`}
        />
      </Section>

      <Section title="daisyUI → Shiki pairs">
        <ul className="space-y-1 text-sm opacity-80">
          <li>
            <code>light</code> → <code>github-light</code>, <code>dark</code> →{' '}
            <code>github-dark</code>
          </li>
          <li>
            <code>nord</code> → <code>nord</code>
          </li>
          <li>
            <code>catppuccin-*</code> → <code>catppuccin-*</code>
          </li>
          <li>
            <code>kolektiv-*</code> → <code>kolektiv-light</code> /{' '}
            <code>kolektiv-dark</code>
          </li>
        </ul>
      </Section>

      <Section title="Roadmap">
        <p className="text-sm opacity-80">
          These tokens are the shared colour layer for everything Kolektiv: daisyUI and Shiki
          today, and a Compose (plus any future headless UI) styling system later — all generated
          from one source so a palette is only ever defined once. A Nord dark variant and more
          palettes can be added here without touching any consumer.
        </p>
      </Section>
    </div>
  );
}
