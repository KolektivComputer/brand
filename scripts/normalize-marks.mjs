#!/usr/bin/env node
// Normalize exported variant SVGs so they are consistent with the master artwork:
//   * every <path> uses fill="currentColor"
//   * groups with a single element child are flattened away
//   * part ids match the master SVG (snake_case keys)
//
// Run with `pnpm normalize:marks`. Idempotent: re-running produces the same output.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const TOKEN_RE = /<[^>]+>|[^<]+/g;
const ATTR_RE = /([^\s=/>]+)(?:\s*=\s*"([^"]*)")?/g;

/**
 * Parts, in document order, per exported variant. `count` is the number of
 * consecutive paths that make up the part; a part with a single path gets the
 * id directly, multi-path parts are wrapped in one <g id="...">.
 */
const variants = [
  {
    file: 'marks/svg/kolektiv icon mark.svg',
    parts: [{ id: 'icon_mark', count: 1 }],
  },
  {
    file: 'marks/svg/kolektiv wordmark.svg',
    parts: [
      { id: 'word_olektiv', count: 7 },
      { id: 'icon_mark', count: 1 },
    ],
  },
  {
    file: 'marks/svg/kolektiv computing wordmark.svg',
    parts: [
      { id: 'word_computing', count: 9 },
      { id: 'word_olektiv', count: 7 },
      { id: 'icon_mark', count: 1 },
    ],
  },
];

function parseAttributes(raw) {
  const attrs = {};
  ATTR_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_RE.exec(raw)) !== null) {
    if (match[0] === '') {
      ATTR_RE.lastIndex += 1;
      continue;
    }
    if (match[1] !== undefined) attrs[match[1]] = match[2] ?? '';
  }
  return attrs;
}

function parse(source) {
  const root = { type: 'element', tag: '#root', attrs: {}, children: [], selfClosing: false };
  const stack = [root];
  const tokens = source.match(TOKEN_RE) ?? [];

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      stack[stack.length - 1].children.push({ type: 'text', value: token });
      continue;
    }
    const inner = token.slice(1, -1);
    if (inner.startsWith('?') || inner.startsWith('!')) continue;
    if (inner.startsWith('/')) {
      const name = inner.slice(1).trim();
      const current = stack.pop();
      if (!current || current.tag !== name) {
        throw new Error(`Unbalanced SVG near </${name}>`);
      }
      continue;
    }
    const selfClosing = /\/\s*$/.test(inner);
    const body = selfClosing ? inner.replace(/\/\s*$/, '') : inner;
    const tag = body.match(/^([^\s/>]+)/)?.[1];
    if (!tag) throw new Error(`Cannot parse tag from ${token}`);
    const element = {
      type: 'element',
      tag,
      attrs: parseAttributes(body.slice(tag.length)),
      children: [],
      selfClosing,
    };
    stack[stack.length - 1].children.push(element);
    if (!selfClosing) stack.push(element);
  }

  if (stack.length !== 1) throw new Error('Unbalanced SVG: unclosed element.');
  const svg = root.children.find((node) => node.type === 'element' && node.tag === 'svg');
  if (!svg) throw new Error('No root <svg> element found.');
  return svg;
}

/** Depth-first ordered list of every element in the tree. */
function elementsOf(node, out = []) {
  for (const child of node.children) {
    if (child.type === 'element') {
      out.push(child);
      elementsOf(child, out);
    }
  }
  return out;
}

function serializeElement(tag, id, attrs) {
  const ordered = {};
  if (id) ordered.id = id;
  for (const [name, value] of Object.entries(attrs)) {
    if (name === 'id') continue;
    if (name === 'fill') continue;
    ordered[name] = value;
  }
  ordered.fill = 'currentColor';

  let out = `<${tag}`;
  for (const [name, value] of Object.entries(ordered)) out += ` ${name}="${value}"`;
  return `${out}/>`;
}

function normalize(variant) {
  const abs = resolve(repoRoot, variant.file);
  const svg = parse(readFileSync(abs, 'utf8'));
  const paths = elementsOf(svg).filter((element) => element.tag === 'path');
  const expected = variant.parts.reduce((total, part) => total + part.count, 0);
  if (paths.length !== expected) {
    throw new Error(`${variant.file}: expected ${expected} paths, found ${paths.length}`);
  }

  const lines = [];
  const rootAttrs = Object.entries(svg.attrs)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('');
  lines.push(`<svg${rootAttrs}>`);

  let cursor = 0;
  for (const part of variant.parts) {
    const slice = paths.slice(cursor, cursor + part.count);
    cursor += part.count;

    if (slice.length === 1) {
      const path = slice[0];
      lines.push(serializeElement('path', part.id, path.attrs));
      continue;
    }

    lines.push(`<g id="${part.id}">`);
    for (const path of slice) lines.push(`    ${serializeElement('path', null, path.attrs)}`);
    lines.push('</g>');
  }

  lines.push('</svg>');
  writeFileSync(abs, `${lines.join('\n')}\n`, 'utf8');
  console.log(`normalized ${variant.file} (${paths.length} paths, ${variant.parts.length} parts)`);
}

for (const variant of variants) normalize(variant);
