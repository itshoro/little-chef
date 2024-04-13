import { getPrismaClient } from "@/lib/prisma";
import { Select } from "../primitives/select";

type LanguageSwitcherProps = {
  action: (formData: FormData) => void;
  defaultValue?: string;
};

const LanguageSelect = async ({
  action,
  defaultValue,
}: LanguageSwitcherProps) => {
  const client = getPrismaClient();
  const languages = await client.language.findMany();

  return (
    <form action={action}>
      <Select defaultValue={defaultValue}>
        {languages.map((language) => (
          <option value={language.code}>{language.name}</option>
        ))}
      </Select>
    </form>
  );
};

export { LanguageSelect };
