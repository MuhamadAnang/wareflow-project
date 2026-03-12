"use client";

import Link from "next/link";
import { Button } from "../_components/ui/button";

export default function Page() {
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <Link href={"/sign-in"}>
        <Button>Masuk</Button>
      </Link>
      <Link href={"/waitlist"} className="ml-4">
        <Button variant="outline">Daftar Waitlist</Button>
      </Link>
    </main>
  );
}
