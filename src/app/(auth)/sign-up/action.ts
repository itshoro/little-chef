"use server";

import { cookies } from "next/headers";
import { lucia } from "@/lib/auth/lucia";
import { Argon2id } from "oslo/password";
import { redirect } from "next/navigation";
import { createUser, validatePassword, validateUsername } from "@/lib/dal/user";

async function signup(formData: FormData) {
  "use server";
  const username = formData.get("username");
  const password = formData.get("password");

  if (!validateUsername(username)) return;
  if (!validatePassword(password)) return;

  const hashedPassword = await new Argon2id().hash(password);
  console.log(hashedPassword);
  const user = await createUser(username, hashedPassword);
  console.log(user);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export { signup };
