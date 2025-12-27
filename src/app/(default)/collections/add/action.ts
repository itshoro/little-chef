"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { requireSession } from "@/lib/utils/auth/require-session";

import { generateHandle } from "@/lib/slug";
import { dtoFromFormData } from "@/lib/transformer/collection/create-transformer";
import { createCollection } from "@/lib/utils/collection/create-collection";
import { redirect } from "next/navigation";

async function createAction(formData: FormData) {
  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const dto = dtoFromFormData(formData);
  const result = await createCollection(dto, user);
  if (!result.ok) throw result.error;

  redirect(
    `/collections/${generateHandle(result.value.slug, result.value.publicId)}`,
  );
}

export { createAction };
