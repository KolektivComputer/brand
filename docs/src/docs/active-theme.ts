import { useSyncExternalStore } from 'react';
import { getTheme } from '@kolektiv/themes';

const DEFAULT_THEME = 'kolektiv-dark';

const listeners = new Set<() => void>();

export function getActiveTheme(): string {
  return document.documentElement.getAttribute('data-theme') ?? DEFAULT_THEME;
}

export function setActiveTheme(id: string): void {
  document.documentElement.setAttribute('data-theme', id);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveTheme(): string {
  return useSyncExternalStore(subscribe, getActiveTheme, () => DEFAULT_THEME);
}

export function schemeFor(id: string): 'light' | 'dark' {
  if (id === 'light') return 'light';
  if (id === 'dark') return 'dark';
  const theme = getTheme(id);
  if (theme) return theme.scheme;
  return id.includes('light') || id.includes('lig') || id.includes('latte') || id === 'nord'
    ? 'light'
    : 'dark';
}
