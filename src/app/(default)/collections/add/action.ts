import type { FormState } from "@/app/components/form/root";
import type { Collection } from "@/drizzle/schema";
import { createCollection } from "@/lib/dal/collections";
import { findUserBySessionId, subscribeToCollection } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { generateSlugPathSegment } from "@/lib/slug";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().trim().min(2),
  visibility: visibilitySchema,
});

type CreateCollectionControls = {
  title: string;
  visibility: string;
};

async function createAction(
  _: FormState<CreateCollectionControls>,
  formData: FormData,
): Promise<FormState<CreateCollectionControls>> {
  "use server";
  const sessionId = formData.get("sessionId") as string;
  const title = formData.get("title") as string;
  const visibility = formData.get("visibility") as string;

  let collection: Collection;
  try {
    const user = await findUserBySessionId(sessionId);

    const parseResult = createCollectionSchema.safeParse({ title, visibility });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    collection = await createCollection(parseResult.data);
    await subscribeToCollection(user.publicId, collection, "creator");
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message: e.message,
      errors: e.cause as Record<string, any>,
      controls: {
        title,
        visibility,
      },
    } satisfies FormState<CreateCollectionControls>;
  }

  redirect(
    `/collections/${generateSlugPathSegment(collection.slug, collection.publicId)}`,
  );
}

export { createAction };
