const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid items-start gap-4 sm:grid-cols-2">{children}</div>
);

export { Grid };
