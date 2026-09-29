"use client";

import { Book01Icon, Home01Icon, Plant02Icon, MapsGlobal02Icon } from "@hugeicons/core-free-icons";
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
} from "@paddy-field/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavUser from "./nav-user";

const items = [
  { title: "Overview", to: "/", icon: Home01Icon },
  { title: "Maps", to: "/maps", icon: MapsGlobal02Icon },
  { title: "Blog", to: "/blog", icon: Book01Icon },
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
              <HugeiconsIcon icon={Plant02Icon} />
              <span className="text-base font-semibold">One Field</span>
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
