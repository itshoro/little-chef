import { Button, type ButtonProps } from "./button";

interface PendingButtonProps extends ButtonProps {
  pending: boolean;
}

const Spinner = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={`z-10 size-4 animate-spin ${className}`} viewBox="0 0 20 20">
      <circle
        cy="50%"
        cx="50%"
        r={8}
        strokeWidth={2}
        strokeDasharray={64}
        strokeDashoffset={24}
        fill="transparent"
        stroke="currentColor"
      />
    </svg>
  );
};

const PendingButton = ({
  children,
  pending,
  className = "",
  ...props
}: PendingButtonProps) => {
  return (
    <Button
      {...props}
      data-pending={pending}
      className={`data-[pending=true]:cursor-progress ${className}`}
    >
      {pending && <Spinner />}
      {children}
    </Button>
  );
};

export { PendingButton, Spinner };
