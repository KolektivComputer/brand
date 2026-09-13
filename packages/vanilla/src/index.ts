import {
  renderBrandMark,
  renderBrandVariant,
  type BrandMarkAttributes,
  type BrandMarkSharedProps,
  type BrandVariantKey,
  type BrandVariantSharedProps,
} from '@kolektiv/brand-core';

export interface BrandMarkOptions extends BrandMarkSharedProps {
  attributes?: BrandMarkAttributes;
}

export type BrandMarkProps = BrandMarkSharedProps;

export interface BrandVariantOptions extends BrandVariantSharedProps {
  attributes?: BrandMarkAttributes;
}

export type BrandVariantProps = BrandVariantSharedProps;

function svgElementFromMarkup(markup: string): SVGSVGElement {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  const svg = template.content.firstElementChild;
  if (!svg || svg.tagName.toLowerCase() !== 'svg') {
    throw new Error('Failed to create <svg> element for brand mark.');
  }
  return svg as SVGSVGElement;
}

export function brandMarkMarkup(options: BrandMarkOptions = {}): string {
  return renderBrandMark(options);
}

export function createBrandMark(options: BrandMarkOptions = {}): SVGSVGElement {
  if (typeof document === 'undefined') {
    throw new Error('createBrandMark requires a DOM environment.');
  }
  return svgElementFromMarkup(brandMarkMarkup(options));
}

export function brandVariantMarkup(
  key: BrandVariantKey,
  options: BrandVariantOptions = {},
): string {
  return renderBrandVariant(key, options);
}

export function createBrandVariant(
  key: BrandVariantKey,
  options: BrandVariantOptions = {},
): SVGSVGElement {
  if (typeof document === 'undefined') {
    throw new Error('createBrandVariant requires a DOM environment.');
  }
  return svgElementFromMarkup(brandVariantMarkup(key, options));
}

export const iconMarkMarkup = (options?: BrandVariantOptions): string =>
  brandVariantMarkup('iconMark', options);

export const wordmarkMarkup = (options?: BrandVariantOptions): string =>
  brandVariantMarkup('wordmark', options);

export const computingWordmarkMarkup = (options?: BrandVariantOptions): string =>
  brandVariantMarkup('computingWordmark', options);

export const builtByMarkMarkup = (options?: BrandVariantOptions): string =>
  brandVariantMarkup('builtByMark', options);

export const createIconMark = (options?: BrandVariantOptions): SVGSVGElement =>
  createBrandVariant('iconMark', options);

export const createWordmark = (options?: BrandVariantOptions): SVGSVGElement =>
  createBrandVariant('wordmark', options);

export const createComputingWordmark = (options?: BrandVariantOptions): SVGSVGElement =>
  createBrandVariant('computingWordmark', options);

export const createBuiltByMark = (options?: BrandVariantOptions): SVGSVGElement =>
  createBrandVariant('builtByMark', options);

export function defineBrandMarkElement(tagName = 'kolektiv-brand-mark'): void {
  if (typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;

  const observed = ['width', 'height', 'color', 'title'] as const;

  class KolektivBrandMarkElement extends HTMLElement {
    static get observedAttributes(): readonly string[] {
      return observed;
    }

    #options: BrandMarkOptions = {};
    #root: ShadowRoot;

    constructor() {
      super();
      this.#root = this.attachShadow({ mode: 'open' });
    }

    get options(): BrandMarkOptions {
      return this.#options;
    }

    set options(value: BrandMarkOptions) {
      this.#options = value ?? {};
      this.#render();
    }

    connectedCallback(): void {
      this.#render();
    }

    attributeChangedCallback(): void {
      this.#render();
    }

    #render(): void {
      const options: BrandMarkOptions = {
        ...this.#options,
        attributes: { ...this.#options.attributes },
      };

      for (const name of observed) {
        const attribute = this.getAttribute(name);
        if (attribute === null) continue;
        if (name === 'color' || name === 'title') {
          (options as Record<string, unknown>)[name] = attribute;
        } else {
          options.attributes![name] = attribute;
        }
      }

      this.#root.innerHTML = brandMarkMarkup(options);
    }
  }

  customElements.define(tagName, KolektivBrandMarkElement);
}

export * from '@kolektiv/brand-core';
