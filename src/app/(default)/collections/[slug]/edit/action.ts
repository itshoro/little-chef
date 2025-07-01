import type { FormState } from "@/components/forms/form/root";
import type { DrizzleCollection } from "@/drizzle/schema";
import { assertAuthenticatedForServerAction } from "@/lib/services/auth";
import { updateCollection } from "@/lib/services/collection";
import { generateHandle } from "@/lib/slug";
import { editCollectionSchema } from "@/lib/validators/collection";
import { redirect } from "next/navigation";

type EditCollectionControls = {
  title: string;
  visibility: string;
  publicId?: string;
  sessionId?: string;
};

async function editAction(
  _: FormState<EditCollectionControls>,
  formData: FormData,
): Promise<FormState<EditCollectionControls>> {
  "use server";
  const publicId = formData.get("publicId") as string;
  const name = formData.get("name") as string;
  const visibility = formData.get("visibility") as string;

  let collection: DrizzleCollection;
  try {
    const { user } = await assertAuthenticatedForServerAction();

    const parseResult = editCollectionSchema.safeParse({
      name,
      visibility,
      publicId,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    collection = await updateCollection(parseResult.data, user);
  } catch (e) {
    console.error(e);
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message:
        e.message ||
        "Please review the form and correct the errors to proceed with editing the collection details.",
      errors: e.cause as Record<string, any>,
      controls: {
        name,
        visibility,
      },
    } satisfies FormState<EditCollectionControls>;
  }

  redirect(
    `/collections/${generateHandle(collection.slug, collection.publicId)}`,
  );
}

export { editAction };
