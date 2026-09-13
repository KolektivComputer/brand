import {
  markAst,
  markHeight,
  markParts,
  markRawSvg,
  markSourcePath,
  markViewBox,
  markWidth,
} from './generated/mark.js';
import type {
  BrandMarkPart,
  MarkAstElement,
  MarkAstNode,
  MarkAstText,
  MarkPartDefinition,
} from './generated/mark.js';
import { brandVariantKeys, brandVariants } from './generated/variants.js';
import type { BrandVariantDefinition, BrandVariantKey } from './generated/variants.js';

export {
  markAst,
  markHeight,
  markParts,
  markRawSvg,
  markSourcePath,
  markViewBox,
  markWidth,
};
export type { BrandMarkPart, MarkAstElement, MarkAstNode, MarkAstText, MarkPartDefinition };

export { brandVariantKeys, brandVariants };
export type { BrandVariantDefinition, BrandVariantKey };

export type BrandMarkColors = Partial<Record<BrandMarkPart, string>>;
export type BrandMarkVisibility = Partial<Record<BrandMarkPart, boolean>>;
export type BrandMarkStyle = Record<string, string | number>;

export type BrandMarkVariant =
  | 'full'
  | 'builtByMark'
  | 'computingWordmark'
  | 'wordmark'
  | 'iconMark';

export const brandMarkVariants: Record<BrandMarkVariant, readonly BrandMarkPart[]> = {
  full: ['iconMark', 'wordOlektiv', 'wordComputing', 'wordBuiltBy'],
  builtByMark: ['wordBuiltBy', 'wordOlektiv', 'wordComputing'],
  computingWordmark: ['iconMark', 'wordOlektiv', 'wordComputing'],
  wordmark: ['iconMark', 'wordOlektiv'],
  iconMark: ['iconMark'],
};

export interface BrandMarkSharedProps {
  colors?: BrandMarkColors;
  parts?: BrandMarkVisibility;
  variant?: BrandMarkVariant;
  color?: string;
  title?: string;
  style?: BrandMarkStyle;
  className?: string;
}

export interface BrandMarkRenderOptions {
  parts?: BrandMarkVisibility;
  variant?: BrandMarkVariant;
  title?: string;
}

export type BrandMarkAttributes = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface RenderBrandMarkOptions extends BrandMarkSharedProps, BrandMarkRenderOptions {
  attributes?: BrandMarkAttributes;
}

const partByKey: Map<string, MarkPartDefinition> = new Map(
  markParts.map((part) => [part.key, part as MarkPartDefinition]),
);

const partByRawId: Map<string, MarkPartDefinition> = new Map(
  markParts.map((part) => [part.id, part as MarkPartDefinition]),
);

const partRelations: Map<string, Set<string>> = (() => {
  const relations = new Map<string, Set<string>>();
  for (const part of markParts) {
    const related = new Set<string>([part.key]);
    let ancestorKey: string | null = part.parent;
    while (ancestorKey) {
      related.add(ancestorKey);
      ancestorKey = partByKey.get(ancestorKey)?.parent ?? null;
    }
    const stack: string[] = [...part.children];
    while (stack.length > 0) {
      const descendantKey = stack.pop();
      if (descendantKey === undefined) continue;
      related.add(descendantKey);
      stack.push(...(partByKey.get(descendantKey)?.children ?? []));
    }
    relations.set(part.key, related);
  }
  return relations;
})();

export function partCssVar(part: BrandMarkPart): string {
  const definition = partByKey.get(part);
  if (!definition) {
    throw new Error(`Unknown brand mark part: ${String(part)}`);
  }
  return definition.cssVar;
}

export function isPartVisible(
  part: BrandMarkPart,
  options: { parts?: BrandMarkVisibility; variant?: BrandMarkVariant } = {},
): boolean {
  if (options.parts?.[part] === false) return false;
  if (!options.variant) return true;

  const variantParts = brandMarkVariants[options.variant];
  const related = partRelations.get(part);
  if (!related) return false;
  for (const candidate of variantParts) {
    if (related.has(candidate)) return true;
  }
  return false;
}

export interface BrandMarkRootStyleOptions {
  colors?: BrandMarkColors;
  color?: string;
  style?: BrandMarkStyle;
}

export function buildRootStyle(options: BrandMarkRootStyleOptions = {}): BrandMarkStyle {
  const rootStyle: BrandMarkStyle = {
    display: 'block',
  };

  if (options.style) Object.assign(rootStyle, options.style);

  if (options.color !== undefined) {
    rootStyle.color = options.color;
  }

  if (options.colors) {
    for (const [key, value] of Object.entries(options.colors)) {
      if (value === undefined || value === null) continue;
      const definition = partByKey.get(key);
      if (!definition) continue;
      rootStyle[definition.cssVar] = value;
    }
  }

  return rootStyle;
}

