import { forwardRef, useCallback, useRef } from "react";

type RootProps = {
  children: React.ReactNode;
};

const DialogRoot = forwardRef<React.ElementRef<"dialog">, RootProps>(
  ({ children }, ref) => {
    return (
      <dialog
        className="absolute mx-auto mb-4 mt-auto max-w-full rounded-2xl p-6 shadow-xl backdrop:transform backdrop:backdrop-blur-sm"
        ref={ref}
      >
        {children}
      </dialog>
    );
  },
);

type DialogProps = {
  onConfirm: () => void;
  closeDialog: () => void;
  openDialog: () => void;
};

function useDialog(onConfirmCallback: () => void) {
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

  return [
    ref,
    { openDialog, closeDialog, onConfirm } satisfies DialogProps,
  ] as const;
}

export { DialogRoot, useDialog, type RootProps, type DialogProps };
