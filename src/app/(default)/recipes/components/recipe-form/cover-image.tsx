"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const CoverImage = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(defaultValue);

  function setCover(e: React.ChangeEvent<HTMLInputElement>) {
    const coverImage = e.currentTarget.files?.[0];

    setSrc((src) => {
      if (src) URL.revokeObjectURL(src);

      return coverImage ? URL.createObjectURL(coverImage) : "";
    });
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
            <div className="flex gap-2">
              {src && (
                <button
                  type="button"
                  onClick={() => {
                    ref.current!.value = "";
                    setSrc("");
                  }}
                >
                  <div className="cursor-pointer rounded-full bg-white px-4 py-2 font-medium hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-800">
                    Delete Image
                  </div>
                </button>
              )}
              <label>
                <input
                  ref={ref}
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
          </div>
          <div className="absolute bottom-0 h-full w-full bg-linear-to-t from-white/70 dark:from-black/70" />
        </div>
      </div>
    </>
  );
};

export { CoverImage };
