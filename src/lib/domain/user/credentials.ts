import * as z from "zod/mini";

export type Username = z.infer<typeof usernameSchema>;
export const usernameRange = { min: 3, max: 31 } as const;
export const usernameSchema = z
  .string()
  .check(
    z.minLength(usernameRange.min),
    z.maxLength(usernameRange.max),
    z.regex(/^[a-z0-9_-]+$/),
  )
  .brand("Username");

export type Password = z.infer<typeof passwordSchema>;
export const passwordRange = { min: 6, max: 255 } as const;
export const passwordSchema = z
  .string()
  .check(z.minLength(passwordRange.min), z.maxLength(passwordRange.max));
