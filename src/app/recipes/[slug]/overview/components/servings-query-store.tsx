"use client";

import {
  ServingsInput,
  type ServingsInputProps,
} from "@/app/recipes/components/recipe-form/elements/servings-input";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ServingsQueryStoreProps = Omit<ServingsInputProps, "onChange">;

const ServingsQueryStore = ({
  defaultValue = 1,
  ...props
}: ServingsQueryStoreProps) => {
  const params = useSearchParams();

  const sizingParam = parseInt(params.get("servings") ?? "");
  const servings = isNaN(sizingParam) ? defaultValue : sizingParam;

  useEffect(() => {
    if (servings !== sizingParam) {
      const url = new URL(window.location.href);
      url.searchParams.set("servings", servings.toString());
      window.location.replace(url);
    }
  }, [servings, sizingParam]);

  return (
    <ServingsInput
      {...props}
      defaultValue={servings}
      onChange={(e) => {
        const searchParams = new URLSearchParams(params);
        searchParams.set("servings", e.target.value);
        window.history.replaceState(null, "", `?${searchParams.toString()}`);
      }}
    />
  );
};

export { ServingsQueryStore };
