import { useSyncExternalStore } from 'react';
import { BuiltByMark, ComputingWordmark, IconMark, Wordmark } from '@kolektiv/brand-react';
import { getState, subscribe, variantProps } from '../store';

const NAV_LINKS = ['Product', 'Docs', 'Pricing', 'Blog'];

const FOOTER_COLUMNS = [
  { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Docs', 'Community', 'Status', 'Security'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Licenses', 'Cookies'] },
];

const DARK_MARK_COLORS = {
  iconMark: '#d8a5f0',
  wordOlektiv: '#c9a9ee',
  wordComputing: '#c9a9ee',
};

export function KitchenSink() {
  const state = useSyncExternalStore(subscribe, getState, getState);
  const { colors, hoverColors } = variantProps(state);

  const cssFooterClass = state.builtByNeutral
    ? 'kolektiv-brand-theme kolektiv-brand-built-by-neutral'
    : 'kolektiv-brand-theme';

  return (
    <div className="bg-base-100">
      {/* Navbar — "Kolektiv" wordmark, links, and a locally overridden icon in a button. */}
      <nav className="navbar min-h-0 border-b border-base-300 bg-base-100 px-4">
        <div className="flex flex-1 items-center">
          <div className="flex h-7 items-center">
            <Wordmark colors={colors} hoverColors={hoverColors} width="auto" height={22} />
          </div>
        </div>
        <div className="hidden flex-none items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`/${link.toLowerCase()}`} className="btn btn-ghost btn-xs">
              {link}
            </a>
          ))}
          <button type="button" className="btn btn-outline btn-xs gap-1.5">
            <IconMark colors={{ iconMark: 'currentColor' }} width="auto" height={14} />
            My account
          </button>
        </div>
      </nav>

      {/* Hero — "Kolektiv Computing" wordmark. */}
      <section className="border-b border-base-300 bg-linear-to-b from-base-100 to-base-300 px-6 py-14 text-center">
        <div className="badge badge-outline badge-sm mb-4">Now in beta</div>
        <div className="flex justify-center">
          <ComputingWordmark
            colors={colors}
            hoverColors={hoverColors}
            width="min(100%, 26rem)"
          />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
          Shared workspaces, shared ownership, built together. Kolektiv Computing makes tools
          for collective software.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" className="btn btn-primary btn-sm gap-1.5">
            <IconMark colors={{ iconMark: 'currentColor' }} width="auto" height={14} />
            Start a workspace
          </button>
          <button type="button" className="btn btn-ghost btn-sm">
            Read the docs
          </button>
        </div>
      </section>

      {/* Footer — columns of links, the full built-by mark, and a short byline. */}
      <footer className="border-t border-base-300 bg-base-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <BuiltByMark colors={colors} hoverColors={hoverColors} className="w-auto h-[56px]" />
            <p className="text-xs opacity-60 mt-2">
              High quality FOSS libraries & software for getting sh*t done.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title}>
              <h6 className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">
                {column.title}
              </h6>
              <ul className="space-y-1 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href={`/${link.toLowerCase()}`} className="link link-hover opacity-80">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </footer>
    </div>
  );
}
