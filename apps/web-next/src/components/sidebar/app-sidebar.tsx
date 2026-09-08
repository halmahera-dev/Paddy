"use client";

import { Book01Icon, Factory01Icon, Home01Icon, IceCubesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@tigris/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavUser from "./nav-user";

const items = [
  { title: "Home", to: "/", icon: Home01Icon },
  { title: "Blog", to: "/blog", icon: Book01Icon },
  { title: "Warehouse", to: "/warehouse", icon: Factory01Icon },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-1">
            <SidebarMenuButton
              className="text-sidebar-accent-foreground"
              render={<Link href="/" />}
            >
              <HugeiconsIcon icon={IceCubesIcon} />
              <span className="font-semibold text-base">Tigris</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={pathname === item.to}
                    render={<Link href={item.to} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
