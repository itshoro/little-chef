"use client";

import { Avatar } from "@/app/components/header/avatar";
import { useState } from "react";
import { Fieldset } from "../components/primitives/fieldset";
import { UploadButton } from "@/app/components/uploadthing/upload";

const UpdateAvatar = ({
  defaultValue,
  action,
}: {
  defaultValue?: string;
  action: (formData: FormData) => Promise<void>;
}) => {
  const [avatarSrc, setAvatarSrc] = useState(defaultValue);

  return (
    <Fieldset label="Avatar">
      <div className="mb-4 flex items-center gap-4">
        <Avatar src={avatarSrc} alt="Uploaded image" size="size-24" />
        <div className="flex w-full flex-wrap items-center gap-2">
          <UploadButton
            endpoint="imageUploader"
            className="w-full"
            appearance={{
              button:
                "w-full whitespace-nowrap rounded-full bg-lime-300 px-5 py-3 text-center font-medium dark:text-black",
            }}
            onClientUploadComplete={async (res) => {
              const image = res.pop();
              if (image) {
                setAvatarSrc(image.url);
                const formData = new FormData();
                formData.set("image", image.url);

                await action(formData);
              }
            }}
          />
        </div>
      </div>
    </Fieldset>
  );
};

export { UpdateAvatar };
