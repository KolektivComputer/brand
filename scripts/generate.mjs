#!/usr/bin/env node
// Dependency-free, deterministic, idempotent generator for @kolektiv/brand-core.
//
// Reads the canonical source SVG, parses it into an AST, discovers the artwork
// "parts" and emits packages/core/src/generated/mark.ts.
//
// Run with `pnpm generate`.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const sourcePath = 'marks/svg/built by kolektiv computing mark.svg';
const sourceAbs = resolve(repoRoot, sourcePath);
const outAbs = resolve(repoRoot, 'packages/core/src/generated/mark.ts');

/* -------------------------------------------------------------------------- */
/* AST types + parsing                                                        */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {{ type: 'text', value: string }} MarkAstText
 * @typedef {{ type: 'element', tag: string, attrs: Record<string, string>, children: MarkAstNode[], selfClosing: boolean }} MarkAstElement
 * @typedef {MarkAstText | MarkAstElement} MarkAstNode
 */

const TOKEN_RE = /<[^>]+>|[^<]+/g;
const ATTR_RE = /([^\s=/>]+)(?:\s*=\s*"([^"]*)")?/g;

/** @param {string} raw */
function parseAttributes(raw) {
  /** @type {Record<string, string>} */
  const attrs = {};
  ATTR_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_RE.exec(raw)) !== null) {
    if (match[0] === '') {
      ATTR_RE.lastIndex += 1;
      continue;
    }
    const name = match[1];
    if (name === undefined) continue;
    attrs[name] = match[2] !== undefined ? match[2] : '';
  }
  return attrs;
}

/** @param {string} source @returns {MarkAstElement} */
function parseSvg(source) {
  /** @type {MarkAstElement} */
  const root = { type: 'element', tag: '#root', attrs: {}, children: [], selfClosing: false };
  /** @type {MarkAstElement[]} */
  const stack = [root];

  const tokens = source.match(TOKEN_RE);
  if (!tokens) throw new Error('Failed to tokenize SVG source.');

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      const current = stack[stack.length - 1];
      if (!current) throw new Error('Text node encountered with no open element.');
      current.children.push({ type: 'text', value: token });
      continue;
    }

    const inner = token.slice(1, -1);
    if (inner.startsWith('?') || inner.startsWith('!')) {
      // XML declaration / doctype / comment: ignore.
      continue;
    }

    if (inner.startsWith('/')) {
      const name = inner.slice(1).trim();
      const current = stack.pop();
      if (!current) throw new Error(`Unexpected closing tag </${name}>: no open element.`);
      if (current.tag !== name) {
        throw new Error(`Mismatched closing tag </${name}>: expected </${current.tag}>.`);
      }
      continue;
    }

    const selfClosing = /\/\s*$/.test(inner);
    const body = selfClosing ? inner.replace(/\/\s*$/, '') : inner;
    const nameMatch = body.match(/^([^\s/>]+)/);
    if (!nameMatch || nameMatch[1] === undefined) {
      throw new Error(`Could not parse tag name from token: ${token}`);
    }
    const tag = nameMatch[1];
    const attrString = body.slice(tag.length);
    const element = {
      type: 'element',
      tag,
      attrs: parseAttributes(attrString),
      children: [],
      selfClosing,
    };

    const current = stack[stack.length - 1];
    if (!current) throw new Error(`Element <${tag}> encountered with no open parent.`);
    current.children.push(element);
    if (!selfClosing) stack.push(element);
  }

  if (stack.length !== 1) {
    const open = stack[stack.length - 1];
    throw new Error(`Unbalanced SVG: <${open ? open.tag : '?'}> was never closed.`);
  }

  const elements = root.children.filter((node) => node.type === 'element');
  if (elements.length !== 1) {
    throw new Error(`Expected exactly one root element, found ${elements.length}.`);
  }
  const svg = elements[0];
  if (!svg || svg.tag !== 'svg') {
    throw new Error(`Expected root tag <svg>, found <${svg ? svg.tag : '?'}>.`);
  }
  return svg;
}

/* -------------------------------------------------------------------------- */
/* Part discovery                                                             */
/* -------------------------------------------------------------------------- */

