import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import * as Input from "@/app/components/input";
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
    <form action={create}>
      <input type="hidden" name="publicUserId" value={user?.publicId} />

      <Input.Root name="title">
        <Input.Label>Title</Input.Label>
        <Input.Group>
          <Input.Element type="text" autoComplete="off" />
        </Input.Group>
      </Input.Root>

      {/* <SlugInput inputName="title" /> */}
      {/* 
      <Input.Root name="description">
        <Input.Label>Description</Input.Label>
        <Input.Group>
          <Input.Textarea />
        </Input.Group>
      </Input.Root> */}

      <Input.Root name="visibility">
        <Input.Label>Visibility</Input.Label>
        <Input.Group>
          <VisibilitySwitcher
            name="visibility"
            defaultValue={preferences?.defaultVisibility}
          />
        </Input.Group>
      </Input.Root>

      {/* <UserRoleInput /> */}

      <button type="submit">Create</button>
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
