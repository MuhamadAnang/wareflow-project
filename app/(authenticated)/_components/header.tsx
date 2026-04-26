"use client";

import { Button } from "@/app/_components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

const Header = () => {

  return (
    <header className="w-full h-16 bg-sidebar border-b flex justify-between items-center p-4">
      <div className="flex gap-4 items-center w-full justify-end">
        <Button variant={"destructive"} asChild>
          <SignOutButton />
        </Button>
      </div>
    </header>
  );
};

export default Header;
