"use client";

import { usePathname } from "next/navigation";
import { Highlight } from "./highlight";
import { useRef } from "react";

const Root = ({ children }: { children: React.ReactNode }) => {
  const listRef = useRef<React.ElementRef<"ul">>(null);
  const pathname = usePathname();

  return (
    <nav className="relative @container">
      <ul ref={listRef} className="flex flex-col items-start @sm:flex-row">
        {children}
      </ul>
      <Highlight activePathname={pathname} listRef={listRef} />
    </nav>
  );
};

export { Root };
