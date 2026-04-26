import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "./_components/ui/sonner";
import { QueryProvider } from "@/lib/tanstack";
import { ensureEnvValidated } from "@/lib/validate-env";
import { BreadcrumbProvider } from "./_contexts/breadcrumb.context";
import { ClerkProvider } from "@clerk/nextjs";

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
      <ClerkProvider afterSignOutUrl={"/sign-in"} >
        <BreadcrumbProvider>
          <html lang="en">
            <body className={`antialiased`}>
              <Toaster position="top-center" theme="light" />
              {children}
            </body>
          </html>
        </BreadcrumbProvider>
      </ClerkProvider>
    </QueryProvider >
  );
}
