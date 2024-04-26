import type { Visibility } from "@/lib/dal/recipe";
import { RadioGroup } from "../primitives/radio-group/group";
import { VisibilityOption } from "./visibility-option";

type VisibilitySwitcherProps = {
  name: string;
  defaultValue?: Visibility;
};

const VisibilitySwitcher = async ({
  name,
  defaultValue,
}: VisibilitySwitcherProps) => {
  return (
    <RadioGroup disabled={defaultValue === undefined}>
      <VisibilityOption
        name={name}
        visibility="public"
        defaultValue={defaultValue}
      />
      <VisibilityOption
        name={name}
        visibility="unlisted"
        defaultValue={defaultValue}
      />
      <VisibilityOption
        name={name}
        visibility="private"
        defaultValue={defaultValue}
      />
    </RadioGroup>
  );
};

export { VisibilitySwitcher };
