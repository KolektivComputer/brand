import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { renderMarkChildren } from '@kolektiv/brand-core';
import BrandMark from '../src/BrandMark.vue';

async function renderSvg(props: Record<string, unknown> = {}): Promise<string> {
  const app = createSSRApp({ render: () => h(BrandMark, props) });
  return renderToString(app);
}

function innerOf(svg: string): string {
  const match = svg.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, '');
}

describe('@kolektiv/brand-vue BrandMark', () => {
  it('exposes per-part style hooks and colors', async () => {
    const html = await renderSvg({ colors: { iconMark: '#d8a5f0' }, color: '#c9a9ee' });
    expect(html).toContain('--kolektiv-brand-icon-mark');
    expect(html).toContain('#d8a5f0');
    expect(html).toContain('color:var(--kolektiv-brand-icon-mark, inherit)');
    expect(html).toContain('color:var(--kolektiv-brand-word-olektiv, inherit)');
  });

  it('omits hidden parts', async () => {
    const html = await renderSvg({ parts: { iconMark: false } });
    expect(html).not.toContain('id="icon_mark"');
    expect(html).toContain('id="word_olektiv"');
  });

  it('renders exactly the shared inner markup', async () => {
    const options = { parts: { wordBuiltBy: false }, variant: 'computingWordmark' as const };
    const html = await renderSvg(options);
    expect(stripComments(innerOf(html))).toBe(renderMarkChildren(options));
  });

  it('sets role/aria-label and a title element when titled', async () => {
    const html = await renderSvg({ title: 'Kolektiv' });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Kolektiv"');
    expect(html).toContain('<title>Kolektiv</title>');
    expect(html).not.toContain('aria-hidden');
  });

  it('is aria-hidden without a title', async () => {
    const html = await renderSvg();
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
  });
});
