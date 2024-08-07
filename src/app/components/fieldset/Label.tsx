const Label = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"legend">) => {
  return (
    <legend
      {...props}
      className={`pb-2 font-medium text-stone-600 dark:text-white ${className}`}
    >
      <span className="mr-4 inline-block size-2 rounded-full bg-lime-500"></span>
      {children}
    </legend>
  );
};

export { Label };
