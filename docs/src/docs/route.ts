import { useSyncExternalStore } from 'react';

export interface NavItem {
  path: string;
  label: string;
}

export const NAV: NavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/getting-started', label: 'Getting started' },
  { path: '/marks', label: 'Marks' },
  { path: '/components', label: 'Components' },
  { path: '/theming', label: 'Theming' },
  { path: '/typography', label: 'Typography' },
  { path: '/themes', label: 'Themes' },
  { path: '/example', label: 'Kitchen sink' },
  { path: '/publishing', label: 'Publishing' },
];

function subscribeHash(listener: () => void): () => void {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === '' || hash === '/' ? '/' : hash.replace(/\/$/, '');
}

export function useHashRoute(): string {
  return useSyncExternalStore(subscribeHash, currentPath, () => '/');
}

export function navigate(path: string): void {
  window.location.hash = path;
}
