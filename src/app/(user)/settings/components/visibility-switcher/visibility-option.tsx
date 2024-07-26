import { Radio } from "../primitives/radio-group/radio";
import { PublicVisibility } from "./icon/public-visibility";
import { PrivateVisibility } from "./icon/private-visibility";
import { UnlistedVisibility } from "./icon/unlisted-visibility";
import type { Visibility } from "@/lib/dal/visibility";

const visibilityMap = {
  public: { label: "Public", icon: <PublicVisibility /> },
  unlisted: { label: "Unlisted", icon: <UnlistedVisibility /> },
  private: { label: "Private", icon: <PrivateVisibility /> },
} as const;

type ThemeOptionProps = {
  name: string;
  visibility: Visibility;
  defaultValue?: Visibility;
  triggerSubmitOnChange?: boolean;
};

const VisibilityOption = ({
  name,
  visibility,
  defaultValue,
  triggerSubmitOnChange,
}: ThemeOptionProps) => {
  const { label, icon } = visibilityMap[visibility];

  return (
    <Radio
      name={name}
      value={visibility}
      defaultChecked={defaultValue === visibility}
      triggerSubmitOnChange={triggerSubmitOnChange}
    >
      <span className="text-neutral-400 peer-checked:group-[]:text-lime-600">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Radio>
  );
};

export { VisibilityOption };
