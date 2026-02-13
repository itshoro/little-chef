interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const baseClasses = `
  relative inline-flex items-center justify-center gap-2
  font-medium rounded-full
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900
  disabled:opacity-50 disabled:cursor-not-allowed isolate
`;

const variants = {
  primary: `
    bg-lime-300 hover:bg-lime-700 
    text-black 
    focus:ring-lime-300
  `,
  secondary: `
    bg-stone-800 hover:bg-stone-900 text-white focus:ring-stone-800
    dark:bg-stone-200 dark:hover:bg-stone-400 dark:text-black dark:focus:ring-stone-200
  `,
  outline: `
    bg-transparent border 
    border-black/20 hover:bg-black/5 text-black focus:ring-black/30
    dark:border-white/20 dark:hover:bg-white/5 dark:text-white dark:focus:ring-white/30
  `,
  ghost: `
    bg-transparent 
    hover:bg-black/5 text-black focus:ring-black/30
    dark:hover:bg-white/5 dark:text-white dark:focus:ring-white/30
  `,
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <div className="absolute -z-10 hidden size-[max(48px,100%)] pointer-coarse:block" />
      {children}
    </button>
  );
};

export { Button, type ButtonProps };
