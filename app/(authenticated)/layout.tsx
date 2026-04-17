"use client";

import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col">
      <main className="w-full flex h-full overflow-hidden">
        <AuthenticatedSidebar />
        <div className="flex flex-col w-full">
          <Header />
          {children}
        </div>
      </main>
    </div>
  );
}
