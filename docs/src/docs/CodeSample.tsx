import type { ReactNode } from 'react';
import { Code } from './Code';

export function CodeSample({
  code,
  title,
  lang = 'tsx',
}: {
  code: string;
  title?: string;
  lang?: string;
}) {
  return (
    <figure className="min-w-0">
      {title ? (
        <figcaption className="mb-1 text-[11px] uppercase tracking-wide opacity-50">
          {title}
        </figcaption>
      ) : null}
      <Code code={code} lang={lang} className="rounded-lg" />
    </figure>
  );
}

export function PageTitle({ children }: { children: string }) {
  return <h1 className="display mb-2 text-3xl tracking-tight">{children}</h1>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-6 max-w-2xl text-sm opacity-70">{children}</p>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8 space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60">{title}</h2>
      {children}
    </section>
  );
}
