"use client";
import { DialogRoot, useDialog } from "@/app/components/dialog/dialog";
import { BaseButton } from "../../../../components/base-button";

type AddToCollectionButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

const AddToCollectionButton = ({
  children,
  disabled,
}: AddToCollectionButtonProps) => {
  const [ref, dialogActions] = useDialog();

  return (
    <>
      <DialogRoot ref={ref} {...dialogActions}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium dark:text-white">
            Your Collections
          </div>
          <button
            onClick={dialogActions.closeDialog}
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:bg-stone-800 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        {children}
      </DialogRoot>
      <BaseButton
        onClick={dialogActions.openDialog}
        type="button"
        disabled={disabled}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-8.5A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Add to Collection</span>
      </BaseButton>
    </>
  );
};

export { AddToCollectionButton };
