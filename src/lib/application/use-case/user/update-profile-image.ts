import type { FileStorage } from "@/lib/application/shared/file-storage";
import { makeRevertibleFileReference } from "@/lib/application/shared/revertible-file-reference";
import type { User } from "@/lib/domain/user/user";
import type { UserRepository } from "@/lib/application/abstractions/user/user-repository";
import { nanoid } from "@/lib/nanoid";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";

export function makeUpdateProfileImage(
  userRepository: UserRepository,
  fileStorage: FileStorage,
) {
  return async function updateProfileImage(
    user: User,
    profileImage: File | null,
  ) {
    const tempRefRes = profileImage
      ? await fileStorage.storeTemporary(nanoid(), profileImage)
      : null;
    if (tempRefRes && !tempRefRes.ok) return tempRefRes;

    await using avatar = makeRevertibleFileReference(
      tempRefRes ? tempRefRes.value : null,
      fileStorage,
    );

    const updateRes = await userRepository.update({
      ...user,
      avatar: avatar.ref,
    });
    if (!updateRes.ok) return updateRes;

    if (user.avatar) {
      const deleteRes = await fileStorage.delete(user.avatar);
      if (!deleteRes.ok) return deleteRes;
    }
    await avatar.commit();

    taintObjectReference(
      "users may not be passed over the network boundary, consider calling `toPublicUser` first",
      updateRes.value,
    );

    return updateRes;
  };
}
