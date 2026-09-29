import { SidebarInset, SidebarProvider } from "@paddy-field/ui/components/sidebar";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import NavUser from "@/components/sidebar/nav-user";
import { requireSession } from "@/features/user/user-queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      <AppSidebar
        userMenu={
          <NavUser name={session.user.name} email={session.user.email} image={session.user.image} />
        }
      />
      <SidebarInset className="overflow-x-hidden overflow-y-auto overscroll-contain">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
