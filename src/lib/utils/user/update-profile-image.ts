import { makeUpdateProfileImage } from "@/application/use-case/user/update-profile-image";
import { db } from "@/drizzle/db";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle/user/user-repository";
import { UploadthingFileStorage } from "@/infrastructure/shared/uploadthing-file-storage";
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
