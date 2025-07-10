"use client";

import { usePathname } from "next/navigation";
import { SettingsSidebar } from "./settings-sidebar";

const SettingsSidebarWrapper = () => {
  const pathname = usePathname();

  return <SettingsSidebar showMenu={pathname === "/settings"} />;
};

export { SettingsSidebarWrapper };
