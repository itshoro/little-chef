"use server";

import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { requireSession } from "@/lib/utils/auth/require-session";
import { updateProfileImage } from "@/lib/utils/user/update-profile-image";

const changeAvatarAction = async (formData: FormData) => {
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return;

  const { user } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  console.log(await updateProfileImage(user, image));
};

export { changeAvatarAction };
