import type { FormState } from "@/app/components/form/root";
import { lucia } from "@/lib/auth/lucia";
import { findUserByCredentials } from "@/lib/dal/user";
import { authSchema } from "@/lib/dal/user/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginFormData = {
  username: string;
  password?: string;
};

async function login(formData: FormData): Promise<FormState<LoginFormData>> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const parseResult = authSchema.safeParse({ username, password });

    if (!parseResult.success) {
      throw new Error(undefined, {
        cause: parseResult.error.flatten().fieldErrors,
      });
    }

    const dto = parseResult.data;
    const user = await findUserByCredentials(dto.username, dto.password);
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

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
      controls: { username }, // Do not pass password back.
    } satisfies FormState<LoginFormData>;
  }
}

async function loginAction(
  _: FormState<LoginFormData> | null,
  formData: FormData,
): Promise<FormState<LoginFormData>> {
  "use server";
  const response = await login(formData);

  if (response.success) {
    redirect("/recipes");
  }

  return response;
}

export { loginAction };
