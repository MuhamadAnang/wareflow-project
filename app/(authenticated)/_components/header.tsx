"use client";

import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="w-full h-16 bg-sidebar border-b flex justify-between items-center p-4">
      <SidebarTrigger className="lg:hidden" />
      <div className="flex gap-4 items-center w-full justify-end">
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
