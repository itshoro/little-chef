const RadioGroup = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-gray-500 bg-white p-1.5 @container">
      <div className="flex flex-col justify-between @xs:flex-row">
        {children}
      </div>
    </div>
  );
};

export { RadioGroup };
