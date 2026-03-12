"use client";

import { Route } from "next";
import { createContext, useCallback, useContext, useState } from "react";

type TBreadcrumbItem = {
  label: string;
  href?: Route;
};

const BreadcrumbContext = createContext<{
  breadcrumbs: TBreadcrumbItem[];
  setBreadcrumbs: (items: TBreadcrumbItem[]) => void;
} | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<TBreadcrumbItem[]>([]);

  const setBreadcrumbs = useCallback((items: TBreadcrumbItem[]) => {
    setBreadcrumbsState(items);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error("useBreadcrumb must be used inside BreadcrumbProvider");
  return ctx;
}
