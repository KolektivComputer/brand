import { renderToString } from 'solid-js/web';
import { describe, expect, it } from 'vitest';
import { renderMarkChildren, renderVariantChildren } from '@kolektiv/brand-core';
import { BrandMark, BuiltByMark, ComputingWordmark, IconMark, Wordmark } from '../src/index.js';

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, '');
}

function innerOf(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

describe('@kolektiv/brand-solid', () => {
  it('renders the master mark and forwards attributes', () => {
    const html = stripComments(
      renderToString(() => (
        <BrandMark variant="computingWordmark" title="Kolektiv Computing" />
      )),
    );
    expect(html).toContain('viewBox="0 0 2761 1415"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Kolektiv Computing"');
    expect(innerOf(html)).toBe(
      renderMarkChildren({ variant: 'computingWordmark', title: 'Kolektiv Computing' }),
    );
  });

  it('renders each variant with its own viewBox and hover hooks', () => {
    expect(renderToString(() => <IconMark />)).toContain('viewBox="0 0 468 681"');
    expect(renderToString(() => <Wordmark />)).toContain('viewBox="0 0 2757 691"');
    expect(renderToString(() => <ComputingWordmark />)).toContain('data-kv="wordComputing"');
    expect(renderToString(() => <BuiltByMark />)).toContain('viewBox="0 0 2761 1415"');
  });

  it('maps colors and hover colors to per-part variables', () => {
    const html = renderToString(() => (
      <IconMark
        color="#111111"
        colors={{ iconMark: '#d8a5f0' }}
        hoverColor="#222222"
        hoverColors={{ iconMark: '#ff00ff' }}
      />
    ));
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('--kolektiv-brand-base-hover:#222222');
    expect(html).toContain('--kolektiv-brand-icon-mark-hover:#ff00ff');
  });

  it('renders exactly the shared variant markup', () => {
    const html = stripComments(renderToString(() => <Wordmark />));
    expect(innerOf(html)).toBe(renderVariantChildren('wordmark', {}));
  });
});
