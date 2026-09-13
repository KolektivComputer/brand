import { render, type TemplateResult } from 'lit';
import { describe, expect, it } from 'vitest';
import { renderMarkChildren, renderVariantChildren } from '@kolektiv/brand-core';
import { brandMarkTemplate, brandVariantTemplate } from '../src/index.js';

function into(template: TemplateResult): HTMLDivElement {
  const host = document.createElement('div');
  document.body.append(host);
  render(template, host);
  return host;
}

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, '');
}

// The DOM serialises self-closing SVG tags as explicit open/close pairs.
function normalizePaths(value: string): string {
  return value.replace(/<path([^>]*?)\/>/g, '<path$1></path>');
}

describe('@kolektiv/brand-lit', () => {
  it('renders variants with viewBox and hover hooks', () => {
    const icon = into(brandVariantTemplate('iconMark')).querySelector('svg');
    expect(icon?.getAttribute('viewBox')).toBe('0 0 468 681');
    expect(icon?.getAttribute('class')).toContain('kolektiv-brand-hover');
    expect(icon?.innerHTML).toContain('data-kv="iconMark"');
    expect(icon?.innerHTML).toContain('.kolektiv-brand-hover:hover [data-kv="iconMark"]');
  });

  it('renders the master mark and hides parts', () => {
    const host = into(brandMarkTemplate({ parts: { wordComputing: false } }));
    const html = host.querySelector('svg')?.innerHTML ?? '';
    expect(html).toContain('id="word_olektiv"');
    expect(html).not.toContain('id="word_computing"');
  });

  it('maps colors onto the root style', () => {
    const svg = into(
      brandVariantTemplate('iconMark', {
        colors: { iconMark: '#d8a5f0' },
        hoverColors: { iconMark: '#ff00ff' },
      }),
    ).querySelector('svg');
    expect(svg?.getAttribute('style')).toContain('--kolektiv-brand-icon-mark:#d8a5f0');
    expect(svg?.getAttribute('style')).toContain('--kolektiv-brand-icon-mark-hover:#ff00ff');
  });

  it('renders exactly the shared variant markup', () => {
    const svg = into(brandVariantTemplate('wordmark')).querySelector('svg');
    expect(normalizePaths(stripComments(svg?.innerHTML ?? ''))).toBe(
      normalizePaths(renderVariantChildren('wordmark', {})),
    );
  });
});
