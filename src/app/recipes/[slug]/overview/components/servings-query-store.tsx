"use client";

import {
  ServingsInput,
  type ServingsInputProps,
} from "@/app/recipes/components/recipe-form/elements/servings-input";
import { useSearchParams } from "next/navigation";

type ServingsQueryStoreProps = Omit<ServingsInputProps, "onChange">;

const ServingsQueryStore = ({
  name,
  defaultValue = 1,
}: ServingsQueryStoreProps) => {
  const params = useSearchParams();

  const sizingParam = parseInt(params.get("servings") ?? "");
  const servings = !isNaN(sizingParam) ? sizingParam : defaultValue;

  if (typeof window !== "undefined" && servings !== sizingParam) {
    const url = new URL(window.location.href);
    url.searchParams.set("servings", servings.toString());

    window.location.replace(url);
  }

  return (
    <ServingsInput
      name={name}
      defaultValue={servings}
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
