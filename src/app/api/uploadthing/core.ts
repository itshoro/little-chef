import { validateRequest } from "@/lib/auth/lucia";
import { changeAvatar } from "@/lib/dal/user";
import { revalidatePath } from "next/cache";
import {
  createUploadthing,
  type FileRouter as UTFileRouter,
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  profilePicture: f({
    image: { maxFileSize: "512KB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await changeAvatar(metadata.user, file.url);
      revalidatePath("/settings/user");
    }),
} satisfies UTFileRouter;

export type FileRouter = typeof fileRouter;
