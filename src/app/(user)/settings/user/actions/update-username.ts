import type { FormState } from "@/components/forms/form/root";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateUser } from "@/lib/services/user";
import { usernameSchema } from "@/lib/validators/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type UpdateUsernameSchema = {
  username: string;
};

const updateUsernameSchema = z.object({
  username: usernameSchema,
});

const updateUsernameAction = async (
  _: FormState<UpdateUsernameSchema>,
  formData: FormData,
): Promise<FormState<UpdateUsernameSchema>> => {
  "use server";
  const username = formData.get("username") as string;
  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const parseResult = updateUsernameSchema.safeParse({ username });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await updateUser({ username: parseResult.data.username }, user);
    revalidatePath("/settings/user", "page");
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message:
        e.message ||
        "Please review the form and correct the errors to proceed with changing your username.",
      errors: e.cause as Record<string, unknown>,
      controls: { username },
    };
  }
};

export { updateUsernameAction };
