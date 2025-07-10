import { z } from "zod";
import { visibilitySchema } from "../visibility";

export type Username = z.infer<typeof usernameSchema>;
export const usernameRange = { min: 3, max: 31 } as const;
export const usernameSchema = z
  .string()
  .min(
    usernameRange.min,
    `Username must be at least ${usernameRange.min} characters.`,
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
    `Password must be at least ${passwordRange.min} characters.`,
  )
  .max(
    passwordRange.max,
    `Password must be at most ${passwordRange.max} characters.`,
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match.",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const changeUsernameSchema = z.object({
  username: usernameSchema,
});
export type ChangeUsernameFormData = z.infer<typeof changeUsernameSchema>;

export const changeCollectionDefaultVisibilitySchema = z.object({
  visibility: visibilitySchema,
});
export type ChangeCollectionDefaultVisibilityFormData = z.infer<
  typeof changeCollectionDefaultVisibilitySchema
>;

export const changeRecipeDefaultServingSizeSchema = z.object({
  servingSize: z.number().positive(),
});
export type ChangeRecipeDefaultServingSizeFormData = z.infer<
  typeof changeRecipeDefaultServingSizeSchema
>;

export const changeRecipeDefaultVisibilitySchema = z.object({
  visibility: visibilitySchema,
});
export type ChangeRecipeDefaultVisibilityFormData = z.infer<
  typeof changeRecipeDefaultVisibilitySchema
>;

export const changeAvatarSchema = z.object({
  avatarUrl: z.string().url({ message: "Invalid avatar URL." }),
});
