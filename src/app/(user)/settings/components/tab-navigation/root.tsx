"use client";

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
    <nav className="relative">
      <TabNavigationContext.Provider value={{ keepSearchParams, replace }}>
        <ul
          ref={listRef}
          className="flex flex-col @sm:flex-row @sm:items-start"
        >
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
