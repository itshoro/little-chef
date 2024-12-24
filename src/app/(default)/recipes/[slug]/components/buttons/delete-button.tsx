import * as WithConfirmation from "@/app/components/button/with-confirmation";
import { validateRequest } from "@/lib/auth/lucia";
import { deleteRecipe } from "@/lib/dal/recipe";
import { findUserBySessionId } from "@/lib/dal/user";
import { redirect } from "next/navigation";

type DeleteButtonProps = {
  recipeId: number;
};

const DeleteButton = async ({ recipeId }: DeleteButtonProps) => {
  const { session } = await validateRequest();
  if (!session) return null;

  const boundDeleteAction = deleteAction.bind(null, recipeId, session.id);

  return (
    <WithConfirmation.Root>
      <WithConfirmation.Modal>
        <form action={boundDeleteAction} className="p-6">
          <div className="text-black dark:text-white">
            <h1 className="text-xl font-bold">
              Are you sure you want to delete this recipe?
            </h1>
            <p className="mt-2">
              This <em>cannot</em> be undone.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <WithConfirmation.CancelButton>
              Cancel
            </WithConfirmation.CancelButton>
            <WithConfirmation.ConfirmButton>
              Delete Recipe
            </WithConfirmation.ConfirmButton>
          </div>
        </form>
      </WithConfirmation.Modal>
      <WithConfirmation.TriggerButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>
        <span>Delete</span>
      </WithConfirmation.TriggerButton>
    </WithConfirmation.Root>
  );
};

async function deleteAction(recipeId: number, sessionId: string) {
  "use server";
  const user = await findUserBySessionId(sessionId);
  if (!user) throw new Error("Unauthorized");

  // TODO: check if user is allowed to delete recipe
  await deleteRecipe(recipeId);
  redirect("/recipes");
}

export { DeleteButton };
