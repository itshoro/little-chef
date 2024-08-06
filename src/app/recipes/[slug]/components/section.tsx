type SectionProps = React.ComponentProps<"section"> & { title: string };

const Section = ({ title, children, ...props }: SectionProps) => {
  return (
    <section {...props} className="mt-12">
      <header className="mb-4 flex items-center gap-2">
        <span className="block size-2 rounded-full bg-lime-500" />
        <h2 className="text-sm font-medium">{title}</h2>
      </header>
      {children}
    </section>
  );
};

export { Section };
