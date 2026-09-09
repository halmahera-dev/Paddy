import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@tigris/ui/components/sonner";
import { TooltipProvider } from "@tigris/ui/components/tooltip";

import { getUser } from "@/functions/get-user";

import { ThemeProvider } from "../components/theme-provider";

import appCss from "../index.css?url";

export type Session = Awaited<ReturnType<typeof getUser>>;
export type RouterAppContext = { session: Session };

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async () => ({ session: await getUser() }),

  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <TooltipProvider>
            <Outlet />
            <Toaster richColors />
            <TanStackRouterDevtools position="bottom-left" />
            <Scripts />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