/** @param {string} value */
function toCamelCase(value) {
  const parts = value.split('_');
  return parts
    .map((part, index) => {
      if (index === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

/** @param {string} value */
function toLabel(value) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * @param {MarkAstElement} root
 * @returns {Array<{ id: string, key: string, cssVar: string, label: string, parent: string | null, children: string[], depth: number }>}
 */
function discoverParts(root) {
  /** @type {ReturnType<typeof discoverParts>} */
  const parts = [];
  /** @type {string[]} */
  const partStack = [];

  /** @param {MarkAstNode} node */
  const visit = (node) => {
    if (node.type === 'text') return;

    const id = node.attrs.id;
    const isPart = typeof id === 'string' && id.length > 0;
    const parentKey = partStack.length > 0 ? partStack[partStack.length - 1] : null;
    let currentKey = null;

    if (isPart) {
      currentKey = toCamelCase(id);
      const part = {
        id,
        key: currentKey,
        cssVar: `--kolektiv-brand-${id.replace(/_/g, '-')}`,
        label: toLabel(id),
        parent: parentKey,
        children: [],
        depth: partStack.length,
      };
      parts.push(part);
      if (parentKey !== null) {
        const parent = parts.find((candidate) => candidate.key === parentKey);
        if (parent) parent.children.push(currentKey);
      }
      partStack.push(currentKey);
    }

    for (const child of node.children) visit(child);

    if (currentKey !== null) partStack.pop();
  };

  for (const child of root.children) visit(child);
  return parts;
}

/* -------------------------------------------------------------------------- */
/* Emit                                                                       */
/* -------------------------------------------------------------------------- */

const source = readFileSync(sourceAbs, 'utf8');
const ast = parseSvg(source);
const parts = discoverParts(ast);

if (parts.length === 0) throw new Error('No parts discovered in source SVG.');

const viewBox = ast.attrs.viewBox ?? '0 0 0 0';
const width = Number(ast.attrs.width);
const height = Number(ast.attrs.height);
if (!Number.isFinite(width) || !Number.isFinite(height)) {
  throw new Error('Root <svg> must declare numeric width and height attributes.');
}

const escapeTemplateLiteral = (value) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

const rawSvg = escapeTemplateLiteral(source.trim());
const astJson = JSON.stringify(ast, null, 2);
const partsJson = JSON.stringify(parts, null, 2);

const output = `// AUTO-GENERATED FILE - DO NOT EDIT.
// Source: ${sourcePath}
// Regenerate with \`pnpm generate\`.

export interface MarkAstText {
  type: 'text';
  value: string;
}

export interface MarkAstElement {
  type: 'element';
  tag: string;
  attrs: Record<string, string>;
  children: MarkAstNode[];
  selfClosing: boolean;
}

export type MarkAstNode = MarkAstText | MarkAstElement;

export interface MarkPartDefinition {
  id: string;
  key: string;
  cssVar: string;
  label: string;
  parent: string | null;
  children: string[];
  depth: number;
}

export const markSourcePath = '${sourcePath}';

export const markViewBox = '${viewBox}';

export const markWidth = ${width};
export const markHeight = ${height};

export const markRawSvg = \`${rawSvg}\`;

export const markAst: MarkAstElement = ${astJson};

export const markParts = ${partsJson} as const satisfies readonly MarkPartDefinition[];

export type BrandMarkPart = (typeof markParts)[number]['key'];
`;

mkdirSync(dirname(outAbs), { recursive: true });
writeFileSync(outAbs, output, 'utf8');

const nameWidth = Math.max(...parts.map((part) => part.key.length));
console.log(`Generated ${sourcePath} -> packages/core/src/generated/mark.ts`);
console.log(`${parts.length} parts discovered:`);
for (const part of parts) {
  const indent = '  '.repeat(part.depth);
  console.log(
    `  ${indent}${part.key.padEnd(nameWidth + (3 - part.depth) * 2)}  ${part.cssVar}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Per-variant assets                                                         */
/* -------------------------------------------------------------------------- */

const variantsOutAbs = resolve(repoRoot, 'packages/core/src/generated/variants.ts');

const variantSources = [
  { key: 'iconMark', label: 'Icon Mark', file: 'marks/svg/kolektiv icon mark.svg' },
  { key: 'wordmark', label: 'Wordmark', file: 'marks/svg/kolektiv wordmark.svg' },
  {
    key: 'computingWordmark',
    label: 'Computing Wordmark',
    file: 'marks/svg/kolektiv computing wordmark.svg',
  },
  { key: 'builtByMark', label: 'Built By Mark', file: sourcePath },
];

const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttribute = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Serialize a variant AST to inner SVG markup, injecting the per-part colour hook
 * and (for leaf parts) the `data-kv` hover hook. A <style> block with the :hover
 * rules is prepended.
 */
function serializeVariantContent(svg, partList) {
  const byRawId = new Map(partList.map((part) => [part.id, part]));
  const hoverKeys = new Set(
    partList.filter((part) => part.children.length === 0).map((part) => part.key),
  );

  const renderNode = (node) => {
    if (node.type === 'text') return node.value;

    const definition = node.attrs.id ? byRawId.get(node.attrs.id) : undefined;
    const attrs = { ...node.attrs };

    if (definition) {
      if (hoverKeys.has(definition.key)) attrs['data-kv'] = definition.key;
      const declaration = `color:var(${definition.cssVar}, inherit)`;
      attrs.style = attrs.style ? `${attrs.style};${declaration}` : declaration;
    }

    let out = `<${node.tag}`;
    for (const [name, value] of Object.entries(attrs)) {
      out += ` ${name}="${escapeAttribute(value)}"`;
    }
    if (node.selfClosing) return `${out}/>`;

    let inner = '';
    for (const child of node.children) inner += renderNode(child);
    return `${out}>${inner}</${node.tag}>`;
  };

  const hoverRules = [...hoverKeys]
    .map((key) => {
      const part = partList.find((candidate) => candidate.key === key);
      return `.kolektiv-brand-hover:hover [data-kv="${key}"]{color:var(${part.cssVar}-hover,var(--kolektiv-brand-base-hover,var(${part.cssVar},inherit)))!important}`;
    })
    .join('');

  let content = hoverRules ? `<style>${hoverRules}</style>` : '';
  for (const child of svg.children) content += renderNode(child);
  return { content, hoverKeys: [...hoverKeys] };
}

const variantEntries = [];
const variantKeys = [];

for (const variant of variantSources) {
  const variantAbs = resolve(repoRoot, variant.file);
  const variantAst = parseSvg(readFileSync(variantAbs, 'utf8'));
  const variantParts = discoverParts(variantAst);
  const { content } = serializeVariantContent(variantAst, variantParts);

  const entry = {
    key: variant.key,
    label: variant.label,
    sourcePath: variant.file,
    viewBox: variantAst.attrs.viewBox ?? '0 0 0 0',
    width: Number(variantAst.attrs.width),
    height: Number(variantAst.attrs.height),
    parts: variantParts.map((part) => part.key),
    content: escapeTemplateLiteral(content),
  };
  variantEntries.push(entry);
  variantKeys.push(variant.key);
  console.log(
    `  variant ${variant.key.padEnd(18)} ${variant.file} (${variantParts.length} parts)`,
  );
}

const variantObject = variantEntries
  .map((entry) => {
    const partsList = entry.parts.map((key) => `'${key}'`).join(', ');
    return `  ${entry.key}: {
    key: '${entry.key}',
    label: '${entry.label}',
    sourcePath: '${entry.sourcePath}',
    viewBox: '${entry.viewBox}',
    width: ${entry.width},
    height: ${entry.height},
    parts: [${partsList}],
    content: \`${entry.content}\`,
  },`;
  })
  .join('\n');

const variantsOutput = `// AUTO-GENERATED FILE - DO NOT EDIT.
// Sources: ${variantSources.map((variant) => variant.file).join(', ')}
// Regenerate with \`pnpm generate\`.

import type { BrandMarkPart } from './mark.js';

export type BrandVariantKey = '${variantKeys.join("' | '")}';

export interface BrandVariantDefinition {
  key: BrandVariantKey;
  label: string;
  sourcePath: string;
  viewBox: string;
  width: number;
  height: number;
  parts: readonly BrandMarkPart[];
  content: string;
}

export const brandVariants = {
${variantObject}
} as const satisfies Record<BrandVariantKey, BrandVariantDefinition>;

export const brandVariantKeys = [${variantKeys.map((key) => `'${key}'`).join(', ')}] as const;
`;

writeFileSync(variantsOutAbs, variantsOutput, 'utf8');
console.log(`Generated per-variant assets -> packages/core/src/generated/variants.ts`);
