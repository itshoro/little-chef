"use client";

import {
  ServingsInput,
  type ServingsInputProps,
} from "@/app/recipes/components/recipe-form/elements/servings-input";
import { useSearchParams } from "next/navigation";

type ServingsQueryStoreProps = Omit<ServingsInputProps, "onChange">;

const ServingsQueryStore = (props: ServingsQueryStoreProps) => {
  const params = useSearchParams();

  const sizingParam = Number(params.get("servings"));
  const defaultValue = !isNaN(sizingParam) ? sizingParam : props.defaultValue;

  return (
    <ServingsInput
      {...props}
      defaultValue={defaultValue}
      onChange={(e) => {
        const searchParams = new URLSearchParams(params);
        searchParams.set("servings", e.target.value);
        debugger;
        window.history.replaceState(null, "", `?${searchParams.toString()}`);
      }}
    />
  );
};

export { ServingsQueryStore };
