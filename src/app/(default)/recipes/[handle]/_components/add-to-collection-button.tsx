import * as WithConfirmation from "@/components/ui/buttons/button-with-confirmation";
import type { Recipe } from "@/lib/domain/recipe/recipe";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { addRecipeToCollection } from "@/lib/utils/collection/add-recipe-to-collection";
import { findCollections } from "@/lib/utils/collection/find-collections";

type AddToCollectionButtonProps = {
  className?: string;
  recipe: Recipe;
  disabled?: boolean;
};

const AddToCollectionButton = async ({
  className,
  disabled,
  recipe,
}: AddToCollectionButtonProps) => {
  // TODO: Remove from collections if already added.
  const { user } = await validateSession();
  if (!user) return null;

  const collections = user ? await findCollections({}, user) : [];

  const boundAddToCollectionsAction = addToCollections.bind(null, recipe);

  return (
    <>
      <WithConfirmation.Root>
        <WithConfirmation.Modal>
          <div className="m-6 mb-2 flex items-end justify-between">
            <div className="text-sm font-medium dark:text-white">
              Your Collections
            </div>
            <WithConfirmation.CancelButton variant="ghost">
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
          <form action={boundAddToCollectionsAction}>
            <div className="relative isolate flex max-h-[50vh] flex-col overflow-auto">
              <div className="pointer-events-none sticky top-0 z-10 h-8 w-full shrink-0 bg-linear-to-b from-white dark:from-black" />
              <ul className="grid w-full flex-1 gap-2 px-6">
                {collections.map((collection) => (
                  <li key={collection.publicId}>
                    <input
                      name="collection"
                      value={collection.publicId}
                      id={collection.publicId}
                      type="radio"
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={collection.publicId}
                      className="block w-full cursor-pointer rounded-2xl bg-stone-100 p-4 peer-checked:bg-lime-300 peer-checked:text-black dark:bg-stone-900 dark:text-white"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{collection.name}</span>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none sticky -bottom-1 z-10 h-8 w-full shrink-0 bg-linear-to-t from-white dark:from-black" />
            </div>
            <div className="p-6">
              <WithConfirmation.ConfirmButton variant="outline">
                Add to collection
              </WithConfirmation.ConfirmButton>
            </div>
          </form>
        </WithConfirmation.Modal>
        <WithConfirmation.TriggerButton
          className={className}
          disabled={disabled}
          variant="outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 text-stone-600"
          >
            <path d="M3.75 2a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.28.53L8 10.06l3.72 3.72a.75.75 0 0 0 1.28-.53V2.75a.75.75 0 0 0-.75-.75h-8.5Z" />
          </svg>
          <span className="text-white">Add to Collection</span>
        </WithConfirmation.TriggerButton>
      </WithConfirmation.Root>
    </>
  );
};

async function addToCollections(recipe: Recipe, formData: FormData) {
  "use server";
  const { user } = await validateSession();
  if (!user) throw new UnauthenticatedError();
  const collection = formData.get("collection") as string;

  await addRecipeToCollection({ publicId: collection }, recipe, user);
}

export { AddToCollectionButton };
