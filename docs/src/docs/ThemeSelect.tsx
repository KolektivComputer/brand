import {
  setActiveCodeTheme,
  setActiveTheme,
  THEME_GROUPS,
  useActiveCodeTheme,
  useActiveTheme,
} from './active-theme';

function FamilyOptions() {
  return (
    <>
      {THEME_GROUPS.map((group) => (
        <optgroup key={group.family} label={group.label}>
          {group.themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}

export function ThemeSelect() {
  const active = useActiveTheme();
  const codeTheme = useActiveCodeTheme();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        <span className="text-xs opacity-60">Theme</span>
        <select
          className="select select-bordered select-sm"
          value={active}
          onChange={(event) => setActiveTheme(event.target.value)}
        >
          <FamilyOptions />
        </select>
      </label>

      <label className="flex items-center gap-2">
        <span className="text-xs opacity-60">Code</span>
        <select
          className="select select-bordered select-sm"
          value={codeTheme}
          onChange={(event) => setActiveCodeTheme(event.target.value)}
        >
          <option value="follow">Follow site theme</option>
          <FamilyOptions />
        </select>
      </label>
    </div>
  );
}
