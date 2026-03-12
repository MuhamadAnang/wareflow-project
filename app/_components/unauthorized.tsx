"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";

export const Unauthorized = () => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Unauthorized Access</EmptyTitle>
          <EmptyDescription>
            You do not have permission to access this page. Please contact your administrator if you
            believe this is an error.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/">
            <Button>Go Back</Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
};
