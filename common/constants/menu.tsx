"use client";

import {
  BookOpenText,
  BrainCircuit,
  LayoutDashboard,
  ListChecks,
  ShoppingCart,
  Truck,
  Undo,
  User,
  Users,
} from "lucide-react";
import { Route as RouteNext } from "next";

export type MenuItem = {
  label: string;
  href?: RouteNext;
  icon?: React.ReactNode;
};

export type MenuWithChildren = MenuItem & {
  children?: MenuItem[];
};

export const MENU_ITEMS: MenuWithChildren[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    label: "Master Buku",
    icon: <BookOpenText />,
    children: [
      {
        label: "Buku Masuk",
        href: "/bukumasuk",
      },
      {
        label: "Buku Keluar",
        href: "/bukukeluar",
      },
    ],
  },
  {
    label: "User",
    href: "/users",
    icon: <User />,
  },
  {
    label: "Customer",
    href: "/customers",
    icon: <Users />,
  },
  {
    label: "Belanja",
    href: "/belanja",
    icon: <ShoppingCart />,
  },
  {
    label: "Pesanan",
    href: "/pesanan",
    icon: <ListChecks />,
  },
  {
    label: "Pengiriman",
    href: "/pengiriman",
    icon: <Truck />,
  },
  {
    label: "Retur",
    href: "/retur",
    icon: <Undo />,
  },
  {
    label: "Prioritas Pengiriman",
    href: "/prioritas",
    icon: <BrainCircuit />,
  },
];
