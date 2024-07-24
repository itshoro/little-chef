"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const breakpoints = {
  sm: "640",
  md: "768",
  lg: "1024",
  xl: "1280",
  "2xl": "1536",
} as const;

function calculateStyle(
  activePathname: string,
  listRef: React.RefObject<HTMLElement>,
) {
  if (!listRef.current) return undefined;

  const activeTab = listRef.current.querySelector<React.ElementRef<"a">>(
    `a[href^='${activePathname}']`,
  );

  if (!activeTab) return undefined;

  const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeTab;
  const offsetBottom =
    listRef.current.offsetHeight - (offsetTop + offsetHeight);
  const offsetRight = listRef.current.offsetWidth - (offsetLeft + offsetWidth);

  const percentageTop = (offsetTop / listRef.current.offsetHeight) * 100;
  const percentageRight = (offsetRight / listRef.current.offsetWidth) * 100;
  const percentageBottom = (offsetBottom / listRef.current.offsetHeight) * 100;
  const percentageLeft = (offsetLeft / listRef.current.offsetWidth) * 100;

  return {
    clipPath: `inset(${percentageTop.toFixed()}% ${percentageRight.toFixed()}% ${percentageBottom.toFixed()}% ${percentageLeft.toFixed()}% round 9999px)`,
  } satisfies React.CSSProperties;
}

const Highlight = ({ listRef }: { listRef: React.RefObject<HTMLElement> }) => {
  const ref = useRef<React.ElementRef<"span">>(null);
  const activePathname = usePathname();

  function highlightActiveTab() {
    if (!ref.current) return;

    const style = calculateStyle(activePathname, listRef);
    if (!style) return;

    ref.current.style.clipPath = style.clipPath;
  }

  function reevaluateStyle() {
    ref.current?.classList.remove("transition-all");
    highlightActiveTab();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ref.current?.classList.add("transition-all");
      });
    });
  }

  // Highlight tab before initial render to suppress FOUC
  useLayoutEffect(() => {
    highlightActiveTab();
  }, []);

  useEffect(() => {
    highlightActiveTab();
  }, [activePathname]);

  // Add transition property after initial render.
  useEffect(() => {
    ref.current?.classList.add("transition-all");
    return () => ref.current?.classList.remove("transition-all");
  }, []);

  useEffect(() => {
    // match any default tailwind breakpoint
    const screenMediaQueries = Object.values(breakpoints).map((breakpoint) => {
      const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
      mediaQuery.addEventListener("change", reevaluateStyle);
      return mediaQuery;
    });

    return () => {
      screenMediaQueries.forEach((mediaQuery) =>
        mediaQuery.removeEventListener("change", reevaluateStyle),
      );
    };
  }, [activePathname]);

  return (
    <span
      ref={ref}
      className="absolute top-0 -z-10 h-full w-full bg-lime-300"
    />
  );
};

export { Highlight };
