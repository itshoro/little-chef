import { useFieldContext } from "./field-root";

interface TextareaProps extends React.ComponentProps<"textarea"> {}

const Textarea = ({ className = "", ...props }: TextareaProps) => {
  const { name, id, describedBy, errorId } = useFieldContext(Textarea.name);

  return (
    <textarea
      id={id}
      name={name}
      aria-describedby={describedBy}
      aria-errormessage={errorId}
      className={`resize-vertical min-h-20 w-full rounded-md border border-stone-300 px-3 py-2 transition-colors duration-200 autofill:[-webkit-box-shadow:0_0_0_1000px_var(--color-stone-800)_inset] autofill:[-webkit-text-fill-color:var(--color-white)] focus:border-lime-300/50 focus:ring-2 focus:ring-lime-300 focus:outline-none autofill:focus:bg-stone-800 autofill:focus:[-webkit-box-shadow:0_0_0_1000px_var(--color-stone-800)_inset] disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-red-500/50 data-invalid:focus:border-red-400/50 data-invalid:focus:bg-red-900/20 data-invalid:focus:ring-red-300 dark:border-white/5 dark:bg-stone-800 dark:text-white dark:placeholder-white/50 dark:autofill:bg-stone-800 dark:autofill:hover:bg-stone-800 dark:focus:bg-lime-900/30 ${className} `}
      {...props}
    />
  );
};

export { Textarea };
