"use client";

import * as Input from "@/app/components/input";
import { useEffect, useState } from "react";

type SlugInputProps = {
  inputName: string;
};

const SlugInput = ({ inputName }: SlugInputProps) => {
  const slug = useSlugFromInput(inputName);

  return (
    <Input.Root name="slug">
      <Input.Group>
        <Input.Element type="text" value={slug} readOnly={true} />
      </Input.Group>
    </Input.Root>
  );
};

function useSlugFromInput(inputName: string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const target = document.querySelector(
      `input[name=${inputName}]`,
    ) as React.ElementRef<"input"> | null;
    if (!target) return;

    function updateValue(e: Event) {
      setValue((e.target as React.ElementRef<"input">).value);
    }

    target.addEventListener("input", updateValue);
    return () => target.removeEventListener("input", updateValue);
  }, [inputName]);

  return value.toLowerCase().split(" ").filter(Boolean).join("-");
}

export { SlugInput };
