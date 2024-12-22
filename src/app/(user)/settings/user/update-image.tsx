"use client";

import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import { Avatar } from "@/app/components/header/avatar";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Fieldset } from "../components/primitives/fieldset";
import { BaseButton } from "@/app/components/base-button";

const UpdateAvatar = ({
  defaultValue,
  action,
}: {
  defaultValue?: string;
  action: (formData: FormData) => Promise<void>;
}) => {
  const router = useRouter();
  const inputRef = useRef<React.ElementRef<"input">>(null!);
  const [avatarSrc, setAvatarSrc] = useState(defaultValue);

  function onDeleteImage() {
    inputRef.current.value = "";
    setAvatarSrc(defaultValue);
  }

  return (
    <form
      action={async (formData: FormData) => {
        await action(formData);
        router.refresh();
      }}
    >
      <Fieldset label="Avatar">
        <div className="mb-4 flex items-center gap-4">
          <Avatar src={avatarSrc} alt="Uploaded image" size="size-24" />
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="file"
              className="flex-1 cursor-pointer whitespace-nowrap"
            >
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 font-medium text-black">
                Choose Image
              </div>
            </label>
            <input
              onChange={(e) => {
                if (e.target.files?.length) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setAvatarSrc(reader.result as string);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              type="file"
              id="file"
              name="image"
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
            />
            <BaseButton
              type="button"
              className="flex-1 whitespace-nowrap"
              onClick={onDeleteImage}
            >
              Delete Image
            </BaseButton>
          </div>
        </div>
        <SubmitWithPending
          className="rounded-2xl bg-lime-300 px-4 py-3 font-medium dark:text-black"
          type="submit"
        >
          Save
        </SubmitWithPending>
      </Fieldset>
    </form>
  );
};

export { UpdateAvatar };
