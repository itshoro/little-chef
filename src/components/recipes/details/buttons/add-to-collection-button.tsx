import * as WithConfirmation from "@/components/ui/buttons/button-with-confirmation";
import * as Form from "@/components/forms/form";
import { FormState } from "@/components/forms/form/root";
import { assertAuthorizedForServerAction, validateRequest } from "@/lib/auth";
import { unsafeAddRecipe } from "@/lib/dal/collection";
import { getCollectionsForUser } from "@/lib/dal/user";

type AddToCollectionButtonProps = {
  className?: string;
  recipePublicId: string;
  disabled?: boolean;
};

const AddToCollectionButton = async ({
  className,
  disabled,
  recipePublicId,
}: AddToCollectionButtonProps) => {
  // TODO: Remove from collections if already added.
  const { user } = await validateRequest();
  if (!user) return null;

  const collections = user
    ? (await getCollectionsForUser(user, recipePublicId)).filter(
        ({ recipeOccurrences }) => recipeOccurrences === 0,
      )
    : [];

  const boundAddToCollectionsAction = addToCollections.bind(
    null,
    recipePublicId,
  );

  return (
    <>
      <WithConfirmation.Root>
        <WithConfirmation.Modal>
          <div className="m-6 mb-2 flex items-end justify-between">
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
          <Form.Root action={boundAddToCollectionsAction}>
            <div className="relative isolate flex max-h-[50vh] flex-col overflow-auto">
              <div className="pointer-events-none sticky top-0 z-10 h-8 w-full shrink-0 bg-linear-to-b from-white dark:from-black" />
              <ul className="grid w-full flex-1 gap-2 px-6">
                {collections.map(({ collection }) => (
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
              <WithConfirmation.ConfirmButton>
                Add to collection
              </WithConfirmation.ConfirmButton>
            </div>
          </Form.Root>
        </WithConfirmation.Modal>
        <WithConfirmation.TriggerButton
          className={className}
          disabled={disabled}
        >
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
          <span>Add to collection</span>
        </WithConfirmation.TriggerButton>
      </WithConfirmation.Root>
    </>
  );
};

async function addToCollections(
  recipePublicId: string,
  _: FormState,
  formData: FormData,
) {
  "use server";
  const { user } = await assertAuthorizedForServerAction();
  const collection = formData.get("collection");

  await unsafeAddRecipe(collection as string, recipePublicId, user);
  return { success: true, message: "" } satisfies FormState;
}

export { AddToCollectionButton };
