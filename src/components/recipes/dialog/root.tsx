"use client";

import { useContext } from "@/hooks/use-context";
import { createContext, forwardRef, useRef } from "react";

type DialogContextProps = {
  ref: React.RefObject<React.ComponentRef<"dialog"> | null>;
  closeDialog: () => void;
  openDialog: () => void;
};

const DialogContext = createContext<DialogContextProps>(null!);

const useDialogContext = (calleeName: string) =>
  useContext(calleeName, DialogContext);

type RootProps = {
  children: React.ReactNode;
} & Omit<DialogContextProps, "ref">;

const Root = forwardRef<React.ElementRef<"dialog">, RootProps>(
  ({ children, ...contextActions }, ref) => {
    return (
      <DialogContext.Provider
        value={{
          ...contextActions,
          ref: ref as React.RefObject<React.ElementRef<"dialog">>,
        }}
      >
        {children}
      </DialogContext.Provider>
    );
  },
);

function useDialog() {
  const ref = useRef<React.ComponentRef<"dialog">>(null);

  function openDialog() {
    ref.current?.showModal();
  }

  function closeDialog() {
    ref.current?.close();
  }

  return {
    ref,
    openDialog,
    closeDialog,
  } satisfies DialogContextProps;
}

export { Root, useDialog, useDialogContext, type RootProps };
