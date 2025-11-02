"use client";

import { Button } from "@/components/ui/buttons/button";
import { PendingButton } from "@/components/ui/buttons/pending-button";
import { Avatar } from "@/components/users/avatar";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { SettingsCard } from "../../_components/settings-card";
import { changeAvatarAction } from "../_actions/update-avatar";

const UpdateAvatar = ({ defaultValue }: { defaultValue?: string | null }) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<React.ComponentRef<"input">>(null!);
  const [avatarSrc, setAvatarSrc] = useState(defaultValue);

  function onDeleteImage() {
    inputRef.current.value = "";
    setAvatarSrc("");
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await changeAvatarAction(new FormData(e.target as HTMLFormElement));
      router.refresh();
    });
  }

  return (
    <SettingsCard>
      <form onSubmit={onSubmit}>
        <div className="mb-4 flex items-center gap-4">
          <Avatar src={avatarSrc} alt="Uploaded image" size="size-24" />
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              Choose new image
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onDeleteImage}
              disabled={avatarSrc === undefined}
            >
              Remove Image
            </Button>
            <input
              onChange={(e) => {
                if (e.target.files?.length === 1) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const image = new Image();

                    image.onload = () => {
                      const canvas = document.createElement("canvas");
                      const context = canvas.getContext("2d");

                      canvas.width = image.width;
                      canvas.height = image.height;

                      context!.drawImage(image, 0, 0);

                      const size = Math.min(image.width, image.height);
                      const x = (image.width - size) / 2;
                      const y = (image.height - size) / 2;

                      const imageData = context!.getImageData(x, y, size, size);
                      canvas.width = size;
                      canvas.height = size;
                      context!.putImageData(imageData, 0, 0);

                      setAvatarSrc(canvas.toDataURL());
                    };

                    image.src = e.target!.result as string;
                  };
                  reader.readAsDataURL(e.target.files[0] as Blob);
                }
              }}
              type="file"
              id="file"
              name="image"
              className="hidden"
              ref={inputRef}
              accept="image/jpeg, image/png, image/webp"
            />
          </div>
        </div>
        <SettingsCard.Footer
          description="While an avatar is optional. It is highly recommended and allows you
            to give your presence on Little Chef a personal touch."
          actions={
            <PendingButton pending={pending} variant="secondary" type="submit">
              Save
            </PendingButton>
          }
        />
      </form>
    </SettingsCard>
  );
};

export { UpdateAvatar };
