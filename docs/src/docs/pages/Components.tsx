import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

const PROPS = [
  ['colors', "Partial<Record<BrandMarkPart, string>>", 'per-part base colour (CSS variables on the root)'],
  ['hoverColors', "Partial<Record<BrandMarkPart, string>>", 'per-part hover colour (applies when the graphic is hovered)'],
  ['color / hoverColor', 'string', 'base colour and base hover fallback'],
  ['parts', 'Partial<Record<BrandMarkPart, boolean>>', 'per-part visibility for BrandMark'],
  ['variant', 'BrandMarkVariant', 'preset subset for BrandMark'],
  ['title', 'string', 'adds <title>, role="img" and aria-label'],
  ['className / class', 'string', 'extra classes on the root <svg>; size with e.g. h-16 w-auto'],
  ['style', 'Record<string, string | number>', 'root styles (merged before colors)'],
  ['…svg props', 'SVGProps', 'any native SVG attribute is forwarded to the root <svg>'],
];

export function Components() {
  return (
    <div>
      <PageTitle>Components</PageTitle>
      <Lead>
        <code>BrandMark</code> renders any subset via <code>variant</code> and{' '}
        <code>parts</code>. Each variant is also a standalone, hoverable component:{' '}
        <code>IconMark</code>, <code>Wordmark</code>, <code>ComputingWordmark</code> and{' '}
        <code>BuiltByMark</code>.
      </Lead>

      <Section title="Variant map">
        <CodeSample
          lang="text"
          code={`full              all parts
builtByMark       wordBuiltBy, iconMark, wordOlektiv, wordComputing
computingWordmark iconMark, wordOlektiv, wordComputing
wordmark          iconMark, wordOlektiv
iconMark          iconMark`}
        />
      </Section>

      <Section title="Props">
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>prop</th>
                <th>type</th>
                <th>description</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map(([name, type, description]) => (
                <tr key={name}>
                  <td className="font-mono text-xs">{name}</td>
                  <td className="font-mono text-xs opacity-70">{type}</td>
                  <td className="text-xs opacity-80">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Local overrides">
        <p className="text-sm opacity-80">
          Anything passed to a specific mark wins over the app-wide theme — that is how button
          icons inherit their surrounding colour:
        </p>
        <CodeSample
          lang="tsx"
          code={`// K icon takes the button's currentColor, ignoring theme.css
<button className="btn btn-outline">
  <IconMark colors={{ iconMark: 'currentColor' }} className="h-4 w-auto" />
  My account
</button>

// A one-off mark on a dark surface
<Wordmark
  className="h-9 w-auto"
  colors={{ iconMark: '#d8a5f0', wordOlektiv: '#c9a9ee' }}
/>`}
        />
      </Section>
    </div>
  );
}
