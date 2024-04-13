"use client";

const Select = (props: React.ComponentPropsWithoutRef<"select">) => {
  function triggerSubmit(e: React.ChangeEvent) {
    (e.target as HTMLSelectElement).form?.requestSubmit();
  }

  return <select {...props} onChange={triggerSubmit} />;
};

export { Select };
