"use server";

import type { FormState } from "@/app/components/form/root";
import { lucia } from "@/lib/auth/lucia";
import {
  createUser,
  assertValidPassword,
  assertValidUsername,
} from "@/lib/dal/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

async function signup(formData: FormData) {
  "use server";
  const username = formData.get("username");
  const password = formData.get("password");
  const inviteCode = formData.get("invite-code");

  if (inviteCode !== process.env.INVITE_CODE)
    throw new Error("Invalid invite code.");

  if (!assertValidUsername(username)) return;
  if (!assertValidPassword(password)) return;

  const hashedPassword = await new Argon2id().hash(password);
  const user = await createUser(username, hashedPassword);

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

async function signupAction(_: FormState, formData: FormData) {
  try {
    await signup(formData);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw new Error("Unexpected error thrown.");
    }

    return {
      success: false,
      error: e.message,
    } satisfies FormState;
  }

  return redirect("/recipes");
}

export { signupAction };
