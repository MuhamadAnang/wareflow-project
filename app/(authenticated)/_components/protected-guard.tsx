"use client";

import Loading from "@/app/_components/loading";
import { useAuthGuard } from "@/app/_hooks/use-auth-guard";

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isAllowed, isLoading } = useAuthGuard("protected");

    if (isLoading || !isSignedIn || !isAllowed) {
        return <Loading isFullscreen />;
    }

    return <>{children}</>;
}