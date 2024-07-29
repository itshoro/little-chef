import { Radio } from "../primitives/radio-group/radio";
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
  disabled?: boolean;
};

const ThemeOption = ({ theme, activeTheme, disabled }: ThemeOptionProps) => {
  const { label, icon } = themeMap[theme];

  return (
    <Radio
      name="theme"
      value={theme}
      defaultChecked={activeTheme === theme}
      disabled={disabled}
    >
      {icon}
      {label}
    </Radio>
  );
};

export { ThemeOption };
