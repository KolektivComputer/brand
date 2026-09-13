import { BuiltByMark, Wordmark } from '@kolektiv/brand-react';
import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

export function Theming() {
  return (
    <div>
      <PageTitle>Theming</PageTitle>
      <Lead>
        Import <code>theme.css</code> once to map your design tokens (daisyUI theme variables
        by default) onto every brand part app-wide.
      </Lead>

      <Section title="Import">
        <CodeSample
          lang="ts"
          code={`import '@kolektiv/brand-core/theme.css';
// or from a wrapper package:
// import '@kolektiv/brand-react/theme.css';`}
        />
      </Section>

      <Section title="Token mapping">
        <CodeSample
          lang="css"
          code={`:root,
.kolektiv-brand-theme {
  --kolektiv-brand-primary: var(--color-primary, currentColor);
  --kolektiv-brand-neutral: var(--color-neutral, currentColor);

  --kolektiv-brand-icon-mark: var(--kolektiv-brand-primary);                    /* K */
  --kolektiv-brand-word-olektiv: color-mix(in srgb,
    var(--kolektiv-brand-primary) 75%, transparent);                            /* olektiv */
  --kolektiv-brand-word-computing: color-mix(in srgb,
    var(--kolektiv-brand-primary) 80%, transparent);                            /* computing */
  --kolektiv-brand-word-built-by: color-mix(in srgb,
    var(--kolektiv-brand-built-by-source, var(--kolektiv-brand-primary)) 80%,
    transparent);                                                              /* built by */
}`}
        />
      </Section>

      <Section title="Built by from neutral">
        <p className="text-sm opacity-80">
          Add the class to any ancestor (or the data attribute to <code>&lt;html&gt;</code>) to
          pull the built-by text from the neutral token at the same opacity.
        </p>
        <CodeSample
          lang="html"
          code={`<div class="kolektiv-brand-theme kolektiv-brand-built-by-neutral">
  <kolektiv-brand-mark></kolektiv-brand-mark>
</div>

<!-- or -->
<html data-kolektiv-brand-built-by="neutral">`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-6 rounded-xl border border-base-300 bg-base-100 p-4">
          <Wordmark className="h-8 w-auto" />
          <BuiltByMark className="h-12 w-auto" />
        </div>
      </Section>

      <Section title="Per-instance colours">
        <p className="text-sm opacity-80">
          Inline <code>colors</code>/<code>hoverColors</code> beat the app-wide variables, and
          each group keeps its own hover colour while the whole graphic is the hover target.
        </p>
        <CodeSample
          lang="tsx"
          code={`<BuiltByMark
  className="h-14 w-auto"
  colors={{ iconMark: '#d8a5f0', wordOlektiv: '#c9a9ee' }}
  hoverColors={{ wordOlektiv: '#ffffff' }}
/>`}
        />
      </Section>
    </div>
  );
}
