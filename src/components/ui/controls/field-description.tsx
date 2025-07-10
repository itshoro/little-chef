import { useFieldContext } from "./field-root";

interface FieldDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const FieldDescription = ({
  children,
  className = "",
}: FieldDescriptionProps) => {
  const { describedBy } = useFieldContext(FieldDescription.name);

  return (
    <p id={describedBy} className={`mt-1 text-sm text-white/70 ${className}`}>
      {children}
    </p>
  );
};

export { FieldDescription };
