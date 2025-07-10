import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { VisibilitySwitcher } from "@/components/ui/controls/visibility-switcher";
import type { CollectionOutputPublicDTO } from "@/lib/services/collection/types";

type InputsProps = {
  defaultValue?: Partial<CollectionOutputPublicDTO>;
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
