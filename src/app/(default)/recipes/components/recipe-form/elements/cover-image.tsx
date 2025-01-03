"use client";

import { BaseButton } from "@/app/components/base-button";
import Image from "next/image";
import { useRef, useState } from "react";

const CoverImageInput = ({ defaultValue }: { defaultValue?: string }) => {
  const [priorSrc, setPriorSrc] = useState(defaultValue);

  const newCoverRef = useRef<HTMLInputElement>(null);
  const currentCoverRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(defaultValue);

  function setCover(e: React.ChangeEvent<HTMLInputElement>) {
    const coverImage = e.currentTarget.files?.[0];
    if (coverImage === undefined) return; // retain image on cancel - users should utilize the delete button

    setPriorSrc("");
    setSrc((src) => {
      if (src) URL.revokeObjectURL(src);

      return coverImage ? URL.createObjectURL(coverImage) : "";
    });
  }

  return (
    <>
      <div className="relative isolate mb-8 h-64 overflow-hidden rounded-2xl ring ring-inset dark:ring-white/10">
        {src && (
          <>
            <div className="pointer-events-none absolute bottom-0 z-10 flex h-3/4 w-full">
              <div className="z-10 flex size-full items-end justify-end p-4 dark:text-white">
                <div className="flex gap-2">
                  <BaseButton
                    type="button"
                    onClick={() => {
                      newCoverRef.current?.click();
                    }}
                    className="pointer-events-auto flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                      <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                    </svg>
                    Select Image
                  </BaseButton>
                  <button
                    className="pointer-events-auto rounded-full bg-lime-300 text-black"
                    type="button"
                    onClick={() => {
                      newCoverRef.current!.value = "";
                      setPriorSrc("");
                      setSrc("");
                    }}
                  >
                    <div className="grid size-12 cursor-pointer place-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span className="sr-only">Delete Image</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <Image
              alt=""
              src={src}
              height={400}
              width={600}
              className="size-full object-cover"
            />
          </>
        )}
        <label className="absolute inset-0 block">
          {!src && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 select-none">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-stone-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>Choose a cover image.</div>
              <div className="text-sm text-stone-600">2 MB max file size</div>
            </div>
          )}
          <input
            ref={newCoverRef}
            type="file"
            name="cover"
            accept="image/*"
            onChange={setCover}
            className="hidden"
          />
          <input
            ref={currentCoverRef}
            type="hidden"
            name="prior-cover"
            value={priorSrc}
          />
        </label>
      </div>
    </>
  );
};

export { CoverImageInput };
