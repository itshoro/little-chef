const RadioGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex-1 rounded-xl border bg-neutral-100 p-1 @container dark:border-stone-700 dark:bg-black">
      <div className="flex flex-col justify-between @sm:flex-row">
        {children}
      </div>
    </div>
  );
};

export { RadioGroup };
