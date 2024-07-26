"use client";

const Radio = ({
  name,
  children,
  value,
  defaultChecked,
  triggerSubmitOnChange,
}: React.ComponentPropsWithoutRef<"input"> & {
  triggerSubmitOnChange?: boolean;
}) => {
  function triggerSubmit(e: React.ChangeEvent) {
    if (triggerSubmitOnChange) {
      (e.target as HTMLInputElement).form?.requestSubmit();
    }
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
        className="group block cursor-pointer rounded-lg border border-transparent px-2 py-3 peer-checked:border-lime-300 peer-checked:bg-lime-300/60 peer-checked:text-green-950 @xs:w-full"
      >
        <div className="flex items-center gap-2 @sm:justify-center">
          {children}
        </div>
      </label>
    </div>
  );
};

export { Radio };
