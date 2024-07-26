const Label = ({
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"legend">, "className">) => {
  return (
    <legend className="pb-2 font-medium text-stone-600" {...props}>
      <span className="mr-4 inline-block size-2 rounded-full bg-lime-500"></span>
      {children}
    </legend>
  );
};

export { Label };
