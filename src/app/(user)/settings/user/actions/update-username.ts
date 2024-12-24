import type { FormState } from "@/app/components/form/root";
import { changeUsername, findUserBySessionId } from "@/lib/dal/user";
import { usernameSchema } from "@/lib/dal/user/types";
import { z } from "zod";

type UpdateUsernameSchema = {
  username: string;
};

const updateUsernameSchema = z.object({
  username: usernameSchema,
});

const updateUsernameAction = async (
  sessionId: string | undefined,
  _: FormState<UpdateUsernameSchema>,
  formData: FormData,
): Promise<FormState<UpdateUsernameSchema>> => {
  "use server";
  const username = formData.get("username") as string;

  try {
    const user = await findUserBySessionId(sessionId);

    const parseResult = updateUsernameSchema.safeParse({ username });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await changeUsername(user, parseResult.data.username);

    return {
      success: true,
      message: "Successfully changed your username.",
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
