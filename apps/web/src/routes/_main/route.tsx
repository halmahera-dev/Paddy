import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@tigris/ui/components/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/sign-in" });
    }
    return { session: context.session };
  },
});

function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-y-auto overflow-x-hidden border shadow-none">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
