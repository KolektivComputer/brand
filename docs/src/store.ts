import type { BrandMarkColors, BrandMarkPart } from '@kolektiv/brand-core';

export const THEME_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'base-content',
  'info',
  'success',
  'warning',
  'error',
] as const;

export type ThemeToken = (typeof THEME_TOKENS)[number];

export const CONTROLLED_PARTS = ['iconMark', 'wordOlektiv', 'wordComputing', 'wordBuiltBy'] as const;
export type ControlledPart = (typeof CONTROLLED_PARTS)[number];

export interface PartColor {
  token: ThemeToken;
  opacity: number;
}

export interface PlaygroundState {
  partColors: Partial<Record<BrandMarkPart, PartColor>>;
  hoverColors: Partial<Record<BrandMarkPart, PartColor>>;
  hoverEnabled: boolean;
  builtByNeutral: boolean;
}

export function colorFrom(token: ThemeToken, opacity: number): string {
  const clamped = Math.max(0, Math.min(100, opacity));
  const base = `var(--color-${token})`;
  return clamped >= 100 ? base : `color-mix(in srgb, ${base} ${clamped}%, transparent)`;
}

export const FIGMA_COLORS: PlaygroundState['partColors'] = {
  iconMark: { token: 'primary', opacity: 100 },
  wordOlektiv: { token: 'primary', opacity: 75 },
  wordComputing: { token: 'primary', opacity: 80 },
  wordBuiltBy: { token: 'primary', opacity: 80 },
};

export const FIGMA_HOVER: PlaygroundState['hoverColors'] = {
  iconMark: { token: 'accent', opacity: 100 },
  wordOlektiv: { token: 'accent', opacity: 100 },
  wordComputing: { token: 'accent', opacity: 80 },
  wordBuiltBy: { token: 'neutral', opacity: 80 },
};

export function initialState(): PlaygroundState {
  return {
    partColors: { ...FIGMA_COLORS },
    hoverColors: { ...FIGMA_HOVER },
    hoverEnabled: true,
    builtByNeutral: false,
  };
}

let state: PlaygroundState = initialState();

const listeners = new Set<() => void>();

export function getState(): PlaygroundState {
  return state;
}

export function setState(patch: Partial<PlaygroundState>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function mapPartColors(
  source: Partial<Record<BrandMarkPart, PartColor>>,
): BrandMarkColors {
  const colors: BrandMarkColors = {};
  for (const part of CONTROLLED_PARTS) {
    const partColor = source[part];
    if (partColor) colors[part] = colorFrom(partColor.token, partColor.opacity);
  }
  return colors;
}

/** Derive the props shared by every variant component from the store state. */
export function variantProps(current: PlaygroundState): {
  colors: BrandMarkColors;
  hoverColors?: BrandMarkColors;
} {
  return {
    colors: mapPartColors(current.partColors),
    hoverColors: current.hoverEnabled ? mapPartColors(current.hoverColors) : undefined,
  };
}
