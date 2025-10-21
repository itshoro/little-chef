import { usernameSchema } from "@/domain/user/credentials";
import * as z from "zod";

export const UpdateUsername = z.object({
  username: usernameSchema,
});

export type ChangePasswordFormData = z.infer<typeof UpdateUsername>;

export function dtoFromFormData(formData: FormData) {
  const username = formData.get("username") as string;

  const result = UpdateUsername.parse({
    username,
  });

  return result;
}
