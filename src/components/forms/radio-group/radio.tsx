"use client";

const Radio = ({
  id,
  children,
  triggerSubmitOnChange,
  ...props
}: React.ComponentPropsWithoutRef<"input"> & {
  triggerSubmitOnChange?: boolean;
}) => {
  function triggerSubmit(e: React.ChangeEvent) {
    if (triggerSubmitOnChange) {
      (e.target as HTMLInputElement).form?.requestSubmit();
    }
  }

  id = id !== undefined ? id : `${props.name}-${props.value}`;

  return (
    <div className="flex-1">
      <input
        {...props}
        className="peer hidden"
        type="radio"
        id={id}
        onChange={triggerSubmit}
      />
      <label
        tabIndex={0}
        htmlFor={id}
        className="group block cursor-pointer rounded-lg border border-transparent px-2 py-3 peer-checked:border-lime-300 peer-checked:bg-lime-300/60 peer-checked:text-green-950 peer-disabled:cursor-not-allowed peer-disabled:text-neutral-300 @xs:w-full dark:peer-checked:border-lime-300 dark:peer-checked:bg-lime-300 dark:peer-disabled:text-neutral-800"
      >
        <div className="flex items-center gap-2 @sm:justify-center">
          {children}
        </div>
      </label>
    </div>
  );
};

export { Radio };
