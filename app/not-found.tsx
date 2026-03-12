"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumb } from "./_contexts/breadcrumb.context";
import { Button } from "./_components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "./_components/ui/empty";

export default function NotFound() {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([]);
  }, [setBreadcrumbs]);

  return (
    <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-4">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Resource Not Found</EmptyTitle>
          <EmptyDescription>
            The requested resource does not exist or has been removed. Please check the URL or
            contact support for assistance.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => router.replace("/")}>Go Back</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}