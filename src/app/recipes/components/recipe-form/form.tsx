"use client";
import { BaseButton } from "@/app/components/base-button";
import * as RootForm from "@/app/components/form";
import type { FormError } from "@/app/components/form/root";

type FormProps = {
  action: (previousState: FormError, formDate: FormData) => Awaited<FormError>;
  children: React.ReactNode;
};

const Form = ({ action, children }: FormProps) => {
  return (
    <RootForm.Root action={action}>
      {children}
      <RootForm.ErrorDisplay />
    </RootForm.Root>
  );
};

const Submit = ({ children }: { children: React.ReactNode }) => (
  <BaseButton type="submit" className="group">
    <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
      {children}
    </div>
  </BaseButton>
);

export { Form, Submit };
