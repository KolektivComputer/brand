import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { renderVariantChildren } from '@kolektiv/brand-core';
import BuiltByMark from '../src/lib/BuiltByMark.svelte';
import ComputingWordmark from '../src/lib/ComputingWordmark.svelte';
import IconMark from '../src/lib/IconMark.svelte';
import Wordmark from '../src/lib/Wordmark.svelte';

function renderSvg(component: unknown, props: Record<string, unknown> = {}): string {
  const result = render(component as never, { props } as never) as {
    body?: string;
    html?: string;
  };
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

describe('@kolektiv/brand-svelte per-variant components', () => {
  it('renders each variant with its own viewBox and hover hooks', () => {
    expect(renderSvg(IconMark)).toContain('viewBox="0 0 468 681"');
    expect(renderSvg(Wordmark)).toContain('viewBox="0 0 2757 691"');
    expect(renderSvg(ComputingWordmark)).toContain('data-kv="wordComputing"');
    expect(renderSvg(BuiltByMark)).toContain('viewBox="0 0 2761 1415"');

    const icon = renderSvg(IconMark);
    expect(icon).toContain('kolektiv-brand-hover');
    expect(icon).toContain('data-kv="iconMark"');
    expect(icon).toContain('.kolektiv-brand-hover:hover [data-kv="iconMark"]');
  });

  it('maps colors and hover colors to per-part variables', () => {
    const html = renderSvg(IconMark, {
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
    const html = renderSvg(Wordmark, { title: 'Kolektiv' });
    expect(innerOf(html)).toBe(renderVariantChildren('wordmark', { title: 'Kolektiv' }));
  });
});
