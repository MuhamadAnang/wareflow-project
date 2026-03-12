"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface Props {
  isFullscreen?: boolean;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  color?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export default function Loading({ isFullscreen = true, className = "", color }: Props = {}) {
  return (
    <div
      className={cn(
        "flex justify-center items-center",
        isFullscreen ? "w-dvw h-dvh" : "",
        className,
      )}
    >
      <Spinner className={cn(color ? `${color}` : "text-primary", "h-5 w-5")} />
    </div>
  );
}
