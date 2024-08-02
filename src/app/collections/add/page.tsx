import { VisibilitySwitcher } from "@/app/(user)/settings/components/visibility-switcher";
import { BackLink } from "@/app/components/back-link";
import { Header } from "@/app/components/header/header";
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
import * as Form from "@/app/components/form";
import type { FormError } from "@/app/components/form/root";

const Page = async () => {
  const { user } = await validateRequest();

  if (!user) redirect("/login");
  const preferences = await getCollectionPreferences(user.publicId);

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <BackLink />
        </div>
      </Header>
      <div className="p-4">
        <Form.Root action={create}>
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

          <div className="mt-6">
            <Form.ErrorDisplay />
          </div>

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
        </Form.Root>
      </div>
    </>
  );
};

async function create(previousState: FormError, formData: FormData) {
  "use server";

  const publicUserId = formData.get("publicUserId");
  if (typeof publicUserId !== "string") {
    return {
      error: {
        message: "Public user id is missing.",
        target: "publicUserId",
      },
    } satisfies FormError;
  }
  const dto = collectionDtoFromFormData(formData, AddCollectionValidator);

  if (!dto.success) {
    const { fieldErrors } = dto.error.flatten();
    console.log(fieldErrors);
    const firstKey = Object.keys(fieldErrors).pop();
    return {
      error: {
        message: `${firstKey}: ${fieldErrors[firstKey as keyof typeof fieldErrors]![0]}`,
        target: firstKey!,
      },
    } satisfies FormError;
  }
  const collection = await createCollection(dto.data);
  await subscribeToCollection(publicUserId, collection, "creator");

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export default Page;
