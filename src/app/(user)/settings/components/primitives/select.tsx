"use client";

const Select = (props: React.ComponentPropsWithoutRef<"select">) => {
  function triggerSubmit(e: React.ChangeEvent) {
    (e.target as HTMLSelectElement).form?.requestSubmit();
  }

  return (
    <select {...props} className="w-full rounded-lg" onChange={triggerSubmit} />
  );
};

export { Select };
