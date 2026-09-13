import { describe, expect, it } from 'vitest';
import {
  brandMarkVariants,
  brandVariantKeys,
  brandVariants,
  buildRootStyle,
  buildVariantRootStyle,
  isPartVisible,
  markHeight,
  markParts,
  markRawSvg,
  markSourcePath,
  markViewBox,
  markWidth,
  partCssVar,
  partHoverCssVar,
  renderBrandMark,
  renderBrandVariant,
  renderMarkChildren,
  renderVariantChildren,
  styleToCssText,
} from '../src/index.js';

const allIds = [
  'built_by_kolektiv_computing',
  'word_built_by',
  'kolektiv_computing_wordmark',
  'word_computing',
  'kolektiv_wordmark',
  'word_olektiv',
  'icon_mark',
];

describe('generated metadata', () => {
  it('exposes source metadata', () => {
    expect(markSourcePath).toBe('marks/svg/built by kolektiv computing mark.svg');
    expect(markViewBox).toBe('0 0 2761 1415');
    expect(markWidth).toBe(2761);
    expect(markHeight).toBe(1415);
    expect(markRawSvg.startsWith('<svg')).toBe(true);
    expect(markRawSvg.trim().endsWith('</svg>')).toBe(true);
  });

  it('contains the exact 7-part table', () => {
    expect(markParts.map((part) => ({
      id: part.id,
      key: part.key,
      cssVar: part.cssVar,
      label: part.label,
      parent: part.parent,
      children: [...part.children],
      depth: part.depth,
    }))).toEqual([
      {
        id: 'built_by_kolektiv_computing',
        key: 'builtByKolektivComputing',
        cssVar: '--kolektiv-brand-built-by-kolektiv-computing',
        label: 'Built By Kolektiv Computing',
        parent: null,
        children: ['wordBuiltBy', 'kolektivComputingWordmark'],
        depth: 0,
      },
      {
        id: 'word_built_by',
        key: 'wordBuiltBy',
        cssVar: '--kolektiv-brand-word-built-by',
        label: 'Word Built By',
        parent: 'builtByKolektivComputing',
        children: [],
        depth: 1,
      },
      {
        id: 'kolektiv_computing_wordmark',
        key: 'kolektivComputingWordmark',
        cssVar: '--kolektiv-brand-kolektiv-computing-wordmark',
        label: 'Kolektiv Computing Wordmark',
        parent: 'builtByKolektivComputing',
        children: ['wordComputing', 'kolektivWordmark'],
        depth: 1,
      },
      {
        id: 'word_computing',
        key: 'wordComputing',
        cssVar: '--kolektiv-brand-word-computing',
        label: 'Word Computing',
        parent: 'kolektivComputingWordmark',
        children: [],
        depth: 2,
      },
      {
        id: 'kolektiv_wordmark',
        key: 'kolektivWordmark',
        cssVar: '--kolektiv-brand-kolektiv-wordmark',
        label: 'Kolektiv Wordmark',
        parent: 'kolektivComputingWordmark',
        children: ['wordOlektiv', 'iconMark'],
        depth: 2,
      },
      {
        id: 'word_olektiv',
        key: 'wordOlektiv',
        cssVar: '--kolektiv-brand-word-olektiv',
        label: 'Word Olektiv',
        parent: 'kolektivWordmark',
        children: [],
        depth: 3,
      },
      {
        id: 'icon_mark',
        key: 'iconMark',
        cssVar: '--kolektiv-brand-icon-mark',
        label: 'Icon Mark',
        parent: 'kolektivWordmark',
        children: [],
        depth: 3,
      },
    ]);
  });
});

describe('partCssVar', () => {
  it('returns the generated css variable', () => {
    expect(partCssVar('iconMark')).toBe('--kolektiv-brand-icon-mark');
    expect(partCssVar('wordOlektiv')).toBe('--kolektiv-brand-word-olektiv');
  });

  it('throws on unknown parts', () => {
    expect(() => partCssVar('nope' as never)).toThrow(/Unknown brand mark part/);
  });
});

describe('buildRootStyle', () => {
  it('provides a block default', () => {
    expect(buildRootStyle()).toEqual({ display: 'block' });
  });

  it('applies precedence: style, then color, then per-part colors', () => {
    const style = buildRootStyle({
      style: { width: '10px', color: 'red', display: 'inline-block' },
      color: 'blue',
      colors: { iconMark: 'pink', wordBuiltBy: 'lavender' },
    });
    expect(style).toEqual({
      display: 'inline-block',
      width: '10px',
      color: 'blue',
      '--kolektiv-brand-icon-mark': 'pink',
      '--kolektiv-brand-word-built-by': 'lavender',
    });
  });

  it('keeps custom style keys and custom properties verbatim', () => {
    const style = buildRootStyle({ style: { '--custom': '1', height: '3rem' } });
    expect(style).toMatchObject({ display: 'block', height: '3rem', '--custom': '1' });
  });

  it('ignores unknown color keys', () => {
    const style = buildRootStyle({ colors: { nope: 'red' } as never });
    expect(style).not.toHaveProperty('nope');
    expect(Object.keys(style)).toEqual(['display']);
  });
});

