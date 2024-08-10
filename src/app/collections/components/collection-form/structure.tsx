import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import * as Input from "@/app/components/input";
import type { Visibility } from "@/lib/dal/visibility";

type InputsProps = {
  defaultValue?: {
    name?: string;
    visibility?: Visibility;
  };
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <>
      <div>
        <Input.Root name="title">
          <Input.Label>Title</Input.Label>
          <Input.Group>
            <Input.Element type="text" autoComplete="off" />
          </Input.Group>
        </Input.Root>
      </div>
      <div>
        <Input.Root name="visibility">
          <Input.Label>Visibility</Input.Label>

          <VisibilitySwitcher
            name="visibility"
            defaultValue={defaultValue?.visibility}
          />
        </Input.Root>
      </div>
    </>
  );
};

export { Inputs };
