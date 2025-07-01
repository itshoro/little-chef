"use client";

import {
  ServingsInput,
  type ServingsInputProps,
} from "@/components/recipes/recipe-form/elements/servings/input";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as Input from "@/components/forms/input";

type ServingsQueryStoreProps = Omit<ServingsInputProps, "onChange"> & {
  name?: string;
};

const ServingsQueryStore = ({
  defaultValue = 1,
  name = "servings",
  ...props
}: ServingsQueryStoreProps) => {
  const params = useSearchParams();

  const sizingParam = parseFloat(params.get("servings") ?? "");
  const servings = isNaN(sizingParam) ? defaultValue : sizingParam;

  useEffect(() => {
    if (servings !== sizingParam) {
      const url = new URL(window.location.href);
      url.searchParams.set("servings", servings.toString());
      window.location.replace(url);
    }
  }, [servings, sizingParam]);

  return (
    <Input.Root name={name}>
      <Input.Label className="mb-2">Servings</Input.Label>
      <ServingsInput
        {...props}
        defaultValue={servings}
        onChange={(e) => {
          const searchParams = new URLSearchParams(params);
          searchParams.set("servings", e.target.value);
          window.history.replaceState(null, "", `?${searchParams.toString()}`);
        }}
      />
    </Input.Root>
  );
};

export { ServingsQueryStore };
