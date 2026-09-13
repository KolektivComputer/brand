import { describe, expect, it } from 'vitest';
import { renderMarkChildren } from '@kolektiv/brand-core';
import { brandMarkMarkup, createBrandMark } from '../src/index.js';

function innerOf(svg: string): string {
  const match = svg.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

describe('@kolektiv/brand-vanilla string API', () => {
  it('exposes per-part style hooks and colors', () => {
    const html = brandMarkMarkup({ colors: { iconMark: '#d8a5f0' }, color: '#c9a9ee' });
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('color:#c9a9ee');
    expect(html).toContain('color:var(--kolektiv-brand-icon-mark, inherit)');
    expect(html).toContain('color:var(--kolektiv-brand-word-olektiv, inherit)');
  });

  it('omits hidden parts', () => {
    const html = brandMarkMarkup({ parts: { iconMark: false } });
    expect(html).not.toContain('id="icon_mark"');
    expect(html).toContain('id="word_olektiv"');
  });

  it('renders exactly the shared inner markup', () => {
    const options = { parts: { wordBuiltBy: false }, variant: 'computingWordmark' as const };
    expect(innerOf(brandMarkMarkup(options))).toBe(renderMarkChildren(options));
  });

  it('sets accessibility attributes', () => {
    expect(brandMarkMarkup()).toContain('aria-hidden="true"');
    const titled = brandMarkMarkup({ title: 'Kolektiv' });
    expect(titled).toContain('role="img"');
    expect(titled).toContain('aria-label="Kolektiv"');
    expect(titled).toContain('<title>Kolektiv</title>');
  });
});

describe('@kolektiv/brand-vanilla DOM API', () => {
  it('creates a live svg element', () => {
    const svg = createBrandMark({ colors: { wordOlektiv: 'rgb(1, 2, 3)' } });
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 2761 1415');
    expect(svg.getAttribute('style')).toContain('--kolektiv-brand-word-olektiv:rgb(1, 2, 3)');
    expect(svg.querySelector('#icon_mark')).not.toBeNull();
    expect(createBrandMark({ parts: { iconMark: false } }).querySelector('#icon_mark')).toBeNull();
  });
});
