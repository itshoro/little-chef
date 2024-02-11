"use client";

const Group = (props: { children: React.ReactNode }) => {
  return (
    <div
      data-group="true"
      className="group flex rounded-lg hover:bg-stone-100 hover:border-stone-100 focus:bg-stone-100 focus:border-stone-100 border font-medium w-full transition"
      {...props}
    />
  );
};

export { Group };
