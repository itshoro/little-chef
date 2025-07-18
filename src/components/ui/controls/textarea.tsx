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
      className={`resize-vertical min-h-[80px] w-full rounded-md border border-white/5 bg-stone-800 px-3 py-2 text-white placeholder-white/50 transition-colors duration-200 autofill:bg-stone-800 autofill:[-webkit-box-shadow:0_0_0_1000px_theme(colors.stone.800)_inset] autofill:[-webkit-text-fill-color:theme(colors.white)] autofill:hover:bg-stone-800 focus:border-lime-300/50 focus:bg-lime-900/30 focus:ring-2 focus:ring-lime-300 focus:outline-none autofill:focus:bg-stone-800 autofill:focus:[-webkit-box-shadow:0_0_0_1000px_theme(colors.stone.800)_inset] disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-red-500/50 data-[invalid]:focus:border-red-400/50 data-[invalid]:focus:bg-red-900/20 data-[invalid]:focus:ring-red-300 ${className} `}
      {...props}
    />
  );
};

export { Textarea };
