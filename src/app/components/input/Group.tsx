"use client";

const Group = (props: { children: React.ReactNode }) => {
  return (
    <div
      data-group="true"
      className="group flex rounded-lg bg-white shadow-sm focus-within:!border-green-600/40 border font-medium w-full transition outline-none outline-offset-0 focus-within:outline-4 focus-within:outline-green-400/10"
      {...props}
    />
  );
};

export { Group };
