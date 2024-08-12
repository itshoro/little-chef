"use server";

import { lucia } from "@/lib/auth/lucia";
import {
  validatePassword,
  validateUser,
  validateUsername,
} from "@/lib/dal/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { FormContext } from "../../components/form/root";

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

async function loginAction(_: FormContext, formData: FormData) {
  "use server";
  try {
    await login(formData);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw new Error("Unexpected error thrown.");
    }

    return {
      success: false,
      error: e.message,
    } satisfies FormContext;
  }

  redirect("/recipes");
}

export { loginAction };
