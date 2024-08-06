const AmountItem = ({
  label,
  amount,
}: {
  label: string;
  amount: string | number;
}) => {
  return (
    <div className="min-w-0 rounded-lg bg-stone-100 px-6 py-4 shadow-sm dark:bg-stone-900">
      <div className="flex justify-between">
        <span className="font-medium capitalize">{label}</span>
        <span>{amount}</span>
      </div>
    </div>
  );
};

export { AmountItem };
