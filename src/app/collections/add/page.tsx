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
import { subscribeToCollection, authorizeFromSession } from "@/lib/dal/user";
import { AddCollectionValidator } from "@/lib/dal/validators";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import * as Form from "../components/collection-form";
import type { FormError } from "@/app/components/form/root";
import type { Metadata } from "next";
import type { User } from "lucia";

export const metadata: Metadata = {
  title: "Add Collection",
};

const Page = async () => {
  const { user, session } = await validateRequest();

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
          <div className="grid gap-4">
            <input type="hidden" name="sessionId" value={session?.id} />
            <Form.Inputs
              defaultValue={{ visibility: preferences.defaultVisibility }}
            />
            <Form.Submit>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Create Collection
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

async function create(_: FormError, formData: FormData) {
  "use server";

  let user: User;
  try {
    const sessionId = formData.get("sessionId");
    user = await authorizeFromSession(sessionId);
  } catch {
    return {
      error: {
        message:
          "You're currently not signed in, collection creation is disabled.",
        target: "sessionId",
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
  await subscribeToCollection(user.publicId, collection, "creator");

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export default Page;
