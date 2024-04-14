"use client";

import { useEffect, useRef } from "react";

function calculateStyle(
  activePathname: string,
  listRef: React.RefObject<HTMLElement>,
) {
  const activeTab = listRef.current?.querySelector<React.ElementRef<"a">>(
    `a[href='${activePathname}']`,
  );

  return {
    width: `${activeTab?.clientWidth ?? 0}px`,
    height: `${activeTab?.clientHeight ?? 0}px`,
    transform: `translateX(${activeTab?.offsetLeft ?? 0}px) translateY(${activeTab?.offsetTop ?? 0}px)`,
  };
}

const Highlight = ({
  activePathname,
  listRef,
}: {
  activePathname: string;
  listRef: React.RefObject<HTMLElement>;
}) => {
  const ref = useRef<React.ElementRef<"span">>(null);

  function highlightActiveTab() {
    if (!ref.current) return;

    const style = calculateStyle(activePathname, listRef);
    ref.current.style.width = style.width;
    ref.current.style.height = style.height;
    ref.current.style.transform = style.transform;
  }

  function reevaluateStyle() {
    ref.current?.classList.remove("transition-all");
    highlightActiveTab();

    queueMicrotask(() => {
      ref.current?.classList.add("transition-all");
    });
  }

  useEffect(() => {
    if (!ref.current) return;

    highlightActiveTab();
    queueMicrotask(() => {
      ref.current?.classList.add("transition-all");
    });

    // match any default tailwind breakpoint
    const mediaQuery = window.matchMedia(
      "(min-width: 640px), (min-width: 768px), (min-width: 1024px), (min-width: 1280px), (min-width: 1536px)",
    );
    mediaQuery.addEventListener("change", reevaluateStyle);

    return () => mediaQuery.removeEventListener("change", reevaluateStyle);
  }, [activePathname, ref.current]);

  return (
    <span ref={ref} className="absolute top-0 -z-10 rounded-full bg-lime-300" />
  );
};

export { Highlight };
