"use client";

import {
  useFormStateContext,
  type FormState,
} from "@/components/forms/form/root";
import { ServingsInput, type ServingsInputProps } from "./input";
import type { CreateRecipeControls } from "../../../../../app/(default)/recipes/add/action";

const ServingsInputWithFormFallback = (props: ServingsInputProps) => {
  const formStateContext = useFormStateContext(
    "ServingsInputWithFormFallback",
  ) as FormState<CreateRecipeControls>;

  const defaultValue =
    (formStateContext.success === false &&
      formStateContext.controls?.servings) ||
    props.defaultValue;

  return <ServingsInput {...props} defaultValue={defaultValue} />;
};

export { ServingsInputWithFormFallback };
