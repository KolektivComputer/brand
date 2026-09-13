import type { ComponentType } from 'react';
import { BuiltByMark, Wordmark } from '@kolektiv/brand-react';
import { ColourControls } from './ColourControls';
import { ThemeSelect } from './ThemeSelect';
import { NAV, useHashRoute } from './route';
import { Components } from './pages/Components';
import { Example } from './pages/Example';
import { GettingStarted } from './pages/GettingStarted';
import { Marks } from './pages/Marks';
import { Overview } from './pages/Overview';
import { Publishing } from './pages/Publishing';
import { Themes } from './pages/Themes';
import { Theming } from './pages/Theming';
import { Typography } from './pages/Typography';

const PAGES: Record<string, ComponentType> = {
  '/': Overview,
  '/getting-started': GettingStarted,
  '/marks': Marks,
  '/components': Components,
  '/theming': Theming,
  '/typography': Typography,
  '/themes': Themes,
  '/example': Example,
  '/publishing': Publishing,
};

function NotFound() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Not found</h1>
      <p className="text-sm opacity-70">
        That page does not exist. Pick one from the sidebar.
      </p>
    </div>
  );
}

export function DocsApp() {
  const route = useHashRoute();
  const Page = PAGES[route] ?? NotFound;
  const label = NAV.find((item) => item.path === route)?.label ?? 'Not found';

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[19rem_1fr]">
      <aside className="border-b border-base-300 bg-base-200 lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-4 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <a href="#/" className="flex items-center gap-2 px-1">
            <Wordmark className="h-6 w-auto" />
            <span className="text-[11px] uppercase tracking-wider opacity-50">brand</span>
          </a>

          <ul className="menu w-full gap-1 p-0 text-sm">
            {NAV.map((item) => (
              <li key={item.path}>
                <a href={`#${item.path}`} className={route === item.path ? 'active' : ''}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-base-300 pt-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider opacity-60">
              Playground controls
            </h3>
            <ColourControls />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="navbar sticky top-0 z-10 border-b border-base-300 bg-base-100/90 px-6 backdrop-blur">
          <div className="display flex-1 text-lg">{label}</div>
          <ThemeSelect />
        </header>

        <main className="mx-auto max-w-4xl px-6 py-8">
          <Page />
        </main>

        <footer className="mx-auto max-w-4xl px-6 pb-10">
          <div className="border-t border-base-300 pt-6">
            <BuiltByMark className="h-10 w-auto" />
            <p className="mt-2 text-xs opacity-60">
              © 2026 Kolektiv Computing ·{' '}
              <a
                href={import.meta.env.VITE_DOCS_SITE ?? 'https://brand.kolektiv.computer'}
                className="link link-hover"
              >
                brand.kolektiv.computer
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
