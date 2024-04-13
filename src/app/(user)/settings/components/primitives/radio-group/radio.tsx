"use client";

const Radio = ({
  name,
  children,
  value,
  defaultChecked,
}: React.ComponentPropsWithoutRef<"input">) => {
  function triggerSubmit(e: React.ChangeEvent) {
    (e.target as HTMLInputElement).form?.requestSubmit();
  }

  return (
    <div className="flex-1">
      <input
        className="peer hidden"
        type="radio"
        name={name}
        value={value}
        id={`${name}-${value}`}
        defaultChecked={defaultChecked}
        onChange={triggerSubmit}
      />
      <label
        tabIndex={0}
        htmlFor={`${name}-${value}`}
        className="block cursor-pointer rounded-xl border-2 border-transparent p-2 peer-checked:border-lime-300 peer-checked:bg-lime-300 @xs:w-full"
      >
        <div className="flex items-center gap-2 @xs:flex-col">{children}</div>
      </label>
    </div>
  );
};

export { Radio };
