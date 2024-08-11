import * as WithConfirmation from "@/app/components/button/with-confirmation";
import { validateRequest } from "@/lib/auth/lucia";
import { addRecipe } from "@/lib/dal/collections";
import { authorizeFromSession, getMaintainedCollections } from "@/lib/dal/user";

type AddToCollectionButtonProps = {
  recipePublicId: string;
  disabled?: boolean;
};

const AddToCollectionButton = async ({
  disabled,
  recipePublicId,
}: AddToCollectionButtonProps) => {
  // TODO: Remove from collections if already added.
  const { user, session } = await validateRequest();
  if (!user || !session) return null;

  const collections = await getMaintainedCollections(user.publicId);

  const boundAddToCollectionsAction = addToCollections.bind(
    null,
    session.id,
    recipePublicId,
  );

  return (
    <>
      <WithConfirmation.Root>
        <WithConfirmation.Modal>
          <form action={boundAddToCollectionsAction}>
            <div className="flex items-end justify-between">
              <div className="text-sm font-medium dark:text-white">
                Your Collections
              </div>
              <WithConfirmation.CancelButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </WithConfirmation.CancelButton>
            </div>
            <ul className="grid w-full pb-8 pt-4">
              {collections.map((collection) => (
                <li key={collection.publicId}>
                  <input
                    name="collection"
                    value={collection.publicId}
                    id={collection.publicId}
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={collection.publicId}
                    className="block w-full cursor-pointer rounded-2xl bg-stone-100 p-4 peer-checked:bg-lime-300 peer-checked:text-black dark:bg-stone-900 dark:text-white"
                  >
                    <span className="font-medium">{collection.name}</span>
                  </label>
                </li>
              ))}
            </ul>
            <WithConfirmation.ConfirmButton>
              Add to collections
            </WithConfirmation.ConfirmButton>
          </form>
        </WithConfirmation.Modal>
        <WithConfirmation.TriggerButton disabled={disabled}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-8.5A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Add to Collection</span>
        </WithConfirmation.TriggerButton>
      </WithConfirmation.Root>
    </>
  );
};

async function addToCollections(
  sessionId: string,
  recipePublicId: string,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);
  const collections = formData.getAll("collection");

  // TODO check if user is allowed to add to collection
  await Promise.allSettled(
    collections.map((collection) =>
      addRecipe(collection as string, recipePublicId),
    ),
  );
}

export { AddToCollectionButton };
