"use client";

import { PublicGuard } from "./_components/public-guard";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <PublicGuard>{children}</PublicGuard>;
}