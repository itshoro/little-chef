"use client";

import { useDialogContext } from "../../dialog";

type CollectionItemProps = {
  addToCollectionAction: (collectionPublicId: string) => Promise<void>;
  name: string;
  publicId: string;
};

const CollectionItem = ({
  addToCollectionAction,
  name,
  publicId,
}: CollectionItemProps) => {
  const { closeDialog } = useDialogContext(CollectionItem.name);

  return (
    <button
      className="block w-full rounded-xl bg-neutral-100 p-4"
      onClick={async () => {
        await addToCollectionAction(publicId);
        closeDialog();
      }}
    >
      <div className="flex">{name}</div>
    </button>
  );
};

export { CollectionItem };
