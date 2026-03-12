"use client";

import Header from "./_components/header";
import AuthenticatedSidebar from "./_components/sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <main className="w-full flex h-full overflow-hidden">
        <AuthenticatedSidebar />
        {children}
      </main>
    </div>
  );
}
