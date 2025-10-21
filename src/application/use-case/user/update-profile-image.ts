import type { FileStorage } from "@/application/shared/file-storage";
import { makeRevertibleFileReference } from "@/application/shared/revertible-file-reference";
import type { User } from "@/domain/user/user";
import type { UserRepository } from "@/domain/user/user-repository";
import { nanoid } from "@/lib/nanoid";

export function makeUpdateProfileImage(
  userRepository: UserRepository,
  fileStorage: FileStorage,
) {
  return async function updateProfileImage(
    user: User,
    profileImage: File | null,
  ) {
    await using avatar = makeRevertibleFileReference(
      profileImage
        ? await fileStorage.storeTemporary(nanoid(), profileImage)
        : null,
      fileStorage,
    );

    const result = await userRepository.update({ ...user, avatar: avatar.ref });
    if (!result.ok) return result;

    if (user.avatar) await fileStorage.delete(user.avatar);

    await avatar.commit();
    return result;
  };
}
