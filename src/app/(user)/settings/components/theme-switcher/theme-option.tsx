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
};

const ThemeOption = ({ theme, activeTheme }: ThemeOptionProps) => {
  const { label, icon } = themeMap[theme];

  return (
    <Radio name="theme" value={theme} defaultChecked={activeTheme === theme}>
      {icon}
      {label}
    </Radio>
  );
};

export { ThemeOption };
