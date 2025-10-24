"use client";

import { Inputs } from "@/components/recipes/recipe-form/inputs";
import { PendingButton } from "@/components/ui/buttons/pending-button";
import type { RecipeDetail } from "@/lib/domain/recipe/recipe";
import { useTransition } from "react";

type RecipeFormProps = {
  action: (data: FormData) => Promise<void>;
  defaultValue?: Partial<RecipeDetail>;
  buttonLabel: string;
};

const RecipeForm = ({ action, buttonLabel, defaultValue }: RecipeFormProps) => {
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
      <Inputs defaultValue={defaultValue} />
      <div className="flex justify-end gap-6 py-4">
        <PendingButton pending={pending}>
          <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="var(--color-lime-800)"
              className="size-4"
            >
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            <span>{buttonLabel}</span>
          </div>
        </PendingButton>
      </div>
    </form>
  );
};

export { RecipeForm };
