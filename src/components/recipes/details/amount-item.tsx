const AmountItem = ({
  label,
  amount,
}: {
  label: string;
  amount: string | number;
}) => {
  return (
    <div className="-mx-4 min-w-0 rounded-lg px-4 py-2 hover:bg-stone-100 hover:dark:bg-stone-800">
      <div className="flex justify-between">
        <span className="text-stone-400 capitalize">{label}</span>
        <span className="font-medium">{amount}</span>
      </div>
    </div>
  );
};

export { AmountItem };
