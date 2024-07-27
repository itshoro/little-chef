import { forwardRef, useCallback, useRef } from "react";

type RootProps = {
  onConfirm: () => void;
  closeDialog: () => void;
};

const Root = forwardRef<React.ElementRef<"dialog">, RootProps>(
  ({ closeDialog, onConfirm }, ref) => {
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
            onClick={onConfirm}
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

function useDeleteDialog(onConfirmCallback: () => void) {
  const ref = useRef<React.ElementRef<"dialog">>(null);

  function openDialog() {
    ref.current?.showModal();
  }

  function closeDialog() {
    ref.current?.close();
  }

  const onConfirm = useCallback(() => {
    onConfirmCallback();
    closeDialog();
  }, [onConfirmCallback]);

  type RootPropsWithRef = RootProps & {
    ref: React.RefObject<React.ElementRef<"dialog">>;
  };

  return [
    openDialog,
    { ref, closeDialog, onConfirm } satisfies RootPropsWithRef,
  ] as const;
}

export { Root, useDeleteDialog, type RootProps };
