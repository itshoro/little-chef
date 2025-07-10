type CardProps = {
  children: React.ReactNode;
};

const Root = ({ children }: CardProps) => {
  return (
    <article className="relative rounded-xl bg-stone-100 shadow-xs ring-1 dark:bg-stone-800 dark:ring-white/10">
      {children}
    </article>
  );
};

export { Root };
