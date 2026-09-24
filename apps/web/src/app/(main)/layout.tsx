import { SidebarInset, SidebarProvider } from "@tigris/ui/components/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { requireSession } from "@/features/user/user-queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-y-auto overflow-x-hidden border shadow-none">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
