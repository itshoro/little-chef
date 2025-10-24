"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { generateHandle } from "@/lib/slug";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateCollection } from "@/lib/utils/collection/update-collection";
import { dtoFromFormData } from "@/lib/transformer/collection/update-transformer";
import { redirect } from "next/navigation";

async function editAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);

  const result = await updateCollection(dto, user);
  if (!result.ok) throw result.error;

  const collection = result.value;

  redirect(
    `/collections/${generateHandle(collection.slug, collection.publicId)}`,
  );
}

export { editAction };
