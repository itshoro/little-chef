"use client";

import { Inputs } from "@/app/(default)/collections/_components/collection-form-inputs";
import { PendingButton } from "@/components/ui/buttons/pending-button";
import type { Collection } from "@/lib/domain/collection/collection";
import { useTransition } from "react";

type CollectionFormProps = {
  defaultValue: Partial<Collection>;
  action: (data: FormData) => Promise<void>;
  buttonLabel?: string;
};

const CollectionForm = ({
  action,
  buttonLabel,
  defaultValue,
}: CollectionFormProps) => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      await action(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4">
        <Inputs defaultValue={defaultValue} />
        <PendingButton pending={pending}>{buttonLabel}</PendingButton>
      </div>
    </form>
  );
};

export { CollectionForm };
