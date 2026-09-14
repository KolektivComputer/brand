import { CodeSample, Lead, PageTitle, Section } from '../CodeSample';

export function Publishing() {
  return (
    <div>
      <PageTitle>Publishing</PageTitle>
      <Lead>
        The <code>@kolektiv/brand-*</code> packages are published to the hosted{' '}
        <code>brand-npm</code> repository and fetched from the aggregated{' '}
        <code>npm-public</code> group. Tagging and releases mirror Keel.
      </Lead>

      <Section title="Packages">
        <ul className="list-disc space-y-1 pl-5 text-sm opacity-80">
          <li>
            <code>@kolektiv/brand-core</code> — generated data + renderers, <code>theme.css</code>
          </li>
          <li>
            <code>@kolektiv/brand-react</code> / <code>-vue</code> / <code>-svelte</code> /{' '}
            <code>-solid</code> / <code>-preact</code> / <code>-lit</code> /{' '}
            <code>-angular</code> / <code>-vanilla</code> — framework wrappers
          </li>
          <li>
            <code>@kolektiv/themes</code> — colour-only tokens → daisyUI CSS, Shiki themes and{' '}
            <code>tokens.json</code> (separate repository)
          </li>
        </ul>
      </Section>

      <Section title="Fetching (consumers)">
        <p className="text-sm opacity-80">
          Every Kolektiv project resolves public packages from the <code>npm-public</code>{' '}
          group, which aggregates each project&apos;s hosted repository. Configure once:
        </p>
        <CodeSample
          lang="text"
          code={`# .npmrc
@kolektiv:registry=https://repo.yuri.capital/repository/npm-public/`}
        />
      </Section>

      <Section title="Publishing (this repository)">
        <p className="text-sm opacity-80">
          <code>pnpm publish:packages</code> pushes to <code>brand-npm</code>; the Publish
          workflow does the same on any <code>v*</code> tag and then verifies anonymously
          against <code>npm-public</code>.
        </p>
        <CodeSample
          lang="bash"
          code={`pnpm build:packages
pnpm pack:packages        # inspect tarballs
pnpm publish:packages     # -> brand-npm`}
        />
      </Section>

      <Section title="Tagging &amp; releases">
        <p className="text-sm opacity-80">
          Versioning is tag-driven, exactly like Keel:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm opacity-80">
          <li>
            Bump <code>version</code> in the workspace packages and add a{' '}
            <code>## [x.y.z]</code> section to <code>CHANGELOG.md</code>.
          </li>
          <li>
            Commit, then push a tag: <code>git tag v0.1.0 &amp;&amp; git push origin v0.1.0</code>.
          </li>
          <li>
            <code>release.yml</code> creates/updates the GitHub Release with the changelog
            section (SNAPSHOT versions are prereleases).
          </li>
          <li>
            <code>publish.yml</code> builds and publishes to <code>brand-npm</code>, then
            verifies resolution from <code>npm-public</code>.
          </li>
        </ol>
        <p className="text-xs opacity-60">
          Secrets: <code>YURI_CAPITAL_REPO_USERNAME</code> /{' '}
          <code>YURI_CAPITAL_REPO_PASSWORD</code>. Optional build variable{' '}
          <code>VITE_DOCS_SITE</code> sets the deployed docs origin.
        </p>
      </Section>

      <Section title="Docs site">
        <p className="text-sm opacity-80">
          This site is built from <code>docs/</code> to the repository-root <code>dist/</code>{' '}
          and deployed to Cloudflare Pages through its Git integration.
        </p>
      </Section>
    </div>
  );
}
