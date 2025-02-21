import type { FormState } from "@/app/components/form/root";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth";
import { createUser } from "@/lib/dal/user";
import { passwordSchema, usernameSchema } from "@/lib/dal/user/types";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { z } from "zod";

type SignUpData = {
  username: string;
  password?: string;
  confirmPassword?: string;
  inviteCode?: string;
};

const signUpSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmationPassword: passwordSchema,
    inviteCode: z.string(),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmation-password"],
  });

async function signup(formData: FormData): Promise<FormState<SignUpData>> {
  "use server";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmationPassword = formData.get("confirmation-password") as string;
  const inviteCode = formData.get("invite-code") as string;

  try {
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

    // TODO: if usernames are unique, check if username is already taken.
    const hashedPassword = await new Argon2id().hash(dto.password);
    const user = await createUser(username, hashedPassword);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

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
