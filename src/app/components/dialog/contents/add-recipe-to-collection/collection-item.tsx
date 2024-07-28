"use client";

import { useDialogContext } from "../../dialog";

type CollectionItemProps = {
  addToCollection: () => Promise<void>;
  name: string;
};

const CollectionItem = ({ addToCollection, name }: CollectionItemProps) => {
  const { closeDialog } = useDialogContext(CollectionItem.name);

  return (
    <button
      className="block w-full rounded-xl bg-neutral-100 p-4"
      onClick={async () => {
        await addToCollection();
        closeDialog();
      }}
    >
      <div className="flex">{name}</div>
    </button>
  );
};

export { CollectionItem };