export function styleToCssText(style?: BrandMarkStyle): string {
  if (!style) return '';
  const declarations: string[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === null) continue;
    const property = key.startsWith('--')
      ? key
      : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    declarations.push(`${property}:${value}`);
  }
  return declarations.join(';');
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderNode(node: MarkAstNode, options: BrandMarkRenderOptions): string {
  if (node.type === 'text') return escapeText(node.value);

  const definition = node.attrs.id ? partByRawId.get(node.attrs.id) : undefined;
  if (definition && !isPartVisible(definition.key as BrandMarkPart, options)) {
    return '';
  }

  const attrs: Record<string, string> = { ...node.attrs };
  if (definition) {
    const declaration = `color:var(${definition.cssVar}, inherit)`;
    attrs.style = attrs.style ? `${attrs.style};${declaration}` : declaration;
  }

  let output = `<${node.tag}`;
  for (const [name, value] of Object.entries(attrs)) {
    output += ` ${name}="${escapeAttribute(value)}"`;
  }

  if (node.selfClosing) return `${output}/>`;

  let inner = '';
  for (const child of node.children) inner += renderNode(child, options);
  return `${output}>${inner}</${node.tag}>`;
}

export function renderMarkChildren(options: BrandMarkRenderOptions = {}): string {
  let output = '';
  if (options.title) output += `<title>${escapeText(options.title)}</title>`;
  for (const child of markAst.children) output += renderNode(child, options);
  return output;
}

export function renderBrandMark(options: RenderBrandMarkOptions = {}): string {
  const { parts, variant, title, colors, color, style, className, attributes } = options;

  const rootStyle = styleToCssText(buildRootStyle({ colors, color, style }));

  let output = '<svg';
  output += ' xmlns="http://www.w3.org/2000/svg"';
  output += ` viewBox="${escapeAttribute(markViewBox)}"`;
  output += ' fill="none"';
  output += ' width="100%"';
  if (rootStyle) output += ` style="${escapeAttribute(rootStyle)}"`;
  if (className) output += ` class="${escapeAttribute(className)}"`;
  if (title) {
    output += ' role="img"';
    output += ` aria-label="${escapeAttribute(title)}"`;
  } else {
    output += ' aria-hidden="true"';
  }

  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      if (value === undefined || value === null) continue;
      output += ` ${name}="${escapeAttribute(String(value))}"`;
    }
  }

  output += `>${renderMarkChildren({ parts, variant, title })}</svg>`;
  return output;
}

/* -------------------------------------------------------------------------- */
/* Per-variant components                                                     */
/* -------------------------------------------------------------------------- */

export interface BrandVariantSharedProps {
  colors?: BrandMarkColors;
  hoverColors?: BrandMarkColors;
  color?: string;
  hoverColor?: string;
  title?: string;
  style?: BrandMarkStyle;
  className?: string;
}

export interface BrandVariantRenderOptions {
  title?: string;
}

export interface RenderBrandVariantOptions
  extends BrandVariantSharedProps,
    BrandVariantRenderOptions {
  attributes?: BrandMarkAttributes;
}

export function partHoverCssVar(part: BrandMarkPart): string {
  return `${partCssVar(part)}-hover`;
}

export function buildVariantRootStyle(options: BrandVariantSharedProps = {}): BrandMarkStyle {
  const rootStyle = buildRootStyle({
    colors: options.colors,
    color: options.color,
    style: options.style,
  });

  if (options.hoverColor !== undefined) {
    rootStyle['--kolektiv-brand-base-hover'] = options.hoverColor;
  }

  if (options.hoverColors) {
    for (const [key, value] of Object.entries(options.hoverColors)) {
      if (value === undefined || value === null) continue;
      const definition = partByKey.get(key);
      if (!definition) continue;
      rootStyle[`${definition.cssVar}-hover`] = value;
    }
  }

  return rootStyle;
}

export function renderVariantChildren(
  key: BrandVariantKey,
  options: BrandVariantRenderOptions = {},
): string {
  const definition = brandVariants[key];
  let output = '';
  if (options.title) output += `<title>${escapeText(options.title)}</title>`;
  output += definition.content;
  return output;
}

export function renderBrandVariant(
  key: BrandVariantKey,
  options: RenderBrandVariantOptions = {},
): string {
  const definition = brandVariants[key];
  const rootStyle = styleToCssText(buildVariantRootStyle(options));
  const className = options.className
    ? `kolektiv-brand-hover ${options.className}`
    : 'kolektiv-brand-hover';

  let output = '<svg';
  output += ' xmlns="http://www.w3.org/2000/svg"';
  output += ` viewBox="${escapeAttribute(definition.viewBox)}"`;
  output += ' fill="none"';
  output += ' width="100%"';
  if (rootStyle) output += ` style="${escapeAttribute(rootStyle)}"`;
  output += ` class="${escapeAttribute(className)}"`;
  if (options.title) {
    output += ' role="img"';
    output += ` aria-label="${escapeAttribute(options.title)}"`;
  } else {
    output += ' aria-hidden="true"';
  }

  if (options.attributes) {
    for (const [name, value] of Object.entries(options.attributes)) {
      if (value === undefined || value === null) continue;
      output += ` ${name}="${escapeAttribute(String(value))}"`;
    }
  }

  output += `>${renderVariantChildren(key, { title: options.title })}</svg>`;
  return output;
}
