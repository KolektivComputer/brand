import { themes } from '@kolektiv/themes';
import { setActiveTheme, useActiveTheme } from './active-theme';

const BASE_THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const ALL_THEMES = [...BASE_THEMES, ...themes.map(({ id, label }) => ({ id, label }))];

export function ThemeSelect() {
  const active = useActiveTheme();

  return (
    <label className="flex items-center gap-2">
      <span className="text-xs opacity-60">Theme</span>
      <select
        className="select select-bordered select-sm"
        value={active}
        onChange={(event) => setActiveTheme(event.target.value)}
      >
        {ALL_THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}
