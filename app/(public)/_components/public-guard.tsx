import Loading from "@/app/_components/loading";
import { useAuthGuard } from "@/app/_hooks/use-auth-guard";

export function PublicGuard({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuthGuard("public");

    if (isLoading) {
        return <Loading isFullscreen />;
    }

    return <>{children}</>;
}