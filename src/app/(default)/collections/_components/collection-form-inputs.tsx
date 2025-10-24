import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { VisibilitySwitcher } from "@/components/ui/controls/visibility-switcher";
import type { Collection } from "@/lib/domain/collection/collection";

type InputsProps = {
  defaultValue?: Partial<Collection>;
};

const Inputs = ({ defaultValue }: InputsProps) => {
  return (
    <>
      <FieldRoot name="publicId">
        <Input type="hidden" value={defaultValue?.publicId} />
      </FieldRoot>
      <div>
        <FieldRoot name="name">
          <Label>Name</Label>
          <Input
            autoFocus={true}
            autoComplete="off"
            defaultValue={defaultValue?.name}
          />
        </FieldRoot>
      </div>
      <div>
        <FieldRoot name="visibility">
          <Label>Visibility</Label>
          <VisibilitySwitcher defaultValue={defaultValue?.visibility} />
        </FieldRoot>
      </div>
    </>
  );
};

export { Inputs };
