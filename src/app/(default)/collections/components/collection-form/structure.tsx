import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import * as Input from "@/app/components/input";
import * as Fieldset from "@/app/components/fieldset";
import type { Visibility } from "@/lib/dal/user/types";

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
          <Input.Label>Name</Input.Label>
          <Input.Group>
            <Input.Element
              required
              autoFocus={true}
              type="text"
              autoComplete="off"
              defaultValue={defaultValue?.name}
            />
          </Input.Group>
        </Input.Root>
      </div>
      <div>
        <Fieldset.Root>
          <Fieldset.Label>Visibility</Fieldset.Label>
          <VisibilitySwitcher
            name="visibility"
            defaultValue={defaultValue?.visibility}
          />
        </Fieldset.Root>
      </div>
    </>
  );
};

export { Inputs };
