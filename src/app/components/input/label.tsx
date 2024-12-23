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
      {...props}
      htmlFor={htmlFor}
      data-slot="label"
      className={[
        "inline-block text-sm font-medium text-stone-600 transition-colors has-[+[data-slot=control]_:required]:after:ml-0.5 has-[+[data-slot=control]_:required]:after:text-lime-500 has-[+[data-slot=control]_:required]:after:content-['*'] has-[+[data-slot=control]:focus-within]:text-lime-700",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export { Label };
