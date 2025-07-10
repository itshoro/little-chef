"use server";

import { assertAuthenticatedForServerAction } from "@/lib/services/auth";
import { createCollection } from "@/lib/services/collection";
import type { CollectionOutputPublicDTO } from "@/lib/services/collection/types";
import { generateHandle } from "@/lib/slug";
import { createCollectionSchema } from "@/lib/validators/collection";
import { redirect } from "next/navigation";

async function createAction(formData: FormData) {
  const name = formData.get("name") as string;
  const visibility = formData.get("visibility") as string;

  let collection: CollectionOutputPublicDTO;
  try {
    const { user } = await assertAuthenticatedForServerAction();

    const parseResult = createCollectionSchema.safeParse({ name, visibility });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    collection = await createCollection(parseResult.data, user);
  } catch (e) {
    if (!(e instanceof Error)) throw e;
    console.error(e);

    return;
  }

  redirect(
    `/collections/${generateHandle(collection.slug, collection.publicId)}`,
  );
}

export { createAction };
