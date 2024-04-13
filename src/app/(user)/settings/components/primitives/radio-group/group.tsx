const RadioGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-xl border border-gray-500 bg-white p-2 @container">
      <div className="flex flex-col justify-between @xs:flex-row">
        {children}
      </div>
    </div>
  );
};

export { RadioGroup };
