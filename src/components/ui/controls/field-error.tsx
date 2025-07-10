import { useFieldContext } from "./field-root";

interface FieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

const FieldError = ({ children, className = "" }: FieldErrorProps) => {
  const { errorId } = useFieldContext(FieldError.name);

  return (
    <p
      id={errorId}
      className={`mt-1 flex items-center gap-1 text-sm text-red-400 ${className}`}
      role="alert"
    >
      {/* <AlertCircle className="h-4 w-4 flex-shrink-0" /> */}
      {children}
    </p>
  );
};

export { FieldError };
