import { BackLink } from "@/app/components/back-link";
import type { FormContext } from "@/app/components/form/root";
import { Header } from "@/app/components/header/header";
import { validateRequest } from "@/lib/auth/lucia";
import {
  collectionDtoFromFormData,
  createCollection,
  getCollectionPreferences,
} from "@/lib/dal/collections";
import { authorizeFromSession, subscribeToCollection } from "@/lib/dal/user";
import { AddCollectionValidator } from "@/lib/dal/validators";
import { generateSlugPathSegment } from "@/lib/slug";
import type { User } from "lucia";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import * as Form from "../components/collection-form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";

export const metadata: Metadata = {
  title: "Add Collection",
};

const Page = async () => {
  const { user, session } = await validateRequest();

  if (!user) redirect("/login");
  const preferences = await getCollectionPreferences(user.publicId);

  return (
    <>
      <Form.Root action={create}>
        <div className="grid gap-4">
          <input type="hidden" name="sessionId" value={session?.id} />
          <Form.Inputs
            defaultValue={{ visibility: preferences.defaultVisibility }}
          />
          <div className="flex justify-end py-4">
            <SubmitWithPending className="pointer-events-auto cursor-pointer rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black">
              <div className="inline-flex items-center gap-1 transition-transform group-active:translate-y-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="var(--color-lime-800)"
                  className="size-4"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
                <span>Add Collection</span>
              </div>
            </SubmitWithPending>
          </div>
        </div>
      </Form.Root>
    </>
  );
};

async function create(_: FormContext, formData: FormData) {
  "use server";

  let user: User;
  try {
    const sessionId = formData.get("sessionId");
    user = await authorizeFromSession(sessionId);
  } catch {
    return {
      success: false,
      error: "You're currently not signed in, collection creation is disabled.",
    } satisfies FormContext;
  }

  const dto = collectionDtoFromFormData(formData, AddCollectionValidator);

  if (!dto.success) {
    return {
      success: false,
      error: Object.entries(
        dto.error.flatten((issue) => issue.message).fieldErrors,
      ).flatMap((kvp) => [`${kvp[0]}: ${kvp[1]}`]),
    } satisfies FormContext;
  }
  const collection = await createCollection(dto.data);
  await subscribeToCollection(user.publicId, collection, "creator");

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export default Page;
