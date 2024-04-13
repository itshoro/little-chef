import { RadioGroup } from "../primitives/radio-group/group";
import { ThemeOption } from "./theme-option";

const ThemeSwitcher = async () => {
  const activeTheme = "light";

  return (
    <form action={switchTheme}>
      <RadioGroup>
        <ThemeOption theme="light" activeTheme={activeTheme} />
        <ThemeOption theme="dark" activeTheme={activeTheme} />
        <ThemeOption theme="system" activeTheme={activeTheme} />
      </RadioGroup>
    </form>
  );
};

async function switchTheme(formData: FormData) {
  "use server";
}

export { ThemeSwitcher };
