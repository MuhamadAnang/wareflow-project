import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "./_components/ui/sonner";
import { QueryProvider } from "@/lib/tanstack";
import { SidebarProvider } from "./_components/ui/sidebar";
import { ensureEnvValidated } from "@/lib/validate-env";
import { BreadcrumbProvider } from "./_contexts/breadcrumb.context";

ensureEnvValidated();

export const metadata: Metadata = {
  title: "Bookflow",
  description:
    "Bookflow is a web application that allows users to create, simulate, and analyze various routing algorithms in a visual and interactive way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <BreadcrumbProvider>
        <html lang="en">
          <body className={`antialiased`}>
            <SidebarProvider open>{children}</SidebarProvider>
            <Toaster position="top-center" theme="light" />
          </body>
        </html>
      </BreadcrumbProvider>
    </QueryProvider>
  );
}
