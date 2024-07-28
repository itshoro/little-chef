const BaseButton = (props: React.ComponentPropsWithoutRef<"button">) => (
  <button
    {...props}
    className={
      "inline-flex justify-center rounded-xl border-2 px-5 py-4 shadow active:bg-neutral-100 disabled:pointer-events-none disabled:text-neutral-200 disabled:shadow-none " +
      props.className
    }
  />
);

export { BaseButton };
