"use client";

import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";
import { ProtectedGuard } from "./_components/protected-guard";
import { SidebarProvider } from "../_components/ui/sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedGuard>
      <SidebarProvider open>
        <div className="w-full h-screen flex flex-col">
          <main className="w-full flex h-full overflow-hidden">
            <AuthenticatedSidebar />
            <div className="flex flex-col w-full">
              <Header />
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedGuard>
  );
}
