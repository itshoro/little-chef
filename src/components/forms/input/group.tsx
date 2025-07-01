const Group = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      data-slot="control"
      className={`isolate grid grid-cols-[calc(var(--spacing)*12)_1fr_calc(var(--spacing)*12)] [&:has(+[data-slot=error])_>_[data-slot=control]]:ring-red-500 [&>[data-slot=control]]:col-span-3 [&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]:has(+[data-slot=icon])]:pr-12 [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]+[data-slot=control]]:pl-12 [&>[data-slot=icon]:last-child]:col-start-3 ${className}]`}
      {...props}
    />
  );
};

export { Group };
