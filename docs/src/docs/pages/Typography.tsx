import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

export function Typography() {
  return (
    <div>
      <PageTitle>Typography</PageTitle>
      <Lead>
        Official Kolektiv projects use these typefaces unless they have their own brand
        identity. Inclusive Sans is the display face, always light italic; Source Sans 3 is the
        body face; Iosevka is the code face.
      </Lead>

      <Section title="Display · Inclusive Sans">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8">
          <p className="display text-4xl">Kolektiv Computing</p>
          <p className="display mt-3 text-2xl opacity-80">Software built together</p>
        </div>
        <p className="text-sm opacity-80">
          Inclusive Sans <strong>Light (300) Italic</strong>. Use it for headings, hero lines and
          brand statements — never bold, never upright.
        </p>
      </Section>

      <Section title="Body · Source Sans 3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8">
          <p className="max-w-2xl text-base">
            Source Sans 3 carries long-form text. It stays readable at small sizes and pairs with
            the display face without competing with it.
          </p>
          <p className="mt-3 max-w-2xl text-sm opacity-70">
            Regular (400) for body copy; semibold (600) for emphasis and labels.
          </p>
        </div>
      </Section>

      <Section title="Code · Iosevka">
        <CodeSample
          lang="tsx"
          code={`const mark = <ComputingWordmark className="h-20 w-auto" title="Kolektiv Computing" />;`}
        />
        <p className="text-sm opacity-80">
          Iosevka is the monospace shared by Kolektiv projects (the same as Keel) — used for code
          blocks and anything technical.
        </p>
      </Section>

      <Section title="Using it">
        <CodeSample
          lang="ts"
          code={`import '@fontsource/inclusive-sans/300.css';
import '@fontsource/inclusive-sans/300-italic.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/iosevka/400.css';`}
        />
        <CodeSample
          lang="css"
          code={`@theme {
  --font-display: 'Inclusive Sans', ui-sans-serif, system-ui, sans-serif;
  --font-sans: 'Source Sans 3', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Iosevka', ui-monospace, monospace;
}

.display {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
}`}
        />
      </Section>
    </div>
  );
}
