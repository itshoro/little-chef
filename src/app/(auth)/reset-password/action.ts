import { resetPassword } from "@/lib/utils/auth/reset-password";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { dtoFromFormData } from "@/transformer/auth/reset-password";
import { redirect, RedirectType } from "next/navigation";

async function resetPasswordAction(token: string, formData: FormData) {
  "use server";
  if (await isRateLimitedGlobally("write")) {
    throw new Error("Too many requests.");
  }

  const dto = dtoFromFormData(formData);
  const result = await resetPassword(token, dto.password);

  if (result.ok) redirect("/recipes", RedirectType.replace);
}

export { resetPasswordAction };
