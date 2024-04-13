import { getPrismaClient } from "@/lib/prisma";
import { Select } from "./select";

type LanguageSwitcherProps = {
  defaultValue?: string;
};

const LanguageSelect = async ({ defaultValue }: LanguageSwitcherProps) => {
  const client = getPrismaClient();
  const languages = await client.language.findMany();

  return (
    <form action={changeAppLanguage}>
      <Select className="w-full rounded-lg" defaultValue={defaultValue}>
        {languages.map((language) => (
          <option value={language.code}>{language.name}</option>
        ))}
      </Select>
    </form>
  );
};

async function changeAppLanguage(formData: FormData) {
  "use server";
}

export { LanguageSelect };
