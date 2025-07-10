"use server";

import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateRecipePreferences } from "@/lib/services/user";
import { changeRecipeDefaultServingSizeSchema } from "@/lib/validators/user";
import { revalidatePath } from "next/cache";

async function changeDefaultServingSizeAction(formData: FormData) {
  const servingSize = Number(formData.get("servingSize") as string);

  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const parseResult = changeRecipeDefaultServingSizeSchema.safeParse({
      servingSize,
    });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await updateRecipePreferences(
      { defaultServingSize: parseResult.data.servingSize },
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
      controls: { servingSize },
    };
  }
}

export { changeDefaultServingSizeAction };
