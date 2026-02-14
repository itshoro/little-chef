"use client";

import { useDialogContext } from "./root";

type ModalProps = {
  children: React.ReactNode;
};

const Modal = ({ children }: ModalProps) => {
  const { ref } = useDialogContext(Modal.name);

  return (
    <dialog
      className="fixed m-auto mb-0 w-full max-w-full rounded-2xl shadow-xl backdrop:transform backdrop:backdrop-blur-sm lg:mb-auto lg:max-w-prose dark:border-t dark:border-stone-800 dark:bg-black lg:dark:border"
      ref={ref}
    >
      {children}
    </dialog>
  );
};

export { Modal };
