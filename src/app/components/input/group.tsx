"use client";

const Group = (props: { children: React.ReactNode }) => {
  return (
    <div
      data-group="true"
      className="group peer relative flex w-full rounded-lg border border-neutral-200 bg-neutral-100 font-medium outline-none outline-offset-0 ring-0 transition focus-within:!border-green-600/40 focus-within:outline-4 focus-within:outline-green-400/10 dark:border-stone-700 dark:bg-stone-900"
      {...props}
    />
  );
};

export { Group };
