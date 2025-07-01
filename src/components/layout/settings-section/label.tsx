const Label = ({ children }: { children: React.ReactNode }) => (
  <h1 className="mb-4 flex items-center">
    <span className="mr-2.5 inline-block size-2 rounded-full bg-lime-500" />{" "}
    <span className="text-sm font-medium">{children}</span>
  </h1>
);

export { Label };