describe('styleToCssText', () => {
  it('serializes declarations without a trailing semicolon', () => {
    expect(
      styleToCssText({ display: 'block', '--brand': 'pink', backgroundColor: 'red' }),
    ).toBe('display:block;--brand:pink;background-color:red');
  });

  it('skips null and undefined and handles empty input', () => {
    expect(styleToCssText()).toBe('');
    expect(styleToCssText({ a: 1, b: undefined, c: null } as never)).toBe('a:1');
  });
});

describe('isPartVisible', () => {
  it('treats everything as visible without options', () => {
    expect(isPartVisible('iconMark')).toBe(true);
  });

  it('lets explicit false win over a variant', () => {
    expect(isPartVisible('iconMark', { variant: 'full', parts: { iconMark: false } })).toBe(false);
  });

  it('keeps ancestors and descendants of variant parts visible', () => {
    expect(isPartVisible('kolektivWordmark', { variant: 'wordmark' })).toBe(true);
    expect(isPartVisible('builtByKolektivComputing', { variant: 'iconMark' })).toBe(true);
    expect(isPartVisible('wordBuiltBy', { variant: 'iconMark' })).toBe(false);
  });
});

describe('renderMarkChildren', () => {
  it('renders every part with its color hook by default', () => {
    const html = renderMarkChildren();
    for (const id of allIds) expect(html).toContain(`id="${id}"`);
    for (const part of markParts) {
      expect(html).toContain(`style="color:var(${part.cssVar}, inherit)"`);
    }
  });

  it('prefixes an escaped <title> when provided', () => {
    const html = renderMarkChildren({ title: 'K <&> "quoted"' });
    expect(html.startsWith('<title>K &lt;&amp;&gt; "quoted"</title>')).toBe(true);
    expect(html).not.toContain('K <&>');
  });

  it('hides only the requested subtree', () => {
    const html = renderMarkChildren({ parts: { wordComputing: false } });
    expect(html).not.toContain('id="word_computing"');
    for (const id of allIds.filter((id) => id !== 'word_computing')) {
      expect(html).toContain(`id="${id}"`);
    }
  });

  it('hides descendants when an ancestor is hidden', () => {
    const html = renderMarkChildren({ parts: { kolektivWordmark: false } });
    expect(html).not.toContain('id="word_olektiv"');
    expect(html).not.toContain('id="icon_mark"');
    expect(html).not.toContain('id="kolektiv_wordmark"');
    expect(html).toContain('id="word_computing"');
    expect(html).toContain('id="word_built_by"');
  });

  it('honours every variant preset', () => {
    const expected: Record<keyof typeof brandMarkVariants, string[]> = {
      full: allIds,
      builtByMark: [
        'built_by_kolektiv_computing',
        'word_built_by',
        'kolektiv_computing_wordmark',
        'word_computing',
        'kolektiv_wordmark',
        'word_olektiv',
      ],
      computingWordmark: [
        'built_by_kolektiv_computing',
        'kolektiv_computing_wordmark',
        'word_computing',
        'kolektiv_wordmark',
        'word_olektiv',
        'icon_mark',
      ],
      wordmark: [
        'built_by_kolektiv_computing',
        'kolektiv_computing_wordmark',
        'kolektiv_wordmark',
        'word_olektiv',
        'icon_mark',
      ],
      iconMark: [
        'built_by_kolektiv_computing',
        'kolektiv_computing_wordmark',
        'kolektiv_wordmark',
        'icon_mark',
      ],
    };

    for (const [variant, visibleIds] of Object.entries(expected)) {
      const html = renderMarkChildren({ variant: variant as keyof typeof brandMarkVariants });
      for (const id of allIds) {
        if (visibleIds.includes(id)) expect(html, `${variant} should contain ${id}`).toContain(`id="${id}"`);
        else expect(html, `${variant} should not contain ${id}`).not.toContain(`id="${id}"`);
      }
    }
  });
});

