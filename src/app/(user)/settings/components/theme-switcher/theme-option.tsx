"use client";

import { DarkTheme } from "./icon/dark-theme";
import { LightTheme } from "./icon/light-theme";
import { SystemTheme } from "./icon/system-theme";

type Theme = "dark" | "light" | "system";

const themeMap = {
  dark: { label: "Dark", icon: <DarkTheme /> },
  light: { label: "Light", icon: <LightTheme /> },
  system: { label: "System", icon: <SystemTheme /> },
} as const;

type ThemeOptionProps = {
  theme: Theme;
  activeTheme: Theme;
};

const ThemeOption = ({ theme, activeTheme }: ThemeOptionProps) => {
  const { label, icon } = themeMap[theme];

  function triggerSubmit(e: React.ChangeEvent) {
    (e.target as HTMLInputElement).form?.requestSubmit();
  }

  return (
    <div className="flex-1">
      <input
        className="peer hidden"
        type="radio"
        name="theme"
        value={theme}
        id={`theme-${theme}`}
        defaultChecked={activeTheme === theme}
        onChange={triggerSubmit}
      />
      <label
        tabIndex={0}
        htmlFor={`theme-${theme}`}
        className="block cursor-pointer rounded-xl border-2 border-transparent p-2 peer-checked:border-lime-300 peer-checked:bg-lime-300 @xs:w-full"
      >
        <div className="flex items-center gap-2 @xs:flex-col">
          {icon}
          {label}
        </div>
      </label>
    </div>
  );
};

export { ThemeOption };
