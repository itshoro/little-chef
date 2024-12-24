import { z } from "zod";

export type Username = z.infer<typeof usernameSchema>;
export const usernameRange = { min: 3, max: 31 } as const;
export const usernameSchema = z
  .string()
  .min(
    usernameRange.min,
    `Username must be atleast ${usernameRange.min} characters.`,
  )
  .max(
    usernameRange.max,
    `Username must be at most ${usernameRange.max} characters.`,
  )
  .regex(
    /^[a-z0-9_-]+$/,
    "Usernames may only contain lowercase letters (a - z), numbers (0 - 9), hyphens (-) or underscores (_).",
  )
  .brand("Username");

export type Password = z.infer<typeof passwordSchema>;
export const passwordRange = { min: 6, max: 255 } as const;
export const passwordSchema = z
  .string()
  .min(
    passwordRange.min,
    `Password must be atleast ${passwordRange.min} characters.`,
  )
  .max(
    passwordRange.max,
    `Password must be at most ${passwordRange.max} characters.`,
  )
  .brand("Password");

export const authSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type Visibility = z.infer<typeof visibilitySchema>;
export const supportedVisibilites = ["public", "unlisted", "private"] as const;
export const visibilitySchema = z.enum(supportedVisibilites);
