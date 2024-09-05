"use client";

import Image from "next/image";
import { useState } from "react";

const CoverImage = ({ defaultValue }: { defaultValue?: string }) => {
  const [src, setSrc] = useState(defaultValue);

  function setCover(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files) return;
    if (!e.currentTarget.files[0] && src) {
      URL.revokeObjectURL(src);
      setSrc(undefined);
      return;
    }
    setSrc(URL.createObjectURL(e.currentTarget.files[0]));
  }

  return (
    <>
      <div className="relative mb-8 h-64">
        {src && (
          <Image
            alt=""
            src={src}
            height={400}
            width={600}
            className="h-full w-full rounded-2xl object-cover"
          />
        )}
        <div className="absolute bottom-0 h-3/4 w-full">
          <div className="absolute bottom-2 right-2 z-10 dark:text-white">
            <label>
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={setCover}
                className="hidden"
              />
              <div className="cursor-pointer rounded-full bg-white px-4 py-2 font-medium hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-800">
                Select Image
              </div>
            </label>
          </div>
          <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-white/70 dark:from-black/70" />
        </div>
      </div>
      <input type="hidden" name="coverImage" value={src} />
    </>
  );
};

export { CoverImage };
