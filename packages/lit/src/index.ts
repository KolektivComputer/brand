import { html, LitElement, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  renderBrandMark,
  renderBrandVariant,
  type BrandMarkSharedProps,
  type BrandVariantKey,
  type BrandVariantSharedProps,
} from '@kolektiv/brand-core';

export interface BrandMarkOptions extends BrandMarkSharedProps {}

export type BrandVariantOptions = BrandVariantSharedProps;

export function brandMarkTemplate(options: BrandMarkOptions = {}): TemplateResult {
  return html`${unsafeHTML(renderBrandMark(options))}`;
}

export function brandVariantTemplate(
  key: BrandVariantKey,
  options: BrandVariantOptions = {},
): TemplateResult {
  return html`${unsafeHTML(renderBrandVariant(key, options))}`;
}

/** Light-DOM LitElement; assign `options` to (re)render. */
export class KolektivBrandMark extends LitElement {
  static properties = { options: { attribute: false } };

  options: BrandMarkOptions = {};

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  protected template(): TemplateResult {
    return brandMarkTemplate(this.options);
  }

  protected render(): TemplateResult {
    return this.template();
  }
}

abstract class KolektivVariantElement extends KolektivBrandMark {
  protected abstract variantKey: BrandVariantKey;

  declare options: BrandVariantOptions;

  protected override template(): TemplateResult {
    return brandVariantTemplate(this.variantKey, this.options);
  }
}

export class KolektivIconMark extends KolektivVariantElement {
  protected variantKey = 'iconMark' as const;
}

export class KolektivWordmark extends KolektivVariantElement {
  protected variantKey = 'wordmark' as const;
}

export class KolektivComputingWordmark extends KolektivVariantElement {
  protected variantKey = 'computingWordmark' as const;
}

export class KolektivBuiltByMark extends KolektivVariantElement {
  protected variantKey = 'builtByMark' as const;
}

export function defineBrandMarks(): void {
  if (typeof customElements === 'undefined') return;
  const definitions: Array<[string, CustomElementConstructor]> = [
    ['kolektiv-brand-mark', KolektivBrandMark],
    ['kolektiv-icon-mark', KolektivIconMark],
    ['kolektiv-wordmark', KolektivWordmark],
    ['kolektiv-computing-wordmark', KolektivComputingWordmark],
    ['kolektiv-built-by-mark', KolektivBuiltByMark],
  ];
  for (const [name, constructor] of definitions) {
    if (!customElements.get(name)) customElements.define(name, constructor);
  }
}
