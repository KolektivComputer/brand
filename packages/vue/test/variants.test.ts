import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { renderVariantChildren } from '@kolektiv/brand-core';
import { BuiltByMark, ComputingWordmark, IconMark, Wordmark } from '../src/index.js';

async function renderSvg(
  component: Parameters<typeof h>[0],
  props: Record<string, unknown> = {},
): Promise<string> {
  const app = createSSRApp({ render: () => h(component, props) });
  return renderToString(app);
}

function innerOf(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, '');
}

describe('@kolektiv/brand-vue per-variant components', () => {
  it('renders each variant with its own viewBox and hover hooks', async () => {
    expect(await renderSvg(IconMark)).toContain('viewBox="0 0 468 681"');
    expect(await renderSvg(Wordmark)).toContain('viewBox="0 0 2757 691"');
    expect(await renderSvg(ComputingWordmark)).toContain('data-kv="wordComputing"');
    expect(await renderSvg(BuiltByMark)).toContain('viewBox="0 0 2761 1415"');

    const icon = await renderSvg(IconMark);
    expect(icon).toContain('kolektiv-brand-hover');
    expect(icon).toContain('data-kv="iconMark"');
    expect(icon).toContain('.kolektiv-brand-hover:hover [data-kv="iconMark"]');
  });

  it('maps colors and hover colors to per-part variables', async () => {
    const html = await renderSvg(IconMark, {
      color: '#111111',
      colors: { iconMark: '#d8a5f0' },
      hoverColor: '#222222',
      hoverColors: { iconMark: '#ff00ff' },
    });
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('--kolektiv-brand-base-hover:#222222');
    expect(html).toContain('--kolektiv-brand-icon-mark-hover:#ff00ff');
  });

  it('renders exactly the shared variant markup', async () => {
    const html = await renderSvg(Wordmark, { title: 'Kolektiv' });
    expect(stripComments(innerOf(html))).toBe(
      renderVariantChildren('wordmark', { title: 'Kolektiv' }),
    );
  });
});
