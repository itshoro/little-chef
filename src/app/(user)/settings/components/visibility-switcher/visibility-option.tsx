import { Radio } from "../primitives/radio-group/radio";
import { PublicVisibility } from "./icon/public-visibility";
import { PrivateVisibility } from "./icon/private-visibility";
import { UnlistedVisibility } from "./icon/unlisted-visibility";
import type { Visibility } from "@/lib/dal/recipe";

const visibilityMap = {
  public: { label: "Public", icon: <PublicVisibility /> },
  unlisted: { label: "Unlisted", icon: <UnlistedVisibility /> },
  private: { label: "Private", icon: <PrivateVisibility /> },
} as const;

type ThemeOptionProps = {
  name: string;
  visibility: Visibility;
  defaultValue?: Visibility;
};

const VisibilityOption = ({
  name,
  visibility,
  defaultValue,
}: ThemeOptionProps) => {
  const { label, icon } = visibilityMap[visibility];

  return (
    <Radio
      name={name}
      value={visibility}
      defaultChecked={defaultValue === visibility}
    >
      {icon}
      {label}
    </Radio>
  );
};

export { VisibilityOption };
