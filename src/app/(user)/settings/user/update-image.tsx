"use client";

import { Avatar } from "@/app/components/header/avatar";
import { useRef, useState } from "react";

const UpdateAvatar = ({ defaultValue }: { defaultValue: string }) => {
  const inputRef = useRef<React.ElementRef<"input">>(null);
  const [avatarSrc, setAvatarSrc] = useState(defaultValue);

  function onDeleteImage() {
    if (inputRef.current) inputRef.current.value = "";
    setAvatarSrc(defaultValue);
  }

  return (
    <div className="mb-4 flex items-center gap-4">
      <Avatar src={avatarSrc} alt="Uploaded image" size="size-24" />
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="file" className="flex-1 cursor-pointer">
          <button
            type="button"
            className="w-full whitespace-nowrap rounded-full bg-lime-300 px-5 py-3 text-center font-medium"
          >
            Choose Image
          </button>
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
        />
        <button
          className="flex-1 whitespace-nowrap rounded-full bg-black px-5 py-3 text-center font-medium text-white"
          type="button"
          onClick={onDeleteImage}
        >
          Delete Image
        </button>
      </div>
    </div>
  );
};

export { UpdateAvatar };