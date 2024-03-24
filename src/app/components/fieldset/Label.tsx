const Label = (
  props: Omit<React.ComponentPropsWithoutRef<"legend">, "className">,
) => {
  return <legend className="pb-2 font-medium text-stone-600" {...props} />;
};

export { Label };
