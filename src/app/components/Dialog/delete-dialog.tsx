import React, { forwardRef, useCallback, useRef } from "react";

type DeleteDialogProps = {
  onDelete: () => void;
  closeDialog: () => void;
};

const DeleteDialog = forwardRef<React.ElementRef<"dialog">, DeleteDialogProps>(
  ({ closeDialog, onDelete }, ref) => {
    return (
      <dialog
        className="absolute mx-auto mb-4 mt-auto max-w-full rounded-2xl p-6 shadow-xl backdrop:transform backdrop:backdrop-blur-sm"
        ref={ref}
      >
        <h1 className="text-xl">
          Are you sure that you want to delete this recipe?
        </h1>
        <p>This action cannot be undone.</p>
        <div className="mt-8 flex justify-end gap-2">
          <button
            className="rounded-lg p-2 font-medium text-red-700 transition-colors ease-out hover:bg-red-800 hover:text-white"
            onClick={onDelete}
          >
            Yes, Delete it.
          </button>
          <button
            className="rounded-lg  bg-stone-200 p-2 font-medium"
            onClick={closeDialog}
          >
            No, Take me back.
          </button>
        </div>
      </dialog>
    );
  },
);

function useDeleteDialog(onDeleteCallback: () => void) {
  const ref = useRef<React.ElementRef<"dialog">>(null);

  function openDialog() {
    ref.current?.showModal();
  }

  function closeDialog() {
    ref.current?.close();
  }

  const onDelete = useCallback(() => {
    onDeleteCallback();
    closeDialog();
  }, [onDeleteCallback]);

  type DialogProps = DeleteDialogProps & {
    ref: React.RefObject<React.ElementRef<"dialog">>;
  };

  return [
    openDialog,
    { ref, closeDialog, onDelete } satisfies DialogProps,
  ] as const;
}

export { DeleteDialog, useDeleteDialog, type DeleteDialogProps };
