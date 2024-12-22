const RadioGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="@container w-full flex-1">
      <div className="flex flex-col justify-between gap-2 @sm:flex-row">
        {children}
      </div>
    </div>
  );
};

export { RadioGroup };
