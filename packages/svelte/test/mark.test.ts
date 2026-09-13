import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { renderMarkChildren } from '@kolektiv/brand-core';
import BrandMark from '../src/lib/BrandMark.svelte';

function renderSvg(props: Record<string, unknown> = {}): string {
  const result = render(BrandMark, { props }) as { body?: string; html?: string };
  return stripComments(result.body ?? result.html ?? '');
}

function innerOf(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, '');
}

describe('@kolektiv/brand-svelte BrandMark', () => {
  it('exposes per-part style hooks and colors', () => {
    const html = renderSvg({ colors: { iconMark: '#d8a5f0' }, color: '#c9a9ee' });
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('color:#c9a9ee');
    expect(html).toContain('color:var(--kolektiv-brand-icon-mark, inherit)');
    expect(html).toContain('color:var(--kolektiv-brand-word-olektiv, inherit)');
  });

  it('omits hidden parts', () => {
    const html = renderSvg({ parts: { iconMark: false } });
    expect(html).not.toContain('id="icon_mark"');
    expect(html).toContain('id="word_olektiv"');
  });

  it('renders exactly the shared inner markup', () => {
    const options = { parts: { wordBuiltBy: false }, variant: 'computingWordmark' as const };
    const html = renderSvg(options);
    expect(stripComments(innerOf(html))).toBe(renderMarkChildren(options));
  });

  it('sets role/aria-label and a title element when titled', () => {
    const html = renderSvg({ title: 'Kolektiv' });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Kolektiv"');
    expect(html).toContain('<title>Kolektiv</title>');
    expect(html).not.toContain('aria-hidden');
  });

  it('is aria-hidden without a title', () => {
    const html = renderSvg();
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
  });
});
