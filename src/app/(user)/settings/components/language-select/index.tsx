import { getPrismaClient } from "@/lib/prisma";
import { Select } from "../primitives/select";

type LanguageSwitcherProps = {
  defaultValue?: string;
  name: string
};

const LanguageSelect = async ({ defaultValue, name }: LanguageSwitcherProps) => {
  const client = getPrismaClient();
  const languages = await client.language.findMany();

  return (
    <Select name={name} defaultValue={defaultValue}>
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.name}
        </option>
      ))}
    </Select>
  );
};

export { LanguageSelect };
