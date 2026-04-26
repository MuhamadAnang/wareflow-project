"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <SignIn />
    </main>
  )
}
