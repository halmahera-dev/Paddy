import { SidebarInset, SidebarProvider } from "@paddy-field/ui/components/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { requireSession } from "@/features/user/user-queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-y-auto overflow-x-hidden overscroll-contain">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
