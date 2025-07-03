import type { FormState } from "@/components/forms/form/root";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateRecipePreferences } from "@/lib/services/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ChangeDefaultServingSizeControls = {
  defaultServingSize: number;
};

const changeDefaultServingSizeSchema = z.object({
  defaultServingSize: z.number().nonnegative(),
});

async function changeDefaultServingSizeAction(
  _: FormState<ChangeDefaultServingSizeControls>,
  formData: FormData,
): Promise<FormState<ChangeDefaultServingSizeControls>> {
  "use server";
  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  const defaultServingSize = Number(formData.get("defaultServingSize"));

  try {
    const parseResult = changeDefaultServingSizeSchema.safeParse({
      defaultServingSize,
    });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await updateRecipePreferences(
      { defaultServingSize: parseResult.data.defaultServingSize },
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
      controls: { defaultServingSize: defaultServingSize },
    };
  }
}

export { changeDefaultServingSizeAction };
