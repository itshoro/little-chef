"use server";

import { db } from "@/drizzle/db";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateUser } from "@/lib/services/user";
import { changeUsernameSchema } from "@/lib/validators/user";
import { revalidatePath } from "next/cache";

const updateUsernameAction = async (data: FormData) => {
  const username = data.get("username") as string;
  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  try {
    const dto = changeUsernameSchema.parse({ username });

    await updateUser(db, { username: dto.username }, user);
    revalidatePath("/settings/user", "page");
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export { updateUsernameAction };
