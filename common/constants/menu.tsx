"use client";

import {
  Album,
  ArrowBigDown,
  BookType,
  BrainCircuit,
  Building,
  LayoutDashboard,
  ListChecks,
  ShoppingCart,
  Truck,
  Undo2,
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

export type MenuGroup = {
  label: string;
  items: MenuWithChildren[];
};

export const MENU_GROUPS: MenuGroup[] = [
  {
    label: "General",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    label: "Master Data",
    items: [
      { label: "Customer", href: "/customers", icon: <Users /> },
      { label: "Percetakan", href: "/percetakans", icon: <Building /> },
      { label: "Supplier", href: "/suppliers", icon: <Building /> },
      { label: "Mata Pelajaran", href: "/subjects", icon: <BookType /> },
      { label: "Daftar Buku", href: "/books", icon: <Album /> },
    ],
  },
  {
    label: "Bookflow",
    items: [
      { label: "Belanja Buku", href: "/purchase-orders", icon: <ShoppingCart /> },
      { label: "Buku Masuk Gudang", href: "/goods-receipts", icon: <ArrowBigDown /> },
      { label: "Pesanan Customer", href: "/customer-orders", icon: <ListChecks /> },
      { label: "Pengiriman", href: "/goods-out", icon: <Truck /> },
      {
        label: "Retur",
        icon: <Undo2 />,
        children: [
          { label: "Retur Customer", href: "/returns/customer" },
          { label: "Retur Supplier", href: "/returns/supplier" },
        ],
      },
    ],
  },
  {
    label: "Advanced",
    items: [
      {
        label: "Prioritas Pengiriman",
        href: "/priority-distribution",
        icon: <BrainCircuit />,
      },
    ],
  },
];