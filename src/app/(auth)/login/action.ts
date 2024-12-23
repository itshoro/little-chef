import { lucia } from "@/lib/auth/lucia";
import { validateUser } from "@/lib/dal/user";
import { authSchema, type Password, type Username } from "@/lib/dal/user/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginFormState } from "./form";

function validateAuthSchema(details: {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}) {
  const dto = authSchema.safeParse(details);

  if (!dto.success) {
    throw new Error("Couldn't safely parse authSchema", {
      cause: dto.error.flatten().fieldErrors,
    });
  }

  return dto.data as { username: Username; password: Password };
}

async function login(formData: FormData): Promise<LoginFormState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const dto = validateAuthSchema({ username, password });

    const user = await validateUser(dto.username, dto.password);
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    if (!(e instanceof Error)) throw e;

    return {
      success: false,
      message: "Please fix the marked issues in the form",
      errors: e.cause as LoginFormState["errors"],
      data: { username }, // Do not pass password back.
    };
  }

  return {
    success: true,
    message: "",
  };
}

async function loginAction(
  _: LoginFormState | null,
  formData: FormData,
): Promise<LoginFormState> {
  "use server";
  const response = await login(formData);

  if (response.success) {
    redirect("/recipes");
  }

  return response;
}

export { loginAction };
