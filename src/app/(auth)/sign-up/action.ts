"use server";

import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { Argon2id } from "oslo/password";
import { redirect } from "next/navigation";
import { nanoid } from "@/lib/nanoid";

async function signup(formData: FormData) {
  "use server";
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const hashedPassword = await new Argon2id().hash(password);

  const client = getPrismaClient();
  const user = await client.user.create({
    data: {
      id: nanoid(),
      username,
      hashedPassword,
    },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

export { signup };
