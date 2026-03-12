"use client";

import { Route } from "next";
import { PERMISSIONS, TPermission } from "./permissions";

type TPageAccessPermissions = {
  route: Route;
  permissions: TPermission[];
};

export const PAGE_ACCESS_PERMISSIONS: TPageAccessPermissions[] = [
  {
    route: "/users/waitlist",
    permissions: [PERMISSIONS.VIEW_WAITLIST],
  },
  {
    route: "/roles",
    permissions: [PERMISSIONS.VIEW_ROLE],
  },
  {
    route: "/simulations",
    permissions: [PERMISSIONS.VIEW_SIMULATION],
  },
];
