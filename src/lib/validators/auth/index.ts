import { z } from "zod";
import { passwordSchema, usernameSchema } from "../user";

const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

const signUpSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmationPassword: passwordSchema,
    inviteCode: z.string(),
  })
  .refine((data) => data.password === data.confirmationPassword, {
    message: "Passwords must match.",
    path: ["confirmation-password"],
  });

export { loginSchema, signUpSchema };
