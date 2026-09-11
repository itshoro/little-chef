"use client";

import { useContext } from "@/hooks/use-context";
import { createContext, useRef } from "react";
import { usePathname } from "next/navigation";

type RootProps = {
  children: React.ReactNode;
  keepSearchParams?: boolean;
  replace?: boolean;
};

const Root = ({ children, keepSearchParams, replace }: RootProps) => {
  const listRef = useRef<React.ComponentRef<"ul">>(null);
  const pathname = usePathname();

  return (
    <nav className="relative isolate">
      <TabNavigationContext.Provider
        value={{ keepSearchParams, replace, pathname }}
      >
        <ul
          ref={listRef}
          className="flex flex-col @sm:flex-row @sm:items-start"
        >
          {children}
        </ul>
      </TabNavigationContext.Provider>
    </nav>
  );
};

type TabNavigationContextProps = Omit<RootProps, "children"> & {
  pathname: string;
};

const TabNavigationContext = createContext<TabNavigationContextProps>(null!);

const useTabNavigationContext = (callee: string) =>
  useContext(callee, TabNavigationContext);

export { Root, useTabNavigationContext };
