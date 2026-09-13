import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const theme = readFileSync(new URL('../theme.css', import.meta.url), 'utf8');

describe('@kolektiv/brand-core theme.css', () => {
  it('maps primary to the icon mark and to the faded words', () => {
    expect(theme).toContain('--kolektiv-brand-icon-mark: var(--kolektiv-brand-primary)');
    expect(theme).toContain('var(--kolektiv-brand-primary) 75%');
    expect(theme).toContain('var(--kolektiv-brand-primary) 80%');
    expect(theme).toContain('--kolektiv-brand-word-olektiv');
    expect(theme).toContain('--kolektiv-brand-word-computing');
  });

  it('reads daisyUI theme tokens with a currentColor fallback', () => {
    expect(theme).toContain('var(--color-primary, currentColor)');
    expect(theme).toContain('var(--color-neutral, currentColor)');
  });

  it('supports switching built-by to the neutral token', () => {
    expect(theme).toContain('--kolektiv-brand-built-by-source');
    expect(theme).toContain('.kolektiv-brand-built-by-neutral');
    expect(theme).toContain("[data-kolektiv-brand-built-by='neutral']");
    expect(theme).toContain('var(--kolektiv-brand-neutral)');
  });

  it('scopes to :root and .kolektiv-brand-theme', () => {
    expect(theme).toContain(':root,');
    expect(theme).toContain('.kolektiv-brand-theme');
  });
});
