"use client";
import { BaseButton } from "@/app/components/base-button";
import * as RootForm from "@/app/components/form";

type FormProps = React.ComponentProps<typeof RootForm.Root>;

const Form = ({ action, children }: FormProps) => {
  return (
    <RootForm.Root action={action}>
      {children}
      <div className="my-4">
        <RootForm.Alert />
      </div>
    </RootForm.Root>
  );
};

const Submit = ({ children }: { children: React.ReactNode }) => (
  <BaseButton type="submit" className="group ml-auto">
    <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
      {children}
    </div>
  </BaseButton>
);

export { Form, Submit };
