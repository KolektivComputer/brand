import { describe, expect, it } from 'vitest';
import { renderVariantChildren } from '@kolektiv/brand-core';
import {
  brandVariantMarkup,
  builtByMarkMarkup,
  computingWordmarkMarkup,
  createBrandVariant,
  createIconMark,
  iconMarkMarkup,
  wordmarkMarkup,
} from '../src/index.js';

function innerOf(svg: string): string {
  const match = svg.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

describe('@kolektiv/brand-vanilla per-variant helpers', () => {
  it('renders each variant with its own viewBox and hover hooks', () => {
    expect(iconMarkMarkup()).toContain('viewBox="0 0 468 681"');
    expect(wordmarkMarkup()).toContain('viewBox="0 0 2757 691"');
    expect(computingWordmarkMarkup()).toContain('data-kv="wordComputing"');
    expect(builtByMarkMarkup()).toContain('viewBox="0 0 2761 1415"');

    const icon = iconMarkMarkup();
    expect(icon).toContain('kolektiv-brand-hover');
    expect(icon).toContain('data-kv="iconMark"');
    expect(icon).toContain('.kolektiv-brand-hover:hover [data-kv="iconMark"]');
  });

  it('maps colors and hover colors to per-part variables', () => {
    const html = brandVariantMarkup('iconMark', {
      color: '#111111',
      colors: { iconMark: '#d8a5f0' },
      hoverColor: '#222222',
      hoverColors: { iconMark: '#ff00ff' },
    });
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('--kolektiv-brand-base-hover:#222222');
    expect(html).toContain('--kolektiv-brand-icon-mark-hover:#ff00ff');
  });

  it('renders exactly the shared variant markup', () => {
    expect(innerOf(iconMarkMarkup({ title: 'Kolektiv' }))).toBe(
      renderVariantChildren('iconMark', { title: 'Kolektiv' }),
    );
  });

  it('creates live svg elements for each variant', () => {
    const icon = createIconMark({ hoverColor: '#d8a5f0' });
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon.getAttribute('viewBox')).toBe('0 0 468 681');
    expect(icon.getAttribute('style')).toContain('--kolektiv-brand-base-hover:#d8a5f0');
    expect(icon.getAttribute('class')).toContain('kolektiv-brand-hover');

    const wordmark = createBrandVariant('wordmark');
    expect(wordmark.getAttribute('viewBox')).toBe('0 0 2757 691');
  });
});
