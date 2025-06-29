import type { FormState } from "@/app/components/form/root";
import { unsafeUpdateCollection } from "@/lib/dal/collection";
import { findUserBySessionId } from "@/lib/dal/user";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createCollectionSchema } from "../../add/action";
import type { DrizzleCollection } from "@/drizzle/schema";

const editCollectionSchema = createCollectionSchema.merge(
  z.object({
    publicId: z.string(),
  }),
);

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
  const sessionId = formData.get("sessionId") as string;
  const publicId = formData.get("publicId") as string;
  const title = formData.get("title") as string;
  const visibility = formData.get("visibility") as string;

  let collection: DrizzleCollection;
  try {
    const user = await findUserBySessionId(sessionId);

    const parseResult = editCollectionSchema.safeParse({
      title,
      visibility,
      publicId,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    collection = await unsafeUpdateCollection(parseResult.data, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message:
        e.message ||
        "Please review the form and correct the errors to proceed with editing the collection details.",
      errors: e.cause as Record<string, any>,
      controls: {
        title,
        visibility,
      },
    } satisfies FormState<EditCollectionControls>;
  }

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export { editAction };
