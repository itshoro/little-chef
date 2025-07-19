"use client";

import { FieldRoot } from "@/components/ui/controls/field-root";
import { ServingsInput } from "@/components/ui/controls/servings-input";
import { useSearchParamState } from "@/hooks/use-search-params";

type ServingsQueryStoreProps = {
  defaultValue?: number;
  min: number;
};

const ServingsQueryStore = ({
  min,
  defaultValue = 1,
}: ServingsQueryStoreProps) => {
  const [servingParam, setServings] = useSearchParamState("servings");

  let servingAsNumber = parseFloat(servingParam ?? "");
  if (isNaN(servingAsNumber)) servingAsNumber = defaultValue;

  return (
    <FieldRoot name="servings">
      <ServingsInput
        defaultValue={servingAsNumber}
        min={min}
        onChange={(e) => setServings(e.target.value)}
      />
    </FieldRoot>
  );
};

export { ServingsQueryStore };
