import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type GuardType = "public" | "protected";

export function useAuthGuard(type: GuardType = "protected") {
    const { isSignedIn, sessionClaims, signOut, isLoaded } = useAuth();
    const router = useRouter();

    const isAllowed = sessionClaims?.metadata?.isAllowed || false;

    useEffect(() => {
        if (type === "protected") {
            if (!isSignedIn && isLoaded) {
                console.log("Masuk sini");
                router.replace("/sign-in");
                return;
            }

            if (!isAllowed && isLoaded) {
                console.log("Masuk sini juga");
                signOut();
                return;
            }
        }

        if (type === "public") {
            if (isSignedIn && isAllowed) {
                router.replace("/dashboard");
            }
        }
    }, [isSignedIn, isAllowed, type, router, signOut, isLoaded]);

    return {
        isSignedIn,
        isAllowed,
        isLoading: isSignedIn === undefined,
    };
}