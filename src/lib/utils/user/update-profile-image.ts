import { db } from "@/drizzle/db";
import { makeUpdateProfileImage } from "@/lib/application/use-case/user/update-profile-image";
import { DrizzleUserRepository } from "@/lib/infrastructure/repositories/drizzle/user/user-repository";
import { UploadthingFileStorage } from "@/lib/infrastructure/shared/uploadthing-file-storage";
import { UTApi } from "uploadthing/server";

export async function updateProfileImage(
  ...args: Parameters<ReturnType<typeof makeUpdateProfileImage>>
): ReturnType<ReturnType<typeof makeUpdateProfileImage>> {
  const fileStorage = new UploadthingFileStorage(new UTApi(), db);
  const userRepository = new DrizzleUserRepository(db);

  const updateProfileImage = makeUpdateProfileImage(
    userRepository,
    fileStorage,
  );

  return await updateProfileImage(...args);
}
