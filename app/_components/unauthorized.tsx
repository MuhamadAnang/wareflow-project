"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Clock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loading from "./loading";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export const Unauthorized = () => {
  const { isLoaded, isSignedIn, sessionClaims } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const isAllowed = sessionClaims?.metadata?.isAllowed === true;

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (isAllowed) {
      router.replace("/dashboard");
    }
  }, [isAllowed, isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn || isAllowed) {
    return <Loading isFullscreen />;
  }

  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-slate-50 px-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-amber-100 text-amber-700">
            <Clock />
          </EmptyMedia>
          <EmptyTitle>Menunggu Persetujuan Admin</EmptyTitle>
          <EmptyDescription>
            Akun Anda sudah terdaftar, tetapi belum dapat mengakses sistem sampai admin menyetujui
            akses Anda.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => signOut({ redirectUrl: "/sign-in" })}>
            <LogOut />
            Keluar
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};
