import type { FormState } from "@/app/components/form/root";
import { updateDefaultServingSize } from "@/lib/dal/recipe";
import { findUserBySessionId } from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ChangeDefaultServingSizeControls = {
  defaultServingSize: number;
};

const changeDefaultServingSizeSchema = z.object({
  defaultServingSize: z.number().nonnegative(),
});

async function changeDefaultServingSizeAction(
  sessionId: string | undefined,
  _: FormState<ChangeDefaultServingSizeControls>,
  formData: FormData,
): Promise<FormState<ChangeDefaultServingSizeControls>> {
  "use server";
  const defaultServingSize = Number(formData.get("defaultServingSize"));

  try {
    const user = await findUserBySessionId(sessionId);

    const parseResult = changeDefaultServingSizeSchema.safeParse({
      defaultServingSize,
    });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await updateDefaultServingSize(user, parseResult.data.defaultServingSize);
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
