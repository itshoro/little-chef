type SectionProps = React.ComponentProps<"section"> & { title: string };

const Section = ({ title, children, ...props }: SectionProps) => {
  return (
    <section {...props} className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <span className="block size-2 rounded-full bg-green-600" />
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export { Section };
