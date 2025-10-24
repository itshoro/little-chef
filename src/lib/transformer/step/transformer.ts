import * as z from "zod/mini";

export const Step = z
  .string()
  .check(z.minLength(2), z.maxLength(280), z.trim());
