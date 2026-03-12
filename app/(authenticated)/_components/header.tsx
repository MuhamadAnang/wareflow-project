"use client";

import NotificationDropdown from "./notification.dropdown";
import DownloadTemplateButton from "./download-template.button";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import Logo from "@/app/_components/logo";
import Breadcrumb from "./breadcrumb";

const Header = () => {
  // const { isAdmin } = useUserContext();
  const isAdmin = false;

  return (
    <header className="w-full h-16 bg-sidebar border-b flex justify-between items-center p-4">
      <div className="flex items-center gap-4 h-fit">
        <SidebarTrigger />
        <Logo />
        <Breadcrumb />
      </div>
      <div className="flex gap-4 items-center">
        {!isAdmin && (
          <>
            <DownloadTemplateButton />
            <NotificationDropdown />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
