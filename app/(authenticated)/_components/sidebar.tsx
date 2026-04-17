"use client";

import Logo from "@/app/_components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import { MENU_ITEMS, MenuItem, MenuWithChildren } from "@/common/constants/menu";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const checkIsMenuActive = (menuPath: string, currentPath: string) => {
  const path = currentPath.split("?")[0];
  return path === menuPath;
};

export default function AuthenticatedSidebar() {
  const pathname = usePathname();

  const isMenuActive = useMemo(() => {
    return (menuPath: string) => checkIsMenuActive(menuPath, pathname);
  }, [pathname]);

  return (
    <Sidebar containerClassName="z-999 relative bg-transparent" className="bg-transparent">
      <SidebarHeader className="flex justify-between items-center flex-row p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item, index) =>
                item.children && item.children.length > 0 ? (
                  <CollapsibleMenuItem key={index} item={item} isActive={isMenuActive} />
                ) : (
                  <SingleMenuItem
                    key={index}
                    item={item}
                    isActive={isMenuActive(item.href ?? "")}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Menu item dengan children (collapsible)
const CollapsibleMenuItem = ({
  item,
  isActive,
}: {
  item: MenuWithChildren;
  isActive: (path: string) => boolean;
}) => {
  const isAnyChildActive = item.children?.some((child) => isActive(child.href ?? ""));

  return (
    <Collapsible defaultOpen={isAnyChildActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={isAnyChildActive}>
            {item.icon}
            {item.label}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child, index) => (
              <SidebarMenuSubItem key={index}>
                <SidebarMenuSubButton asChild isActive={isActive(child.href ?? "")}>
                  <Link href={child.href ?? "#"}>
                    {child.icon}
                    {child.label}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

// Menu item tanpa children
const SingleMenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.href ?? "#"}>
          {item.icon}
          {item.label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
