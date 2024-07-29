import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import * as Input from "@/app/components/input";
import { Submit } from "@/app/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import {
  collectionDtoFromFormData,
  createCollection,
  getCollectionPreferences,
} from "@/lib/dal/collections";
import { subscribeToCollection } from "@/lib/dal/user";
import { AddCollectionValidator } from "@/lib/dal/validators";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";

const Page = async () => {
  const { user } = await validateRequest();
  const preferences = user
    ? await getCollectionPreferences(user.publicId)
    : undefined;

  return (
    <form className="p-4" action={create}>
      <input type="hidden" name="publicUserId" value={user?.publicId} />

      <Input.Root name="title">
        <Input.Label>Title</Input.Label>
        <Input.Group>
          <Input.Element type="text" autoComplete="off" />
        </Input.Group>
      </Input.Root>

      <Input.Root name="visibility">
        <Input.Label>Visibility</Input.Label>
        <Input.Group>
          <VisibilitySwitcher
            name="visibility"
            defaultValue={preferences?.defaultVisibility}
          />
        </Input.Group>
      </Input.Root>

      <div className="mt-4 flex justify-end">
        <Submit>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
          Create
        </Submit>
      </div>
    </form>
  );
};

async function create(formData: FormData) {
  "use server";

  const publicUserId = formData.get("publicUserId");
  if (typeof publicUserId !== "string")
    throw new Error("Public user id is missing.");
  const dto = collectionDtoFromFormData(formData, AddCollectionValidator);

  if (!dto.success) {
    throw new Error("Collection DTO couldn't be created.", {
      cause: dto.error.flatten(),
    });
  }
  const collection = await createCollection(dto.data);
  await subscribeToCollection(publicUserId, collection, "creator");

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export default Page;
