type CardProps = {
  children: React.ReactNode;
};

const Root = ({ children }: CardProps) => {
  return (
    <article className="relative rounded-xl bg-stone-100 shadow-sm dark:bg-stone-900">
      {children}
    </article>
  );
};

export { Root };