describe('renderBrandMark', () => {
  it('renders an accessible svg without a title', () => {
    const html = renderBrandMark();
    expect(html).toContain('<svg');
    expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(html).toContain('viewBox="0 0 2761 1415"');
    expect(html).toContain('fill="none"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain('<title>');
    expect(html).toContain('width="100%"');
    expect(html).toContain('style="display:block"');
    expect(html.endsWith('</svg>')).toBe(true);
  });

  it('renders role and aria-label with a title element and forwards attributes', () => {
    const html = renderBrandMark({
      title: 'Kolektiv',
      className: 'brand',
      style: { width: '200px' },
      attributes: { width: 100, height: 50, 'data-x': 'y' },
    });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Kolektiv"');
    expect(html).not.toContain('aria-hidden="true"');
    expect(html).toContain('<title>Kolektiv</title>');
    expect(html).toContain('class="brand"');
    expect(html).toContain('style="display:block;width:200px"');
    // forwarded attributes come after the defaults, so they win
    expect(html).toContain('width="100"');
    expect(html).toContain('height="50"');
    expect(html).toContain('data-x="y"');
  });

  it('renders extra attributes', () => {
    const html = renderBrandMark({ attributes: { 'data-testid': 'mark', focusable: false } });
    expect(html).toContain('data-testid="mark"');
    expect(html).toContain('focusable="false"');
  });
});

describe('per-variant assets', () => {
  it('exposes the four variant keys', () => {
    expect([...brandVariantKeys]).toEqual([
      'iconMark',
      'wordmark',
      'computingWordmark',
      'builtByMark',
    ]);
  });

  it('exposes viewBox, size, parts and hooked content per variant', () => {
    expect(brandVariants.iconMark.viewBox).toBe('0 0 468 681');
    expect(brandVariants.iconMark.parts).toEqual(['iconMark']);
    expect(brandVariants.wordmark.viewBox).toBe('0 0 2757 691');
    expect(brandVariants.wordmark.parts).toEqual(['wordOlektiv', 'iconMark']);
    expect(brandVariants.computingWordmark.parts).toEqual([
      'wordComputing',
      'wordOlektiv',
      'iconMark',
    ]);
    expect(brandVariants.builtByMark.viewBox).toBe(markViewBox);

    for (const key of brandVariantKeys) {
      const definition = brandVariants[key];
      expect(definition.content).toContain('<style>');
      expect(definition.content).toContain('data-kv=');
      for (const part of definition.parts) {
        expect(definition.content).toContain(`color:var(${partCssVar(part)}, inherit)`);
      }
    }
  });

  it('emits per-group hover rules for leaf parts', () => {
    const content = brandVariants.computingWordmark.content;
    expect(content).toContain(
      '.kolektiv-brand-hover:hover [data-kv="iconMark"]{color:var(--kolektiv-brand-icon-mark-hover,var(--kolektiv-brand-base-hover,var(--kolektiv-brand-icon-mark,inherit)))!important}',
    );
    expect(content).toContain('.kolektiv-brand-hover:hover [data-kv="wordComputing"]');
    expect(content).toContain('.kolektiv-brand-hover:hover [data-kv="wordOlektiv"]');
  });
});

describe('partHoverCssVar', () => {
  it('appends -hover to the part css variable', () => {
    expect(partHoverCssVar('iconMark')).toBe('--kolektiv-brand-icon-mark-hover');
  });
});

describe('buildVariantRootStyle', () => {
  it('starts from the base style and default hover var', () => {
    expect(buildVariantRootStyle({ hoverColor: '#123456' })).toEqual({
      display: 'block',
      '--kolektiv-brand-base-hover': '#123456',
    });
  });

  it('maps per-part hover colors onto -hover variables', () => {
    const style = buildVariantRootStyle({
      colors: { iconMark: 'pink' },
      hoverColors: { iconMark: 'hotpink', wordOlektiv: 'lavender' },
      hoverColor: 'black',
    });
    expect(style).toMatchObject({
      '--kolektiv-brand-icon-mark': 'pink',
      '--kolektiv-brand-icon-mark-hover': 'hotpink',
      '--kolektiv-brand-word-olektiv-hover': 'lavender',
      '--kolektiv-brand-base-hover': 'black',
    });
  });
});

describe('renderVariantChildren', () => {
  it('prefixes an escaped title before the hooked content', () => {
    const html = renderVariantChildren('iconMark', { title: 'K <&>' });
    expect(html.startsWith('<title>K &lt;&amp;&gt;</title><style>')).toBe(true);
  });

  it('includes the colour hook for every part', () => {
    const html = renderVariantChildren('wordmark');
    expect(html).toContain('color:var(--kolektiv-brand-word-olektiv, inherit)');
    expect(html).toContain('color:var(--kolektiv-brand-icon-mark, inherit)');
  });
});

describe('renderBrandVariant', () => {
  it('renders the variant viewBox, hover class and accessibility attributes', () => {
    const html = renderBrandVariant('iconMark');
    expect(html).toContain('viewBox="0 0 468 681"');
    expect(html).toContain('class="kolektiv-brand-hover"');
    expect(html).toContain('fill="none"');
    expect(html).toContain('aria-hidden="true"');
    expect(html.endsWith('</svg>')).toBe(true);
  });

  it('renders title, hover styles and extra classes', () => {
    const html = renderBrandVariant('wordmark', {
      title: 'Kolektiv',
      hoverColor: '#d8a5f0',
      hoverColors: { wordOlektiv: '#c9a9ee' },
      className: 'brand',
    });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Kolektiv"');
    expect(html).toContain('--kolektiv-brand-base-hover:#d8a5f0');
    expect(html).toContain('--kolektiv-brand-word-olektiv-hover:#c9a9ee');
    expect(html).toContain('class="kolektiv-brand-hover brand"');
    expect(html).toContain('<title>Kolektiv</title>');
  });
});
