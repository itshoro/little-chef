type PreferenceProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

const Fieldset = ({ label, children }: PreferenceProps) => {
  return (
    <fieldset className="rounded-xl bg-stone-100 p-3">
      <legend className="sr-only">{label}</legend>
      <div className="mb-2 text-sm">{label}</div>
      {children}
    </fieldset>
  );
};

export { Fieldset };
