import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { renderVariantChildren } from '@kolektiv/brand-core';
import { BuiltByMark, ComputingWordmark, IconMark, Wordmark } from '../src/index.js';

function innerOf(svg: string): string {
  const match = svg.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/);
  if (!match || match[1] === undefined) throw new Error(`Not an svg: ${svg.slice(0, 80)}`);
  return match[1];
}

describe('@kolektiv/brand-react per-variant components', () => {
  it('renders each variant with its own viewBox and hover hooks', () => {
    const icon = renderToStaticMarkup(<IconMark />);
    expect(icon).toContain('viewBox="0 0 468 681"');
    expect(icon).toContain('class="kolektiv-brand-hover"');
    expect(icon).toContain('data-kv="iconMark"');
    expect(icon).toContain('.kolektiv-brand-hover:hover [data-kv="iconMark"]');

    const wordmark = renderToStaticMarkup(<Wordmark />);
    expect(wordmark).toContain('viewBox="0 0 2757 691"');
    expect(wordmark).toContain('data-kv="wordOlektiv"');
    expect(wordmark).toContain('data-kv="iconMark"');

    const computing = renderToStaticMarkup(<ComputingWordmark />);
    expect(computing).toContain('data-kv="wordComputing"');

    const builtBy = renderToStaticMarkup(<BuiltByMark />);
    expect(builtBy).toContain('viewBox="0 0 2761 1415"');
    expect(builtBy).toContain('data-kv="wordBuiltBy"');
  });

  it('maps colors and hover colors to per-part variables', () => {
    const html = renderToStaticMarkup(
      <IconMark
        color="#111111"
        colors={{ iconMark: '#d8a5f0' }}
        hoverColor="#222222"
        hoverColors={{ iconMark: '#ff00ff' }}
      />,
    );
    expect(html).toContain('color:#111111');
    expect(html).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(html).toContain('--kolektiv-brand-base-hover:#222222');
    expect(html).toContain('--kolektiv-brand-icon-mark-hover:#ff00ff');
  });

  it('renders exactly the shared variant markup', () => {
    const html = renderToStaticMarkup(
      <Wordmark title="Kolektiv" hoverColors={{ wordOlektiv: '#c9a9ee' }} />,
    );
    expect(innerOf(html)).toBe(
      renderVariantChildren('wordmark', { title: 'Kolektiv' }),
    );
  });

  it('merges user classes with the hover class', () => {
    const html = renderToStaticMarkup(<IconMark className="custom" />);
    expect(html).toContain('class="kolektiv-brand-hover custom"');
  });

  it('forwards native SVG attributes and lets them override the 100% default', () => {
    const html = renderToStaticMarkup(
      <IconMark width={48} height={48} id="mark" data-testid="mark" style={{ opacity: 0.5 }} />,
    );
    expect(html).toContain('width="48"');
    expect(html).toContain('height="48"');
    expect(html).toContain('id="mark"');
    expect(html).toContain('data-testid="mark"');
    expect(html).toContain('opacity:0.5');
    expect(html).not.toContain('width="100%"');
  });
});
