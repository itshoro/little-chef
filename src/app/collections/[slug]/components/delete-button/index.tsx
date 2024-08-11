import { BaseButton } from "@/app/components/base-button";
import { validateRequest } from "@/lib/auth/lucia";
import { deleteCollection } from "@/lib/dal/collections";
import { redirect } from "next/navigation";
import { DialogButton } from "./dialog-button";

type DeleteButtonProps = {
  collectionId: number;
};

const DeleteButton = async ({ collectionId }: DeleteButtonProps) => {
  const { session } = await validateRequest();
  if (!session) return null;

  const boundDeleteAction = deleteAction.bind(null, collectionId, session.id);

  return <DialogButton deleteCollectionAction={boundDeleteAction} />;
};

async function deleteAction(collectionId: number, sessionId: string) {
  "use server";
  const { user } = await validateRequest(sessionId);
  if (!user) throw new Error("Unauthorized");

  await deleteCollection(collectionId, user);
  redirect("/collections");
}

export { DeleteButton };
