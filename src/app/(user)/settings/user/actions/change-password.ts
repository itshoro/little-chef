import type { FormState } from "@/app/components/form/root";
import { findUserBySessionId, changePassword } from "@/lib/dal/user";
import { passwordSchema } from "@/lib/dal/user/types";
import { z } from "zod";

type UpdatePasswordSchema = {
  currentPassword?: string;
  newPassword?: string;
  confirmationPassword?: string;
};

const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: passwordSchema,
    confirmationPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

async function changePasswordAction(
  sessionId: string | undefined,
  _: FormState<UpdatePasswordSchema>,
  formData: FormData,
): Promise<FormState<UpdatePasswordSchema>> {
  "use server";

  try {
    const user = await findUserBySessionId(sessionId);

    const parseResult = changePasswordSchema.safeParse({
      currentPassword: formData.get("current-password"),
      confirmationPassword: formData.get("confirmation-password"),
      newPassword: formData.get("new-password"),
    });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    await changePassword(
      user,
      parseResult.data.currentPassword,
      parseResult.data.newPassword,
    );

    return {
      success: true,
      message: "Successfully changed your password.",
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message:
        e.message ||
        "Please review the form and correct the errors to proceed with changing your password.",
      errors: e.cause as Record<string, unknown>,
      controls: {}, // do not pass any passwords back to the client
    };
  }
}

export { changePasswordAction };
