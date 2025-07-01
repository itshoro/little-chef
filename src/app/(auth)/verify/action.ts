import type { FormState } from "@/components/forms/form/root";
import { isRateLimitedLogin } from "@/lib/services/rate-limit/auth";
import { loginSchema, type LoginFormData } from "../login/action";
import { findUserByCredentials } from "@/lib/dal/user";
import { redirect } from "next/navigation";
import {
  addSessionScopes,
  assertAuthorizedForServerAction,
  supportedSessionScopes,
} from "@/lib/auth";
import { z } from "zod";
import type { DrizzleSessionScope } from "@/drizzle/schema";

type VerifyFormData = LoginFormData;

export const verifySchema = z.object({
  redirect: z.string().refine((val) => val.startsWith("/"), {
    message: "Redirect must be a relative path",
  }),
  scope: z
    .union([
      z.enum(supportedSessionScopes),
      z.array(z.enum(supportedSessionScopes)),
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

const schema = loginSchema.merge(verifySchema);

async function verifyAction(
  redirectUrl: string,
  scopes: DrizzleSessionScope["scope"][],
  _: FormState<VerifyFormData> | null,
  formData: FormData,
): Promise<FormState<VerifyFormData>> {
  "use server";
  if (await isRateLimitedLogin()) {
    throw new Error("Too many requests.");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const parseResult = schema.safeParse({
    username,
    password,
    redirect: redirectUrl,
    scope: scopes,
  });

  if (!parseResult.success) {
    throw new Error(undefined, {
      cause: parseResult.error.flatten().fieldErrors,
    });
  }

  const dto = parseResult.data;
  const [{ user, session }, userByCredentials] = await Promise.all([
    assertAuthorizedForServerAction(),
    findUserByCredentials(dto.username, dto.password),
  ]);

  if (user.id !== userByCredentials.id) {
    throw new Error("Couldn't verify session for the user.");
  }

  await addSessionScopes(session, dto.scope);
  return redirect(redirectUrl);
}

export { verifyAction };
