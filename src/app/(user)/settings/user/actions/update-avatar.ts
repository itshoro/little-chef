import { UnauthenticatedError } from "@/lib/errors/unauthenticated/error";
import { createRevertibleUpload } from "@/lib/integrations/uploadthing/revertible-upload";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { updateUser } from "@/lib/services/user";
import { UTApi } from "uploadthing/server";

async function changeAvatar(file: File | null) {
  const { user } = await getAuthenticatedUserFromRequest();
  if (!user) throw new UnauthenticatedError();

  const utapi = new UTApi();
  await using avatar = await createRevertibleUpload(file, utapi);

  await updateUser({ avatar: avatar?.url }, user);
  if (user.avatar) await utapi.deleteFiles(user.avatar.split("/").at(-1)!);

  avatar?.keep();
}

const changeAvatarAction = async (formData: FormData) => {
  "use server";

  const image = formData.get("image");
  if (!(image instanceof File)) return;

  await changeAvatar(image);
};

export { changeAvatarAction };
