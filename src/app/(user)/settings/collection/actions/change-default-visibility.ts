import type { FormState } from "@/components/forms/form/root";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateCollectionPreferences } from "@/lib/services/user";
import { visibilitySchema } from "@/lib/validators/visibility";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ChangeDefaultVisibilityControls = {
  visibility: string;
};

const changeDefaultVisibilitySchema = z.object({
  visibility: visibilitySchema,
});

async function changeDefaultVisibility(
  _: FormState<ChangeDefaultVisibilityControls>,
  formData: FormData,
): Promise<FormState<ChangeDefaultVisibilityControls>> {
  "use server";

  const visibility = formData.get("visibility") as string;
  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const parseResult = changeDefaultVisibilitySchema.safeParse({
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

    return {
      success: false,
      message: e.message,
      errors: e.cause as Record<string, unknown>,
      controls: { visibility },
    };
  }
}

export { changeDefaultVisibility };
