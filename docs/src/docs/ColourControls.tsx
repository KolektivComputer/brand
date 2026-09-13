import { useSyncExternalStore } from 'react';
import { markParts } from '@kolektiv/brand-core';
import {
  CONTROLLED_PARTS,
  FIGMA_COLORS,
  FIGMA_HOVER,
  THEME_TOKENS,
  getState,
  setState,
  subscribe,
  type ControlledPart,
  type PartColor,
  type ThemeToken,
} from '../store';

const PART_LABEL: Record<string, string> = Object.fromEntries(
  markParts.map((part) => [part.key, part.label]),
);

function SwatchRow({
  current,
  onSelect,
}: {
  current: ThemeToken;
  onSelect: (token: ThemeToken) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {THEME_TOKENS.map((token) => (
        <button
          key={token}
          type="button"
          title={token}
          aria-label={token}
          data-selected={current === token}
          className="swatch"
          style={{ background: `var(--color-${token})` }}
          onClick={() => onSelect(token)}
        />
      ))}
    </div>
  );
}

function ColorRow({
  label,
  value,
  onPatch,
}: {
  label: string;
  value: PartColor;
  onPatch: (patch: Partial<PartColor>) => void;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2">
      <span className="text-[11px] uppercase tracking-wide opacity-50">{label}</span>
      <SwatchRow current={value.token} onSelect={(token) => onPatch({ token })} />
      <input
        type="number"
        min={0}
        max={100}
        step={5}
        value={value.opacity}
        aria-label={`${label} opacity`}
        className="input input-bordered input-xs w-16 text-right tabular-nums"
        onChange={(event) => {
          const next = Number(event.target.value);
          onPatch({ opacity: Number.isNaN(next) ? 0 : Math.max(0, Math.min(100, next)) });
        }}
      />
    </div>
  );
}

function updateColor(
  field: 'partColors' | 'hoverColors',
  part: ControlledPart,
  patch: Partial<PartColor>,
): void {
  const current = getState()[field];
  const fallback: PartColor =
    field === 'partColors' ? { token: 'primary', opacity: 100 } : { token: 'accent', opacity: 100 };
  const existing = current[part] ?? fallback;
  setState({ [field]: { ...current, [part]: { ...existing, ...patch } } });
}

export function ColourControls() {
  const state = useSyncExternalStore(subscribe, getState, getState);

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-primary"
          checked={state.hoverEnabled}
          onChange={(event) => setState({ hoverEnabled: event.target.checked })}
        />
        Hover the whole graphic
      </label>

      {CONTROLLED_PARTS.map((part) => (
        <div key={part} className="space-y-1">
          <div className="text-xs font-medium">{PART_LABEL[part] ?? part}</div>
          <ColorRow
            label="base"
            value={state.partColors[part] ?? { token: 'primary', opacity: 100 }}
            onPatch={(patch) => updateColor('partColors', part, patch)}
          />
          <ColorRow
            label="hover"
            value={state.hoverColors[part] ?? { token: 'accent', opacity: 100 }}
            onPatch={(patch) => updateColor('hoverColors', part, patch)}
          />
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-outline btn-xs"
          onClick={() =>
            setState({
              partColors: { ...FIGMA_COLORS },
              hoverColors: { ...FIGMA_HOVER },
              hoverEnabled: true,
            })
          }
        >
          Figma defaults
        </button>
        <button
          type="button"
          className={`btn btn-outline btn-xs ${state.builtByNeutral ? 'btn-neutral' : ''}`}
          onClick={() => setState({ builtByNeutral: !state.builtByNeutral })}
        >
          {state.builtByNeutral ? 'built by: neutral' : 'built by: primary'}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed opacity-50">
        Sizing uses <code>className</code>/<code>style</code>; every mark also forwards native
        SVG attributes.
      </p>
    </div>
  );
}
