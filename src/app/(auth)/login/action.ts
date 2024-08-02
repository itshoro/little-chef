"use server";

import { cookies } from "next/headers";
import { lucia } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import {
  validateUser,
  validatePassword,
  validateUsername,
} from "@/lib/dal/user";
import type { FormError } from "../../components/form/root";

async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!validateUsername(username)) return;
  if (!validatePassword(password)) return;

  const user = await validateUser(username, password);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

async function loginAction(previousState: FormError, formData: FormData) {
  "use server";
  try {
    await login(formData);
  } catch (e) {
    if (
      !(e instanceof Error) ||
      !e.cause ||
      typeof e.cause !== "object" ||
      !("target" in e.cause) ||
      typeof e.cause.target !== "string"
    ) {
      throw new Error("Unexpected error thrown.");
    }

    return {
      error: { target: e.cause.target, message: e.message },
    } satisfies FormError;
  }

  redirect("/recipes");
}

export { loginAction };
