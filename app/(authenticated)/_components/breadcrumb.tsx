"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from "@/app/_components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length > 0
          ? breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {breadcrumb.href && isActive(breadcrumb.href) ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))
          : null}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
