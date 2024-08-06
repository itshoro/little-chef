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
      className={[
        "block pb-1 font-medium text-stone-600 group-data-[parent=true]:text-sm dark:text-stone-400",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export { Label };
