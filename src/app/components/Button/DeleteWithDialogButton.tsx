"use client";

import { useCallback, useRef } from "react";

type DeleteWithDialogButtonProps = {
  onDelete: () => void | Promise<void>;
};

const DeleteWithDialogButton = ({ onDelete }: DeleteWithDialogButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialogRef.current!.showModal();
  }

  function closeDialog() {
    dialogRef.current!.close();
  }

  const onDeleteCallback = useCallback(() => {
    onDelete();
    closeDialog();
  }, [onDelete]);

  return (
    <>
      <dialog
        className="p-6 rounded-2xl shadow-xl mx-auto mb-4 mt-auto absolute max-w-full backdrop:transform backdrop:backdrop-blur-sm"
        ref={dialogRef}
      >
        <h1 className="text-xl">
          Are you sure that you want to delete this recipe?
        </h1>
        <p>This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-8">
          <button
            className="p-2 text-red-700 hover:bg-red-800 hover:text-white rounded-lg transition-colors ease-out font-medium"
            onClick={onDeleteCallback}
          >
            Yes, Delete it.
          </button>
          <button
            className="bg-stone-200  p-2 rounded-lg font-medium"
            onClick={closeDialog}
          >
            No, Take me back.
          </button>
        </div>
      </dialog>
      <button
        className="inline-flex px-3 text-sm items-center gap-1 bg-stone-50 border hover:bg-stone-200 hover:shadow-inner text-stone-600 rounded-full transition ease-out motion-reduce:transition-none font-medium p-1"
        onClick={openDialog}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>
        Delete
      </button>
    </>
  );
};

export { DeleteWithDialogButton };
