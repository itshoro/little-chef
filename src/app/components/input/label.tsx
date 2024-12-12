"use client";

import { useInputContext } from "./context";

const Label = ({
  htmlFor,
  ...props
}: React.ComponentPropsWithoutRef<"label">) => {
  const { name } = useInputContext(Label.name);
  htmlFor = htmlFor ? `${name}.${htmlFor}` : name;

  return (
    <label
      htmlFor={htmlFor}
      data-slot="label"
      className={[
        "text-sm font-medium text-stone-600 transition-colors has-[+[data-slot=control]:focus-within]:text-lime-700",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export { Label };
