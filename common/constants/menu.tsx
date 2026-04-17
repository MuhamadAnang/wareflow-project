"use client";

import {
  Album,
  ArrowBigDown,
  BookType,
  BrainCircuit,
  Building,
  LayoutDashboard,
  Library,
  ListChecks,
  ShoppingCart,
  Truck,
  Undo,
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
  // {
  //   label: "Master Buku",
  //   icon: <BookOpenText />,
  //   children: [
  //     {
  //       label: "Buku Masuk",
  //       href: "/bukumasuk",
  //     },
  //     {
  //       label: "Buku Keluar",
  //       href: "/bukukeluar",
  //     },
  //   ],
  // },
  // {
  //   label: "User",
  //   href: "/users",
  //   icon: <User />,
  // },
  {
    label: "Customer",
    href: "/customers",
    icon: <Users />,
  },
  {
    label: "Supplier",
    href: "/suppliers",
    icon: <Building />,
  },
  {
    label: "Mata Pelajaran",
    href: "/subjects",
    icon: <BookType />,
  },
  {
    label: "Judul Buku",
    href: "/book-titles",
    icon: <Library />,
  },
  {
    label: "Daftar Buku",
    href: "/books",
    icon: <Album />,
  },
  {
    label: "Belanja Buku",
    href: "/purchase-orders",
    icon: <ShoppingCart />,
  },
  {
    label: "Buku Masuk Gudang",
    href: "/goods-receipts",
    icon: <ArrowBigDown />,
  },
  {
    label: "Pesanan Customer",
    href: "/customer-orders",
    icon: <ListChecks />,
  },
  {
    label: "Pengiriman",
    href: "/goods-out",
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
