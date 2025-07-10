"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateRecipePreferences } from "@/lib/services/user";
import { changeRecipeDefaultVisibilitySchema } from "@/lib/validators/user";
import { revalidatePath } from "next/cache";

async function changeDefaultVisibility(data: FormData) {
  const visibility = data.get("visibility") as string;

  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const parseResult = changeRecipeDefaultVisibilitySchema.safeParse({
      visibility,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    await updateRecipePreferences(
      { defaultVisibility: parseResult.data.visibility },
      user,
    );

    revalidatePath("/settings/recipe", "page");
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message: e.message,
      errors: e.cause as Record<string, unknown>,
      controls: data,
    };
  }
}

export { changeDefaultVisibility };
