"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/app/_components/ui/empty";

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Dashboard</EmptyTitle>
          <EmptyDescription>
            Welcome to the dashboard! This is where you can find an overview of your activities and
            insights.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
