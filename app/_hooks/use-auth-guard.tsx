import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type GuardType = "public" | "protected";

export function useAuthGuard(type: GuardType = "protected") {
  const { isSignedIn, sessionClaims, isLoaded } = useAuth();
  const router = useRouter();

  const isAllowed = sessionClaims?.metadata?.isAllowed === true;

  useEffect(() => {
    if (!isLoaded) return;

    if (type === "protected") {
      if (!isSignedIn) {
        router.replace("/sign-in");
        return;
      }

      if (!isAllowed) {
        router.replace("/unauthorized");
        return;
      }
    }

    if (type === "public") {
      if (isSignedIn && isAllowed) {
        router.replace("/dashboard");
        return;
      }

      if (isSignedIn && !isAllowed) {
        router.replace("/unauthorized");
      }
    }
  }, [isSignedIn, isAllowed, type, router, isLoaded]);

  return {
    isSignedIn,
    isAllowed,
    isLoading:
      !isLoaded ||
      (type === "protected" && (!isSignedIn || !isAllowed)) ||
      (type === "public" && isSignedIn === true),
  };
}
