"use server";

import { cookies } from "next/headers";
import { lucia } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import {
  validateUser,
  validatePassword,
  validateUsername,
} from "@/lib/dal/user";

async function login(formData: FormData) {
  "use server";
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    if (!validateUsername(username)) return;
  } catch (e) {
    return {
      error: "Invalid Username",
    };
  }

  try {
    if (!validatePassword(password)) return;
  } catch (e) {
    return {
      error: "Invalid password",
    };
  }

  const user = await validateUser(username, password);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}

export { login };
