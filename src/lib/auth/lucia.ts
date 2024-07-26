import { Lucia } from "lucia";
import { cookies } from "next/headers";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/drizzle/db";
import type { InferSelectModel } from "drizzle-orm";

import { users, sessions } from "@/drizzle/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      publicId: attributes.publicId,
      username: attributes.username,
    };
  },
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

async function validateRequest() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } else if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: Omit<
      InferSelectModel<typeof users>,
      "id" | "hashedPassword"
    >;
  }
}

export { lucia, validateRequest };
