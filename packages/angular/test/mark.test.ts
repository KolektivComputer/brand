import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import {
  KolektivBrandMark,
  KolektivBuiltByMark,
  KolektivComputingWordmark,
  KolektivIconMark,
  KolektivWordmark,
  brandMarkHtml,
  brandVariantHtml,
} from '../dist/index.js';

describe('@kolektiv/brand-angular', () => {
  it('exposes string helpers backed by brand-core', () => {
    expect(brandVariantHtml('iconMark')).toContain('viewBox="0 0 468 681"');
    expect(brandVariantHtml('wordmark')).toContain('data-kv="wordOlektiv"');
    const hidden = brandMarkHtml({ parts: { wordComputing: false } });
    expect(hidden).not.toContain('id="word_computing"');
    expect(hidden).toContain('id="word_olektiv"');
  });

  it('defines standalone components with their selectors', () => {
    expect(KolektivBrandMark.ɵcmp.selectors).toEqual([['kolektiv-brand-mark']]);
    expect(KolektivIconMark.ɵcmp.selectors).toEqual([['kolektiv-icon-mark']]);
    expect(KolektivWordmark.ɵcmp.selectors).toEqual([['kolektiv-wordmark']]);
    expect(KolektivComputingWordmark.ɵcmp.selectors).toEqual([
      ['kolektiv-computing-wordmark'],
    ]);
    expect(KolektivBuiltByMark.ɵcmp.selectors).toEqual([['kolektiv-built-by-mark']]);
  });

  it('declares the shared inputs', () => {
    expect(Object.keys(KolektivBrandMark.ɵcmp.inputs)).toEqual(
      expect.arrayContaining(['colors', 'parts', 'variant', 'color', 'title', 'style', 'className']),
    );
    expect(Object.keys(KolektivIconMark.ɵcmp.inputs)).toEqual(
      expect.arrayContaining(['colors', 'hoverColors', 'color', 'hoverColor', 'title', 'style', 'className']),
    );
  });
});
