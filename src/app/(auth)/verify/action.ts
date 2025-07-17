import type { DrizzleSessionScope } from "@/drizzle/schema";
import { SESSION_SCOPES } from "@/lib/constants";
import { unsafeAddSessionScopes } from "@/lib/dal/session";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedLogin } from "@/lib/services/rate-limit/auth";
import { getUserByCredentials } from "@/lib/services/user";
import { loginSchema } from "@/lib/validators/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export const verifySchema = z.object({
  redirect: z.string().refine((val) => val.startsWith("/"), {
    message: "Redirect must be a relative path",
  }),
  scope: z
    .union([
      z.enum(SESSION_SCOPES),
      z.array(z.enum(SESSION_SCOPES)),
      z.undefined(),
    ])
    .transform((val) => {
      if (Array.isArray(val)) {
        return Array.from(new Set(val));
      }
      if (typeof val === "string") {
        return [val];
      }
      return [];
    })
    .refine((val) => val.length > 0, {
      message: "At least one scope is required",
    }),
});

const schema = loginSchema.extend(verifySchema.shape);

async function verifyAction(
  redirectUrl: string,
  scopes: DrizzleSessionScope["scope"][],
  formData: FormData,
) {
  "use server";
  if (await isRateLimitedLogin()) {
    throw new Error("Too many requests.");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const dto = schema.parse({
    username,
    password,
    redirect: redirectUrl,
    scope: scopes,
  });

  const [{ user, session }, userByCredentials] = await Promise.all([
    getAuthenticatedUserFromRequest(),
    getUserByCredentials(dto.username, dto.password),
  ]);

  if (!user || !userByCredentials || user.id !== userByCredentials.id) {
    throw new Error("Couldn't verify session for the user.");
  }

  await unsafeAddSessionScopes(session, dto.scope);
  return redirect(redirectUrl);
}

export { verifyAction };
