import { useSyncExternalStore } from 'react';
import { ComputingWordmark } from '@kolektiv/brand-react';
import { getState, subscribe, variantProps } from '../../store';
import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

export function Overview() {
  const state = useSyncExternalStore(subscribe, getState, getState);
  const { colors, hoverColors } = variantProps(state);

  return (
    <div>
      <PageTitle>Kolektiv brand</PageTitle>
      <Lead>
        This is the Kolektiv branding, published as components for the frameworks we build in —
        React, Vue, Svelte, Solid, Preact, Lit and Angular, plus vanilla. Use them wherever the
        mark or wordmark belongs.
      </Lead>

      <div className="mb-8 rounded-2xl border border-base-300 bg-linear-to-br from-base-200 to-base-300 p-8">
        <div className="flex justify-center">
          <ComputingWordmark
            colors={colors}
            hoverColors={hoverColors}
            className="w-full max-w-[24rem]"
          />
        </div>
        <p className="display mt-4 text-center text-base opacity-80">
          Hover the mark — every group has its own hover colour.
        </p>
      </div>

      <Section title="What this is">
        <p className="max-w-2xl text-sm opacity-80">
          One source SVG compiled into typed parts, wrapper packages for every framework we build
          in (React, Vue, Svelte, Solid, Preact, Lit, Angular) and vanilla, and a small theme
          layer so the colours follow your app&apos;s design tokens. It is the branding, not a
          full design system.
        </p>
      </Section>

      <Section title="Brand guides">
        <p className="max-w-2xl text-sm opacity-80">
          Usage guidance — clear space, minimum sizes, colour pairings and do/don&apos;t examples
          — will be added here later. The shared type is already set:{' '}
          <strong>Inclusive Sans</strong> light italic for display, <strong>Source Sans 3</strong>{' '}
          for body and <strong>Iosevka</strong> for code — used by every official Kolektiv project
          unless it has its own brand identity. See{' '}
          <a href="#/typography" className="link link-primary">
            Typography
          </a>
          . Colours come from the shared{' '}
          <a href="#/themes" className="link link-primary">
            Themes
          </a>{' '}
          package, which also feeds the code blocks.
        </p>
      </Section>

      <Section title="Install">
        <CodeSample
          lang="bash"
          code={`pnpm add @kolektiv/brand-react
# or -vue / -svelte / -solid / -preact / -lit / -angular / -vanilla / -core`}
        />
        <p className="text-xs opacity-60">
          Packages are fetched from the aggregated <code>npm-public</code> group registry.
        </p>
      </Section>
    </div>
  );
}
