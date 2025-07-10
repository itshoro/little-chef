"use server";

import { db } from "@/drizzle/db";
import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { createRevertibleUpload } from "@/lib/integrations/uploadthing/revertible-upload";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateUser } from "@/lib/services/user";
import { UTApi } from "uploadthing/server";

const changeAvatarAction = async (formData: FormData) => {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return;

  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  const utapi = new UTApi();
  await using avatar = await createRevertibleUpload(image, utapi);

  await updateUser(db, { avatar: avatar?.url }, user);

  if (user.avatar) {
    await utapi.deleteFiles(user.avatar.split("/").at(-1)!);
  }

  avatar?.keep();
};

export { changeAvatarAction };
