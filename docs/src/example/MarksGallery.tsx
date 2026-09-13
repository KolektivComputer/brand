import { useSyncExternalStore, type ReactNode } from 'react';
import {
  BuiltByMark,
  ComputingWordmark,
  IconMark,
  Wordmark,
  brandVariants,
  type BrandMarkColors,
  type BrandVariantKey,
  type BrandVariantProps,
} from '@kolektiv/brand-react';
import { CodeBlock } from './CodeBlock';
import { getState, mapPartColors, subscribe, variantProps } from '../store';

interface MarkEntry {
  key: BrandVariantKey;
  name: string;
  label: string;
  className: string;
  render: (props: BrandVariantProps) => ReactNode;
}

const MARKS: MarkEntry[] = [
  {
    key: 'iconMark',
    name: 'IconMark',
    label: 'Icon mark',
    className: 'h-[72px] w-auto',
    render: (props) => <IconMark {...props} />,
  },
  {
    key: 'wordmark',
    name: 'Wordmark',
    label: 'Wordmark',
    className: 'h-10 w-auto',
    render: (props) => <Wordmark {...props} />,
  },
  {
    key: 'computingWordmark',
    name: 'ComputingWordmark',
    label: 'Computing wordmark',
    className: 'h-20 w-auto',
    render: (props) => <ComputingWordmark {...props} />,
  },
  {
    key: 'builtByMark',
    name: 'BuiltByMark',
    label: 'Built by mark',
    className: 'h-[90px] w-auto',
    render: (props) => <BuiltByMark {...props} />,
  },
];

function formatColors(colors: BrandMarkColors): string {
  const entries = Object.entries(colors);
  if (entries.length === 0) return '{}';
  return `{ ${entries.map(([key, value]) => `${key}: '${value}'`).join(', ')} }`;
}

function relevantColors(colors: BrandMarkColors, key: BrandVariantKey): BrandMarkColors {
  const parts = brandVariants[key].parts as readonly string[];
  return Object.fromEntries(
    Object.entries(colors).filter(([part]) => parts.includes(part)),
  );
}

function usageCode(
  mark: MarkEntry,
  colors: BrandMarkColors,
  hoverColors?: BrandMarkColors,
): string {
  const base = relevantColors(colors, mark.key);
  const hover = hoverColors ? relevantColors(hoverColors, mark.key) : undefined;

  let code = `<${mark.name}\n  className="${mark.className}"\n  colors={${formatColors(base)}}`;
  if (hover && Object.keys(hover).length > 0) {
    code += `\n  hoverColors={${formatColors(hover)}}`;
  }
  return `${code}\n/>`;
}

export function MarksGallery() {
  const state = useSyncExternalStore(subscribe, getState, getState);
  const { colors } = variantProps(state);
  const hoverColors = mapPartColors(state.hoverColors);

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-60">Marks</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {MARKS.map((mark) => (
          <article key={mark.key} className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body gap-4">
              <h3 className="card-title text-sm font-semibold">
                {mark.label}
                <span className="ml-2 font-mono text-xs font-normal opacity-50">
                  {`<${mark.name} />`}
                </span>
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-base-300 bg-base-100 p-4">
                  <div className="mb-3 text-[11px] uppercase tracking-wide opacity-50">
                    Static
                  </div>
                  <div className="flex h-28 items-center justify-center">
                    {mark.render({ className: mark.className, colors })}
                  </div>
                </div>
                <div className="rounded-lg border border-base-300 bg-base-100 p-4">
                  <div className="mb-3 text-[11px] uppercase tracking-wide opacity-50">
                    Hoverable
                  </div>
                  <div className="flex h-28 items-center justify-center">
                    {mark.render({ className: mark.className, colors, hoverColors })}
                  </div>
                </div>
              </div>

              <CodeBlock
                code={`// static\n${usageCode(mark, colors)}\n\n// hoverable\n${usageCode(
                  mark,
                  colors,
                  hoverColors,
                )}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
