import { ThemeOption } from "./theme-option";

const ThemeSwitcher = async () => {
  const activeTheme = "light";

  return (
    <form action={switchTheme}>
      <div className="rounded-xl border border-gray-500 bg-white p-2 @container">
        <div className="flex flex-col justify-between @xs:flex-row">
          <ThemeOption theme="light" activeTheme={activeTheme} />
          <ThemeOption theme="dark" activeTheme={activeTheme} />
          <ThemeOption theme="system" activeTheme={activeTheme} />
        </div>
      </div>
    </form>
  );
};

async function switchTheme(formData: FormData) {
  "use server";
}

export { ThemeSwitcher };
