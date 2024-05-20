import type { Visibility } from "@/lib/dal/recipe";
import { RadioGroup } from "../primitives/radio-group/group";
import { VisibilityOption } from "./visibility-option";

type VisibilitySwitcherProps = {
  name: string;
  defaultValue?: Visibility;
  triggerSubmitOnChange?: boolean;
};

const VisibilitySwitcher = async ({
  name,
  defaultValue,
  triggerSubmitOnChange,
}: VisibilitySwitcherProps) => {
  return (
    <RadioGroup disabled={defaultValue === undefined}>
      <VisibilityOption
        name={name}
        visibility="public"
        triggerSubmitOnChange={triggerSubmitOnChange}
        defaultValue={defaultValue}
      />
      <VisibilityOption
        name={name}
        visibility="unlisted"
        triggerSubmitOnChange={triggerSubmitOnChange}
        defaultValue={defaultValue}
      />
      <VisibilityOption
        name={name}
        visibility="private"
        triggerSubmitOnChange={triggerSubmitOnChange}
        defaultValue={defaultValue}
      />
    </RadioGroup>
  );
};

export { VisibilitySwitcher };
