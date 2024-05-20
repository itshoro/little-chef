type CardProps = {
  children: React.ReactNode;
};

const Root = ({ children }: CardProps) => {
  return (
    <article className="relative rounded-xl bg-stone-100 shadow-sm">
      {children}
    </article>
  );
};

export { Root };
