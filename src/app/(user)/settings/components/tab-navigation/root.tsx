"use client";

import { usePathname } from "next/navigation";
import { Highlight } from "./highlight";
import { createContext, useRef } from "react";
import { useContext } from "@/hooks/useContext";

type RootProps = {
  children: React.ReactNode;
  keepSearchParams?: boolean;
  replace?: boolean;
};

const Root = ({ children, keepSearchParams, replace }: RootProps) => {
  const listRef = useRef<React.ElementRef<"ul">>(null);

  return (
    <nav className="relative @container">
      <TabNavigationContext.Provider value={{ keepSearchParams, replace }}>
        <ul ref={listRef} className="flex flex-col items-start @sm:flex-row">
          {children}
        </ul>
      </TabNavigationContext.Provider>
      <Highlight listRef={listRef} />
    </nav>
  );
};

type TabNavigationContextProps = Omit<RootProps, "children">;

const TabNavigationContext = createContext<TabNavigationContextProps>(null!);

const useTabNavigationContext = (callee: string) =>
  useContext(callee, TabNavigationContext);

export { Root, useTabNavigationContext };
