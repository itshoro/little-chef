"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateCollectionPreferences } from "@/lib/services/user";
import { changeCollectionDefaultVisibilitySchema } from "@/lib/validators/user";
import { revalidatePath } from "next/cache";

async function changeDefaultVisibility(formData: FormData) {
  const visibility = formData.get("visibility") as string;

  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const parseResult = changeCollectionDefaultVisibilitySchema.safeParse({
      visibility,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    await updateCollectionPreferences(
      { defaultVisibility: parseResult.data.visibility },
      user,
    );
    revalidatePath("/settings/collection", "page");
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return;
  }
}

export { changeDefaultVisibility };
