import { RadioGroup } from "../primitives/radio-group/group";
import { ThemeOption } from "./theme-option";

const ThemeSwitcher = async () => {
  const activeTheme = "light";

  return (
    <RadioGroup>
      <ThemeOption theme="light" activeTheme={activeTheme} />
      <ThemeOption disabled={true} theme="dark" activeTheme={activeTheme} />
      <ThemeOption disabled={true} theme="system" activeTheme={activeTheme} />
    </RadioGroup>
  );
};

export { ThemeSwitcher };
