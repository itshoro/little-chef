import * as Fieldset from "@/components/forms/fieldset";
import * as Input from "@/components/forms/input";
import { VisibilitySwitcher } from "@/components/forms/visibility-switcher";
import type { DrizzleCollection } from "@/drizzle/schema";

type InputsProps = {
  defaultValue?: {
    name?: string;
    visibility?: DrizzleCollection["visibility"];
  };
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <>
      <div>
        <Input.Root name="name">
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
          <Input.InlineError />
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
