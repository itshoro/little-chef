"use client";

type FormProps = {
  action: (formDate: FormData) => Promise<any>;
  children: React.ReactNode;
};

const Form = ({ action, children }: FormProps) => {
  return <form action={action}>{children}</form>;
};

const Submit = ({ children }: { children: React.ReactNode }) => (
  <button
    type="submit"
    className="group inline-block rounded-2xl border bg-gradient-to-t from-stone-100 font-medium text-stone-700 shadow shadow-emerald-950/10 transition-all active:shadow-inner active:shadow-emerald-950/30"
  >
    <div className="inline-flex items-center p-2 pr-4 transition group-active:translate-y-px">
      {children}
    </div>
  </button>
);

export { Form, Submit };
