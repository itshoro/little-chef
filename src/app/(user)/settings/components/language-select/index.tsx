import { getLanguages } from "@/lib/dal/app";
import { Select } from "../primitives/select";

type LanguageSwitcherProps = {
  defaultValue?: string;
  name: string;
};

const LanguageSelect = async ({
  defaultValue,
  name,
}: LanguageSwitcherProps) => {
  const languages = await getLanguages();

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
