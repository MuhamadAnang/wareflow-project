"use client";

import { Button } from "./_components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="text-center">We&apos;re experiencing an internal server issue.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
