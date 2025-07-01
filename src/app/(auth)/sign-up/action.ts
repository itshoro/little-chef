import type { FormState } from "@/components/forms/form/root";
import { signUp } from "@/lib/services/auth";
import { isRateLimitedSignUp } from "@/lib/services/rate-limit/auth";
import { signUpSchema } from "@/lib/validators/auth";
import { redirect } from "next/navigation";

type SignUpData = {
  username: string;
  password?: string;
  confirmPassword?: string;
  inviteCode?: string;
};

async function signup(formData: FormData): Promise<FormState<SignUpData>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;
  const inviteCode = formData.get("invite-code") as string;

  try {
    if (await isRateLimitedSignUp()) {
      throw new Error("Too many requests.");
    }

    const parseResult = signUpSchema.safeParse({
      username,
      password,
      confirmationPassword,
      inviteCode,
    });
    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    const dto = parseResult.data;
    if (dto.inviteCode !== process.env.INVITE_CODE) {
      throw new Error("The entered invite code is invalid.");
    }

    await signUp(dto);

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
        "Please review the form and correct the errors to proceed with your login.",
      errors: e.cause as Record<string, unknown>,
      controls: { username }, // Do not pass password or invite code back.
    } satisfies FormState<SignUpData>;
  }
}

async function signupAction(
  _: FormState<SignUpData>,
  formData: FormData,
): Promise<FormState<SignUpData>> {
  "use server";
  const response = await signup(formData);

  if (response.success) redirect("/recipes");
  return response;
}

export { signupAction };
