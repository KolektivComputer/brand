import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

const REACT = `import { BrandMark, ComputingWordmark, IconMark } from '@kolektiv/brand-react';

<BrandMark variant="computingWordmark" title="Kolektiv Computing" />

// Or a fixed variant component (hoverable)
<ComputingWordmark
  className="h-20 w-auto"
  colors={{ iconMark: '#1c1720', wordComputing: '#1c1720', wordOlektiv: '#1c1720' }}
  hoverColors={{ wordOlektiv: '#c9a9ee' }}
  title="Kolektiv Computing"
/>

// Icon-only, inheriting the surrounding text colour
<button className="btn btn-outline">
  <IconMark colors={{ iconMark: 'currentColor' }} className="h-4 w-auto" />
  My account
</button>`;

const VUE = `<script setup lang="ts">
import { BrandMark, IconMark } from '@kolektiv/brand-vue';
</script>

<template>
  <BrandMark variant="wordmark" class="h-10 w-auto" title="Kolektiv" />
  <IconMark :colors="{ iconMark: 'currentColor' }" class="h-4 w-auto" />
</template>`;

const SVELTE = `<script lang="ts">
  import { BrandMark, IconMark } from '@kolektiv/brand-svelte';
</script>

<BrandMark variant="computingWordmark" class="h-20 w-auto" title="Kolektiv Computing" />
<IconMark colors={{ iconMark: 'currentColor' }} class="h-4 w-auto" />`;

const VANILLA = `import { createBrandMark, brandVariantMarkup } from '@kolektiv/brand-vanilla';

document.body.append(
  createBrandMark({
    variant: 'iconMark',
    className: 'h-6 w-auto',
    attributes: { 'aria-label': 'Kolektiv', role: 'img' },
  }),
);

const html = brandVariantMarkup('wordmark', { className: 'h-8 w-auto' });`;

export function GettingStarted() {
  return (
    <div>
      <PageTitle>Getting started</PageTitle>
      <Lead>
        Each wrapper re-exports the core API, so a single import gives you the component and
        its types. Marks are sized with <code>className</code> or <code>style</code> and
        forward any native SVG attribute.
      </Lead>

      <Section title="React">
        <CodeSample lang="tsx" code={REACT} />
      </Section>
      <Section title="Vue">
        <CodeSample lang="vue" code={VUE} />
      </Section>
      <Section title="Svelte">
        <CodeSample lang="svelte" code={SVELTE} />
      </Section>
      <Section title="Vanilla">
        <CodeSample lang="ts" code={VANILLA} />
      </Section>
    </div>
  );
}
