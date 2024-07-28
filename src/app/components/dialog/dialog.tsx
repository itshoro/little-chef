"use client";

import { createContext, forwardRef, useRef } from "react";
import { useContext } from "@/hooks/useContext";

type DialogContextProps = {
  closeDialog: () => void;
  openDialog: () => void;
};

const DialogContext = createContext<DialogContextProps>(null!);

const useDialogContext = (calleeName: string) =>
  useContext(calleeName, DialogContext);

type RootProps = {
  children: React.ReactNode;
} & DialogContextProps;

const DialogRoot = forwardRef<React.ElementRef<"dialog">, RootProps>(
  ({ children, ...contextActions }, ref) => {
    return (
      <DialogContext.Provider value={contextActions}>
        <dialog
          className="absolute mx-auto mb-4 mt-auto max-w-full rounded-2xl p-6 shadow-xl backdrop:transform backdrop:backdrop-blur-sm"
          ref={ref}
        >
          {children}
        </dialog>
      </DialogContext.Provider>
    );
  },
);

function useDialog() {
  const ref = useRef<React.ElementRef<"dialog">>(null);

  function openDialog() {
    ref.current?.showModal();
  }

  function closeDialog() {
    ref.current?.close();
  }

  return [
    ref,
    { openDialog, closeDialog } satisfies DialogContextProps,
  ] as const;
}

export { DialogRoot, useDialog, useDialogContext, type RootProps };
