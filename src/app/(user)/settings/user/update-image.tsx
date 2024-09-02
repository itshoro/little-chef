"use client";

import { UploadButton } from "@/app/components/uploadthing/upload";
import { useRouter } from "next/navigation";

const UpdateAvatar = () => {
  const router = useRouter();
  return (
    <UploadButton
      endpoint="profilePicture"
      className="w-full"
      appearance={{
        button:
          "w-full whitespace-nowrap rounded-full bg-lime-300 px-5 py-3 text-center font-medium dark:text-black",
      }}
      onClientUploadComplete={() => {
        router.refresh();
      }}
    />
  );
};

export { UpdateAvatar };
