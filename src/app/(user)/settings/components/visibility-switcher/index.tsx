import type { Visibility } from "@/lib/dal/user/types";
import { RadioGroup } from "../primitives/radio-group/group";
import { VisibilityOption } from "./visibility-option";

type VisibilitySwitcherProps = {
  name: string;
  defaultValue?: Visibility;
};

const VisibilitySwitcher = ({
  name,
  defaultValue,
}: VisibilitySwitcherProps) => {
  return (
    <RadioGroup>
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
