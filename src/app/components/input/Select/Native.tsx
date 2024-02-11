"use client";

import { useInputContext } from "../Context";

const Select = (
  props: Omit<React.ComponentPropsWithoutRef<"select">, "className">
) => {
  const { name } = useInputContext(Select.name);

  return (
    <select
      id={name}
      name={name}
      className="min-w-max w-full p-2 group-data-[group=true]:p-1 rounded-lg group-data-[group=true]:rounded outline-none ring-offset-1 focus:ring-2 ring-black focus:bg-stone-100 focus:border-stone-100 border font-medium transition"
      {...props}
    />
  );
};

export { Select };
