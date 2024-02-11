"use client";

import { useInputContext } from "./Context";

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
        "block group-data-[parent=true]:text-sm pb-1 font-medium text-stone-600",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
};

export { Label };
