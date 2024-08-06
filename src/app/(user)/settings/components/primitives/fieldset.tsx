type FieldsetProps = {
  label: string;
} & Omit<React.ComponentPropsWithoutRef<"fieldset">, "className">;

const Fieldset = ({ label, children, ...props }: FieldsetProps) => {
  return (
    <fieldset
      className="rounded-xl bg-stone-100 p-3 dark:bg-stone-900"
      {...props}
    >
      <legend className="sr-only">{label}</legend>
      <div className="mb-2 text-sm">{label}</div>
      {children}
    </fieldset>
  );
};

export { Fieldset };
