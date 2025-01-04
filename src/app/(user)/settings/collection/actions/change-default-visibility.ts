import type { FormState } from "@/app/components/form/root";
import { updateDefaultVisibility } from "@/lib/dal/collections";
import { findUserBySessionId } from "@/lib/dal/user";
import { visibilitySchema } from "@/lib/dal/user/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ChangeDefaultVisibilityControls = {
  visibility: string;
};

const changeDefaultVisibilitySchema = z.object({
  visibility: visibilitySchema,
});

async function changeDefaultVisibility(
  sessionId: string | undefined,
  _: FormState<ChangeDefaultVisibilityControls>,
  formData: FormData,
): Promise<FormState<ChangeDefaultVisibilityControls>> {
  "use server";

  const visibility = formData.get("visibility") as string;

  try {
    const user = await findUserBySessionId(sessionId);
    const parseResult = changeDefaultVisibilitySchema.safeParse({
      visibility,
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }
    await updateDefaultVisibility(user, parseResult.data.visibility);
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
