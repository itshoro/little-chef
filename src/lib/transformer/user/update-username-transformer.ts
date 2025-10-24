import { usernameSchema } from "@/lib/domain/user/credentials";
import * as z from "zod";

const UpdateUsername = z.object({
  username: usernameSchema,
});

export function dtoFromFormData(formData: FormData) {
  const username = formData.get("username") as string;

  const result = UpdateUsername.parse({
    username,
  });

  return result;
}
