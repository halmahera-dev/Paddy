import type { Metadata } from "next";

import { Toaster } from "@paddy-field/ui/components/sonner";
import { TooltipProvider } from "@paddy-field/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";
import { siteDescription, siteUrl } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "One Field",
  title: {
    default: "One Field",
    template: "%s | One Field",
  },
  description: siteDescription,
  icons: {
    icon: { url: "/logo.png", type: "image/png", sizes: "512x512" },
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
